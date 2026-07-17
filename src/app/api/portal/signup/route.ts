import { NextResponse } from "next/server";
import { createEmployee } from "@/lib/employeeStore";
import { getClientIp, formLimiter, rateLimitResponse } from "@/lib/rateLimit";
import { validateOrigin } from "@/lib/csrf";

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

    // ── Send Email Notification (Resend API) ──
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      try {
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
            html: `
              <div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px border #e2e8f0; rounded: 12px;">
                <div style="text-align: center; border-bottom: 2px solid #F47B20; padding-bottom: 15px;">
                  <h2 style="color: #07255A; margin: 0;">YagwaTech Employee Portal</h2>
                </div>
                <div style="padding: 20px 0;">
                  <p>Hello <strong>${employee.fullName}</strong>,</p>
                  <p>Welcome to the family! Your employee workspace account has been successfully created.</p>
                  <p>You can now log in using your email address and password to view and collaborate on Zoho Project Kanban boards, manage checklist tasks, and read company documentation.</p>
                  <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
                    <p style="margin: 0; font-size: 13px;"><strong>Login Email:</strong> ${employee.email}</p>
                    <p style="margin: 5px 0 0 0; font-size: 13px;"><strong>Phone:</strong> ${employee.phone}</p>
                  </div>
                  <p>If you did not authorize this registration, please contact system administration immediately.</p>
                </div>
                <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #64748b;">
                  Yagwa Tech Solutions Ltd &middot; Nairobi, Kenya
                </div>
              </div>
            `,
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
        const smsMessage = `Hello ${employee.fullName}, welcome to the YagwaTech Employee Portal. Your account has been registered successfully. - YagwaTech Solutions`;

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
