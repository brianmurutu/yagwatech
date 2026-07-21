import { NextResponse } from "next/server";
import { createEmployee } from "@/lib/employeeStore";
import { getClientIp, formLimiter, rateLimitResponse } from "@/lib/rateLimit";
import { validateOrigin } from "@/lib/csrf";
import { getBrandedEmailHtml } from "@/lib/emailTemplate";
import { site } from "@/lib/site";
import { Resend } from "resend";

// ── Phone normalizer ──────────────────────────────────────────────────────────
// Converts any Kenyan number format to 254XXXXXXXXX
function normalizePhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("254") && cleaned.length === 12) return cleaned;
  if (cleaned.startsWith("0") && cleaned.length === 10) return "254" + cleaned.substring(1);
  if ((cleaned.startsWith("7") || cleaned.startsWith("1")) && cleaned.length === 9) return "254" + cleaned;
  return cleaned; // fallback — let API surface the error
}

// ── TextSMS sender ────────────────────────────────────────────────────────────
async function sendSMS(to: string, message: string): Promise<void> {
  const apiKey    = process.env.TEXTSMS_API_KEY;
  const partnerId = process.env.TEXTSMS_PARTNER_ID;
  const shortcode = process.env.TEXTSMS_SHORTCODE || "TextSMS";

  if (!apiKey || !partnerId) {
    console.warn(`[SMS] Credentials not set. Skipping SMS to ${to}`);
    return;
  }

  const normalized = normalizePhoneNumber(to);
  console.log(`[SMS] Sending to ${normalized} (raw: ${to})`);

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
    console.log("[SMS API Response]:", JSON.stringify(body));

    const code = body?.responses?.[0]?.["response-code"];
    if (code === 200 || code === "200") {
      console.log(`[SMS] ✓ Sent to ${normalized}`);
    } else {
      console.error(`[SMS] ✗ Failed for ${normalized}:`, body);
    }
  } catch (e) {
    console.error(`[SMS] Exception sending to ${normalized}:`, e);
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
  if (error) {
    console.error(`[Email] Failed to send "${opts.subject}":`, error);
  } else {
    console.log(`[Email] ✓ Sent "${opts.subject}" to ${JSON.stringify(opts.to)}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  const originErr = validateOrigin(request);
  if (originErr) return originErr;

  const ip = getClientIp(request);
  const rl = formLimiter.check(ip);
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const body = await request.json();
    const { fullName, email, phone, password } = body;

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const employee = await createEmployee(fullName, email, phone, password);
    if (!employee) {
      return NextResponse.json(
        { error: "An employee with this email is already registered." },
        { status: 400 }
      );
    }

    const baseUrl   = process.env.NEXT_PUBLIC_SITE_URL || site.url;
    const portalUrl = `${baseUrl}/portal`;
    const kycUrl    = `${baseUrl}/kyc?email=${encodeURIComponent(employee.email)}`;

    const resendKey = process.env.RESEND_API_KEY;

    // ── 1. Welcome Email → Employee ───────────────────────────────────────────
    if (resendKey) {
      const resend = new Resend(resendKey);
      const employeeEmailHtml = getBrandedEmailHtml(
        `
        <h2 style="color:#0B3D91;margin-top:0;font-size:20px;font-weight:700;border-bottom:2px solid #EEF1F7;padding-bottom:12px;margin-bottom:16px;">
          Welcome to YagwaTech! 🎉
        </h2>
        <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
          Hello <strong>${employee.fullName}</strong>,
        </p>
        <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
          Your team portal account has been successfully created. Welcome to the team!
        </p>
        <p style="color:#F47B20;font-size:15px;font-weight:600;line-height:1.6;margin-bottom:24px;">
          ⚠️ IMPORTANT: You must complete KYC identity verification before you can log in.
        </p>

        <div style="text-align:center;margin:32px 0;">
          <a href="${kycUrl}" style="background-color:#F47B20;color:white;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:14px;display:inline-block;margin:8px;">
            1. Complete KYC Verification →
          </a>
          <br/>
          <a href="${portalUrl}" style="background-color:#0B3D91;color:white;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:14px;display:inline-block;margin:8px;">
            2. Login to Team Portal →
          </a>
        </div>

        <div style="background-color:#F7F9FC;padding:16px;border-radius:8px;border:1px solid #EEF1F7;margin:24px 0;">
          <p style="margin:0;font-size:13px;color:#1A1A2E;"><strong>Login Email:</strong> ${employee.email}</p>
          <p style="margin:6px 0 0;font-size:13px;color:#1A1A2E;"><strong>Registered Phone:</strong> ${employee.phone}</p>
        </div>

        <p style="color:#5A6680;font-size:13px;line-height:1.6;margin-top:24px;">
          If you did not authorise this registration, please contact system administration immediately at <a href="mailto:${site.email}">${site.email}</a>.
        </p>
        `,
        {
          title:    "Welcome to YagwaTech Team Portal",
          preheader: "Complete your KYC verification to activate your account.",
        }
      );

      await sendEmail(resend, {
        from:    `YagwaTech Portal <onboarding@yagwatech.com>`,
        to:      employee.email,
        subject: "Welcome to YagwaTech — Please Complete Your KYC Verification",
        html:    employeeEmailHtml,
      });

      // ── 2. Admin Alert Email → Internal Team ────────────────────────────────
      const adminEmailHtml = getBrandedEmailHtml(
        `
        <h2 style="color:#0B3D91;margin-top:0;font-size:18px;font-weight:700;border-bottom:2px solid #EEF1F7;padding-bottom:12px;margin-bottom:16px;">
          🆕 New Employee Signup
        </h2>
        <p style="color:#1A1A2E;font-size:14px;line-height:1.6;margin-bottom:16px;">
          A new employee account has been created on the YagwaTech Portal. Details below:
        </p>
        <div style="background-color:#F7F9FC;padding:16px;border-radius:8px;border:1px solid #EEF1F7;margin:16px 0;">
          <p style="margin:0;font-size:13px;color:#1A1A2E;"><strong>Full Name:</strong> ${employee.fullName}</p>
          <p style="margin:6px 0 0;font-size:13px;color:#1A1A2E;"><strong>Email:</strong> ${employee.email}</p>
          <p style="margin:6px 0 0;font-size:13px;color:#1A1A2E;"><strong>Phone:</strong> ${employee.phone}</p>
          <p style="margin:6px 0 0;font-size:13px;color:#1A1A2E;"><strong>Employee ID:</strong> <span style="font-family:monospace;background:#EEF1F7;padding:2px 6px;border-radius:4px;">${employee.id}</span></p>
          <p style="margin:6px 0 0;font-size:13px;color:#1A1A2E;"><strong>KYC Status:</strong> <span style="color:#F47B20;font-weight:600;">Pending — awaiting verification</span></p>
          <p style="margin:6px 0 0;font-size:13px;color:#5A6680;"><strong>Registered At:</strong> ${new Date(employee.createdAt).toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })}</p>
        </div>
        <p style="color:#5A6680;font-size:12px;margin-top:24px;">
          This employee cannot log in until KYC is approved. You can monitor status in the Admin Panel.
        </p>
        `,
        {
          title:    "New Employee Signup — YagwaTech Admin",
          preheader: `${employee.fullName} has registered on the team portal.`,
        }
      );

      await sendEmail(resend, {
        from:    `YagwaTech Portal <onboarding@yagwatech.com>`,
        to:      site.adminEmails,
        subject: `[Admin] New Employee Signup: ${employee.fullName}`,
        html:    adminEmailHtml,
      });
    } else {
      console.warn("[Email] RESEND_API_KEY not set — skipping employee + admin emails.");
    }

    // ── 3. Welcome SMS → Employee ─────────────────────────────────────────────
    await sendSMS(
      employee.phone,
      `Hello ${employee.fullName}, welcome to YagwaTech! Complete KYC to activate your account: ${kycUrl}`
    );

    // ── 4. Admin SMS Alert → Admin phone ─────────────────────────────────────
    const adminPhone = process.env.ADMIN_PHONE;
    if (adminPhone) {
      await sendSMS(
        adminPhone,
        `[YagwaTech] New employee signup: ${employee.fullName} (${employee.email}). KYC pending.`
      );
    }

    return NextResponse.json({
      success:  true,
      message:  "Employee registered successfully.",
      employee: {
        id:       employee.id,
        fullName: employee.fullName,
        email:    employee.email,
      },
    });
  } catch (error) {
    console.error("[Portal Signup Route Error]:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
