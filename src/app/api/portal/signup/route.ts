import { NextResponse } from "next/server";
import { createEmployee } from "@/lib/employeeStore";
import { getClientIp, formLimiter, rateLimitResponse } from "@/lib/rateLimit";
import { validateOrigin } from "@/lib/csrf";
import { getBrandedEmailHtml } from "@/lib/emailTemplate";
import { site } from "@/lib/site";

// Simple helper to normalize Kenyan phone numbers to format 254XXXXXXXXX
function normalizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, ""); // Remove non-numeric characters
  if (cleaned.startsWith("0")) {
    cleaned = "254" + cleaned.substring(1);
  } else if (cleaned.startsWith("7") || cleaned.startsWith("1")) {
    cleaned = "254" + cleaned;
  }
  return cleaned;
}

export async function POST(request: Request) {
  // CSRF Check
  const originErr = validateOrigin(request);
  if (originErr) return originErr;

  // Rate Limiting
  const ip = getClientIp(request);
  const rl = formLimiter.check(ip);
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const body = await request.json();
    const { fullName, email, phone, password } = body;

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const employee = createEmployee(fullName, email, phone, password);
    if (!employee) {
      return NextResponse.json({ error: "An employee with this email is already registered." }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || site.url;
    const portalUrl = `${baseUrl}/portal`;
    const kycUrl = `${baseUrl}/kyc?email=${encodeURIComponent(employee.email)}`;

    // ── Send Email Notification (Resend API) ──
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
        const emailContent = `
          <h2 style="color: #0B3D91; margin-top: 0; font-size: 20px; font-weight: 700; border-bottom: 2px solid #EEF1F7; padding-bottom: 12px; margin-bottom: 16px;">
            Welcome to YagwaTech!
          </h2>
          <p style="color: #1A1A2E; font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
            Hello <strong>${employee.fullName}</strong>,
          </p>
          <p style="color: #1A1A2E; font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
            Welcome to the team! Your employee portal account has been successfully created.
          </p>
          <p style="color: #1A1A2E; font-size: 15px; line-height: 1.6; margin-bottom: 16px; font-weight: 600; color: #F47B20;">
            IMPORTANT: You must complete your identity verification (KYC) before you can log in to your profile.
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${kycUrl}" style="background-color: #F47B20; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px rgba(244, 123, 32, 0.2);">
              Complete KYC Verification
            </a>
          </div>
          <p style="color: #1A1A2E; font-size: 15px; line-height: 1.6; margin-bottom: 16px;">
            Once verified, you will be able to log in using your credentials to access project Kanban boards, manage tasks, and read company docs:
          </p>
          <div style="background-color: #F7F9FC; padding: 16px; border-radius: 8px; border: 1px solid #EEF1F7; margin: 24px 0;">
            <p style="margin: 0; font-size: 13px; color: #1A1A2E;"><strong>Login Email:</strong> ${employee.email}</p>
            <p style="margin: 5px 0 0 0; font-size: 13px; color: #1A1A2E;"><strong>Portal Link:</strong> <a href="${portalUrl}" style="color: #0B3D91; text-decoration: underline;">${portalUrl}</a></p>
          </div>
          <p style="color: #5A6680; font-size: 13px; line-height: 1.6; margin-top: 24px;">
            If you did not authorize this registration, please contact system administration immediately.
          </p>
        `;

        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "YagwaTech Portal <onboarding@yagwatech.com>",
            to: [employee.email],
            subject: "Welcome to YagwaTech Employee Portal!",
            html: getBrandedEmailHtml(emailContent, {
              title: "Welcome to YagwaTech Employee Portal",
              preheader: "Please complete your identity verification to access your profile.",
            }),
          }),
        });

        if (!emailRes.ok) {
          const errText = await emailRes.text();
          console.error("[Resend API Error]:", errText);
        } else {
          console.log(`[Resend Notification] Welcome email sent successfully to ${employee.email}`);
        }
      } catch (e) {
        console.error("[Email Notification Exception]:", e);
      }
    } else {
      console.warn(`[Portal Notification Cache] RESEND_API_KEY is not defined. Simulating welcome email for: ${employee.email}`);
    }

    // ── Send SMS Notification (TextSMS.co.ke API) ──
    const smsApiKey = process.env.TEXTSMS_API_KEY;
    const smsPartnerId = process.env.TEXTSMS_PARTNER_ID;
    const smsShortcode = process.env.TEXTSMS_SHORTCODE || "TextSMS";

    if (smsApiKey && smsPartnerId) {
      try {
        const normalizedPhone = normalizePhoneNumber(employee.phone);
        const smsMessage = `Hello ${employee.fullName}, welcome to YagwaTech. Please complete your identity verification (KYC) at: ${kycUrl} to log in.`;

        const smsRes = await fetch("https://sms.textsms.co.ke/api/services/sendsms/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            apikey: smsApiKey,
            partnerID: smsPartnerId,
            message: smsMessage,
            shortcode: smsShortcode,
            mobile: normalizedPhone,
          }),
        });

        if (!smsRes.ok) {
          const errText = await smsRes.text();
          console.error("[TextSMS API Error]:", errText);
        } else {
          console.log(`[TextSMS Notification] Welcome SMS sent successfully to ${normalizedPhone}`);
        }
      } catch (e) {
        console.error("[SMS Notification Exception]:", e);
      }
    } else {
      console.warn(`[Portal Notification Cache] TEXTSMS API credentials are not defined. Simulating welcome SMS for phone: ${employee.phone}`);
    }

    return NextResponse.json({
      success: true,
      message: "Employee registered successfully.",
      employee: {
        id: employee.id,
        fullName: employee.fullName,
        email: employee.email,
      },
    });
  } catch (error) {
    console.error("[Portal Signup Route Error]:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
