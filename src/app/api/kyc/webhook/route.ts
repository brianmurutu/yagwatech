import { NextResponse } from "next/server";
import { updateKYCStatus } from "@/lib/kycStore";
import { getEmployeeByEmail } from "@/lib/employeeStore";
import { getBrandedEmailHtml } from "@/lib/emailTemplate";
import { site } from "@/lib/site";
import { Resend } from "resend";
import crypto from "crypto";

// ── Phone normalizer ──────────────────────────────────────────────────────────
function normalizePhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("254") && cleaned.length === 12) return cleaned;
  if (cleaned.startsWith("0") && cleaned.length === 10) return "254" + cleaned.substring(1);
  if ((cleaned.startsWith("7") || cleaned.startsWith("1")) && cleaned.length === 9) return "254" + cleaned;
  return cleaned;
}

// ── TextSMS sender ────────────────────────────────────────────────────────────
async function sendSMS(to: string, message: string): Promise<void> {
  const apiKey    = process.env.TEXTSMS_API_KEY;
  const partnerId = process.env.TEXTSMS_PARTNER_ID;
  const shortcode = process.env.TEXTSMS_SHORTCODE || "TextSMS";
  if (!apiKey || !partnerId) return;

  const normalized = normalizePhoneNumber(to);
  try {
    const res = await fetch("https://sms.textsms.co.ke/api/services/sendsms/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apikey:    apiKey,
        partnerID: parseInt(partnerId, 10),
        message,
        shortcode,
        mobile: normalized,
      }),
    });
    const body = await res.json().catch(() => null);
    const code = body?.responses?.[0]?.["response-code"];
    if (code === 200 || code === "200") {
      console.log(`[SMS] ✓ Sent to ${normalized}`);
    } else {
      console.error(`[SMS] ✗ Failed for ${normalized}:`, body);
    }
  } catch (e) {
    console.error(`[SMS] Exception for ${normalized}:`, e);
  }
}

// ── Resend email helper ───────────────────────────────────────────────────────
async function sendEmail(
  resend: Resend,
  opts: { to: string | string[]; subject: string; html: string; from?: string }
): Promise<void> {
  const { error } = await resend.emails.send({
    from:    opts.from ?? `YagwaTech <noreply@yagwatech.com>`,
    to:      Array.isArray(opts.to) ? opts.to : [opts.to],
    subject: opts.subject,
    html:    opts.html,
  });
  if (error) console.error(`[Email] Failed "${opts.subject}":`, error);
  else console.log(`[Email] ✓ Sent "${opts.subject}" to ${JSON.stringify(opts.to)}`);
}

// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    // ── Signature Verification ────────────────────────────────────────────────
    // Persona-Signature header format: "t=<unix_timestamp>,v1=<hex_hmac>"
    // Signed string: "<timestamp>.<rawBody>"
    const signatureHeader = request.headers.get("Persona-Signature");
    const secret = process.env.PERSONA_WEBHOOK_SECRET;

    if (secret && signatureHeader) {
      try {
        const pairs = signatureHeader.split(" ");
        let verified = false;

        for (const pair of pairs) {
          const params = Object.fromEntries(
            pair.split(",").map((part) => part.split("=") as [string, string])
          );
          const timestamp = params["t"];
          const v1        = params["v1"];
          if (!timestamp || !v1) continue;

          const expectedHmac = crypto
            .createHmac("sha256", secret)
            .update(`${timestamp}.${rawBody}`)
            .digest("hex");

          const expectedBuf = Buffer.from(expectedHmac, "hex");
          const receivedBuf = Buffer.from(v1, "hex");
          if (
            expectedBuf.length === receivedBuf.length &&
            crypto.timingSafeEqual(expectedBuf, receivedBuf)
          ) {
            verified = true;
            break;
          }
        }

        if (!verified) {
          console.warn("[Persona Webhook] Invalid signature. Rejecting.");
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
      } catch (sigErr) {
        console.error("[Persona Webhook] Signature error:", sigErr);
        return NextResponse.json({ error: "Signature error" }, { status: 400 });
      }
    } else if (!secret) {
      console.warn("[Persona Webhook] PERSONA_WEBHOOK_SECRET not set — skipping signature check (dev mode).");
    }

    // ── Parse Payload ─────────────────────────────────────────────────────────
    // Persona body: { data: { type, id, attributes: { status, "reference-id", ... } } }
    const body = JSON.parse(rawBody);

    const eventName: string  = body?.data?.type ?? body?.event ?? "";
    const attributes         = body?.data?.attributes ?? body?.payload?.attributes ?? body?.payload ?? {};
    const inquiryId: string  = body?.data?.id ?? attributes?.id ?? "";

    const referenceId: string =
      attributes?.["reference-id"] ??
      attributes?.referenceId ??
      attributes?.client_reference_id ??
      body?.payload?.referenceId ??
      "";

    const personaStatus: string = attributes?.status ?? body?.payload?.status ?? "";

    console.log(`[Persona Webhook] Event: "${eventName}" | Status: "${personaStatus}" | Ref: "${referenceId}" | Inquiry: "${inquiryId}"`);

    if (!referenceId) {
      console.warn("[Persona Webhook] Missing referenceId — cannot update record.");
      return NextResponse.json({ success: true, warning: "Missing referenceId" });
    }

    // ── Map Persona status → internal status ──────────────────────────────────
    let mappedStatus: "Verified" | "Failed" | "Pending" | "Not Started" = "Pending";

    if (eventName === "inquiry.approved" || personaStatus === "approved") {
      mappedStatus = "Verified";
    } else if (
      eventName === "inquiry.failed"   ||
      eventName === "inquiry.declined" ||
      personaStatus === "failed"       ||
      personaStatus === "declined"
    ) {
      mappedStatus = "Failed";
    } else if (
      eventName === "inquiry.created" ||
      eventName === "inquiry.started" ||
      personaStatus === "created"     ||
      personaStatus === "pending"
    ) {
      mappedStatus = "Pending";
    }

    await updateKYCStatus(referenceId, mappedStatus, inquiryId);
    console.log(`[Persona Webhook] KYC status → "${mappedStatus}" for ${referenceId}`);

    // ── Post-KYC Notifications ────────────────────────────────────────────────
    // Only send notifications on terminal states (Verified / Failed)
    if (mappedStatus === "Verified" || mappedStatus === "Failed") {
      const baseUrl   = process.env.NEXT_PUBLIC_SITE_URL || site.url;
      const portalUrl = `${baseUrl}/portal`;

      // Look up the employee to personalise messages
      const employee = await getEmployeeByEmail(referenceId);
      const name     = employee?.fullName ?? referenceId;
      const phone    = employee?.phone;

      const resendKey = process.env.RESEND_API_KEY;

      if (mappedStatus === "Verified") {
        // ── Verification Success: email + SMS → employee ──────────────────────
        if (resendKey) {
          const resend = new Resend(resendKey);

          await sendEmail(resend, {
            from:    `YagwaTech Portal <onboarding@yagwatech.com>`,
            to:      referenceId,
            subject: "✅ Your KYC Verification is Approved — You Can Now Log In!",
            html: getBrandedEmailHtml(
              `
              <h2 style="color:#059669;margin-top:0;font-size:20px;font-weight:700;border-bottom:2px solid #EEF1F7;padding-bottom:12px;margin-bottom:16px;">
                Identity Verified Successfully ✅
              </h2>
              <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
                Hello <strong>${name}</strong>,
              </p>
              <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
                Great news! Your identity verification (KYC) has been <strong style="color:#059669;">approved</strong>. Your YagwaTech team portal account is now fully active.
              </p>
              <div style="text-align:center;margin:32px 0;">
                <a href="${portalUrl}" style="background-color:#0B3D91;color:white;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:14px;display:inline-block;">
                  Login to Team Portal →
                </a>
              </div>
              <p style="color:#5A6680;font-size:13px;line-height:1.6;">
                Use your registered email and password to log in. If you have any issues, contact <a href="mailto:${site.supportEmail}">${site.supportEmail}</a>.
              </p>
              `,
              {
                title:    "KYC Approved — YagwaTech Portal",
                preheader: "Your identity has been verified. You can now log in.",
              }
            ),
          });

          // ── Admin alert: employee KYC approved ─────────────────────────────
          await sendEmail(resend, {
            from:    `YagwaTech Portal <onboarding@yagwatech.com>`,
            to:      site.adminEmails,
            subject: `[Admin] KYC Approved: ${name}`,
            html: getBrandedEmailHtml(
              `
              <h2 style="color:#059669;margin-top:0;font-size:18px;font-weight:700;border-bottom:2px solid #EEF1F7;padding-bottom:12px;margin-bottom:16px;">
                Employee KYC Approved ✅
              </h2>
              <div style="background-color:#F7F9FC;padding:16px;border-radius:8px;border:1px solid #EEF1F7;margin:16px 0;">
                <p style="margin:0;font-size:13px;color:#1A1A2E;"><strong>Name:</strong> ${name}</p>
                <p style="margin:6px 0 0;font-size:13px;color:#1A1A2E;"><strong>Email:</strong> ${referenceId}</p>
                <p style="margin:6px 0 0;font-size:13px;color:#1A1A2E;"><strong>Inquiry ID:</strong> <span style="font-family:monospace;background:#EEF1F7;padding:2px 6px;border-radius:4px;">${inquiryId}</span></p>
                <p style="margin:6px 0 0;font-size:13px;color:#059669;"><strong>Status:</strong> Verified ✅</p>
              </div>
              <p style="color:#5A6680;font-size:12px;">This employee can now log in to the portal.</p>
              `,
              { title: "KYC Approved — Admin Alert", preheader: `${name} passed KYC.` }
            ),
          });
        }

        // ── SMS: Verification success → employee ──────────────────────────────
        if (phone) {
          await sendSMS(
            phone,
            `YagwaTech: Hi ${name}, your identity verification is approved! You can now log in at ${portalUrl}`
          );
        }

        // ── Admin SMS ─────────────────────────────────────────────────────────
        const adminPhone = process.env.ADMIN_PHONE;
        if (adminPhone) {
          await sendSMS(adminPhone, `[YagwaTech] KYC Approved: ${name} (${referenceId}). Portal access granted.`);
        }

      } else if (mappedStatus === "Failed") {
        // ── Verification Failed: email + SMS → employee ───────────────────────
        const kycUrl = `${baseUrl}/kyc?email=${encodeURIComponent(referenceId)}`;

        if (resendKey) {
          const resend = new Resend(resendKey);

          await sendEmail(resend, {
            from:    `YagwaTech Portal <onboarding@yagwatech.com>`,
            to:      referenceId,
            subject: "❌ KYC Verification Unsuccessful — Please Try Again",
            html: getBrandedEmailHtml(
              `
              <h2 style="color:#DC2626;margin-top:0;font-size:20px;font-weight:700;border-bottom:2px solid #EEF1F7;padding-bottom:12px;margin-bottom:16px;">
                Identity Verification Unsuccessful ❌
              </h2>
              <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
                Hello <strong>${name}</strong>,
              </p>
              <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
                Unfortunately, your identity verification (KYC) was <strong style="color:#DC2626;">not approved</strong>. This may be due to:
              </p>
              <ul style="color:#1A1A2E;font-size:14px;line-height:1.8;padding-left:24px;margin-bottom:24px;">
                <li>Blurry or unclear document images</li>
                <li>Expired or unsupported ID type</li>
                <li>Selfie and document mismatch</li>
                <li>Poor lighting conditions during capture</li>
              </ul>
              <div style="text-align:center;margin:32px 0;">
                <a href="${kycUrl}" style="background-color:#F47B20;color:white;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:14px;display:inline-block;">
                  Retry KYC Verification →
                </a>
              </div>
              <p style="color:#5A6680;font-size:13px;line-height:1.6;">
                If you continue to experience issues, please contact support at <a href="mailto:${site.supportEmail}">${site.supportEmail}</a> or call <a href="tel:${site.phoneRaw}">${site.phone}</a>.
              </p>
              `,
              {
                title:    "KYC Unsuccessful — YagwaTech Portal",
                preheader: "Your verification was not approved. Please retry.",
              }
            ),
          });

          // ── Admin alert: KYC failed ─────────────────────────────────────────
          await sendEmail(resend, {
            from:    `YagwaTech Portal <onboarding@yagwatech.com>`,
            to:      site.adminEmails,
            subject: `[Admin] KYC Failed: ${name}`,
            html: getBrandedEmailHtml(
              `
              <h2 style="color:#DC2626;margin-top:0;font-size:18px;font-weight:700;border-bottom:2px solid #EEF1F7;padding-bottom:12px;margin-bottom:16px;">
                Employee KYC Failed ❌
              </h2>
              <div style="background-color:#FFF5F5;padding:16px;border-radius:8px;border:1px solid #FEE2E2;margin:16px 0;">
                <p style="margin:0;font-size:13px;color:#1A1A2E;"><strong>Name:</strong> ${name}</p>
                <p style="margin:6px 0 0;font-size:13px;color:#1A1A2E;"><strong>Email:</strong> ${referenceId}</p>
                <p style="margin:6px 0 0;font-size:13px;color:#1A1A2E;"><strong>Inquiry ID:</strong> <span style="font-family:monospace;background:#FEE2E2;padding:2px 6px;border-radius:4px;">${inquiryId}</span></p>
                <p style="margin:6px 0 0;font-size:13px;color:#DC2626;"><strong>Status:</strong> Failed ❌</p>
              </div>
              <p style="color:#5A6680;font-size:12px;">Employee has been notified and can retry via the KYC link. You may also manually override in the Admin Panel if needed.</p>
              `,
              { title: "KYC Failed — Admin Alert", preheader: `${name} failed KYC verification.` }
            ),
          });
        }

        // ── SMS: Verification failed → employee ───────────────────────────────
        if (phone) {
          await sendSMS(
            phone,
            `YagwaTech: Hi ${name}, your KYC verification was not approved. Please retry: ${kycUrl} or contact support.`
          );
        }

        // ── Admin SMS ─────────────────────────────────────────────────────────
        const adminPhone = process.env.ADMIN_PHONE;
        if (adminPhone) {
          await sendSMS(adminPhone, `[YagwaTech] KYC Failed: ${name} (${referenceId}). Manual review may be needed.`);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Persona Webhook Error]:", error);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}
