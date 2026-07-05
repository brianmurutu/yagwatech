import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validation";
import { site } from "@/lib/site";
import { getBrandedEmailHtml } from "@/lib/emailTemplate";
import { formLimiter, getClientIp, rateLimitResponse } from "@/lib/rateLimit";
import { validateOrigin } from "@/lib/csrf";

const FROM_ADDRESS = `${site.name} <${site.email}>`;

export async function POST(request: Request) {
  // ── CSRF origin check ────────────────────────────────────────────────────
  const originErr = validateOrigin(request);
  if (originErr) return originErr;

  // ── Rate limit ───────────────────────────────────────────────────────────
  const ip = getClientIp(request);
  const rl = formLimiter.check(ip);
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = parsed.data;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service is not configured yet. Please try again later or reach us on WhatsApp." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    // Send notification to Yagwa Tech admin team
    const { error: notifyError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: site.adminEmails,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: getBrandedEmailHtml(
        `
        <h2 style="color:#0B3D91;margin-top:0;font-size:20px;font-weight:700;margin-bottom:16px;border-bottom:2px solid #EEF1F7;padding-bottom:12px;">
          New Contact Form Message
        </h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;width:120px;"><strong>Name:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;"><strong>Email:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;"><a href="mailto:${escapeHtml(email)}" style="color:#0B3D91;text-decoration:none;">${escapeHtml(email)}</a></td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;"><strong>Phone:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;">${escapeHtml(phone || "Not provided")}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;"><strong>Subject:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;">${escapeHtml(subject)}</td>
          </tr>
        </table>
        <div style="background:#F7F9FC;border-left:4px solid #0B3D91;padding:20px;border-radius:6px;margin-bottom:24px;">
          <strong style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#5A6680;display:block;margin-bottom:8px;">Message:</strong>
          <p style="margin:0;font-size:14px;color:#1A1A2E;line-height:1.6;white-space:pre-line;">${escapeHtml(message)}</p>
        </div>
        <p style="margin:0;font-size:13px;color:#5A6680;line-height:1.5;">
          Reply directly to this email to respond to ${escapeHtml(name)}.
        </p>
        `,
        {
          title: `[Contact] ${subject}`,
          preheader: `New message from ${name}: ${subject}`,
        }
      ),
    });

    if (notifyError) {
      console.error("Resend notify error:", notifyError);
      return NextResponse.json(
        { error: "Email service encountered an error. Please try again later or reach us on WhatsApp." },
        { status: 500 }
      );
    }

    // Send confirmation email to the submitter
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: `We received your message — ${site.name}`,
      html: getBrandedEmailHtml(
        `
        <h2 style="color:#0B3D91;margin-top:0;font-size:20px;font-weight:700;margin-bottom:16px;">Thanks for reaching out, ${escapeHtml(name)}!</h2>
        <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
          We received your message about <strong>"${escapeHtml(subject)}"</strong> and our team will get back to you within one business day.
        </p>
        <p style="color:#5A6680;font-size:14px;line-height:1.6;margin-bottom:24px;">
          In the meantime, feel free to explore our services at <a href="${site.url}" style="color:#0B3D91;font-weight:500;text-decoration:none;">${site.url}</a>
          or reach us directly on WhatsApp: <a href="${site.social.whatsapp}" style="color:#F47B20;font-weight:600;text-decoration:none;">${site.phone}</a>.
        </p>
        `,
        {
          title: `We received your message — ${site.name}`,
          preheader: `Thank you for contacting ${site.name}. We will get back to you within one business day.`,
        }
      ),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please try again." },
      { status: 500 }
    );
  }
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
