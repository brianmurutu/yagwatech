import { NextResponse } from "next/server";
import { Resend } from "resend";
import { partnerSchema } from "@/lib/validation";
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
    const parsed = partnerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { companyName, contactName, email, phone, website, partnershipType, message } = parsed.data;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service is not configured yet. Please try again later or reach us on WhatsApp." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    // 1. Send proposal notification to Yagwa Tech Admin Team
    const { error: notifyError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: site.adminEmails,
      replyTo: email,
      subject: `[Partnership Request] ${companyName} (${partnershipType})`,
      html: getBrandedEmailHtml(
        `
        <h2 style="color:#0B3D91;margin-top:0;font-size:20px;font-weight:700;margin-bottom:16px;border-bottom:2px solid #EEF1F7;padding-bottom:12px;">
          New Partnership Request
        </h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;width:150px;"><strong>Organization:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;font-weight:600;">${escapeHtml(companyName)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;"><strong>Contact Person:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;">${escapeHtml(contactName)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;"><strong>Email:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;"><a href="mailto:${escapeHtml(email)}" style="color:#0B3D91;text-decoration:none;">${escapeHtml(email)}</a></td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;"><strong>Phone:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;">${escapeHtml(phone)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;"><strong>Website:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;">
              ${website ? `<a href="${escapeHtml(website)}" target="_blank" style="color:#0B3D91;text-decoration:none;">${escapeHtml(website)}</a>` : "Not provided"}
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;"><strong>Category:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;"><span style="background:#EEF1F7;color:#0B3D91;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:600;">${escapeHtml(partnershipType)}</span></td>
          </tr>
        </table>
        <div style="background:#F7F9FC;border-left:4px solid #0B3D91;padding:20px;border-radius:6px;margin-bottom:24px;">
          <strong style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#5A6680;display:block;margin-bottom:8px;">Proposal / Message:</strong>
          <p style="margin:0;font-size:14px;color:#1A1A2E;line-height:1.6;white-space:pre-line;">${escapeHtml(message)}</p>
        </div>
        <p style="margin:0;font-size:13px;color:#5A6680;line-height:1.5;">
          You can reply directly to this email to coordinate with ${escapeHtml(contactName)} from ${escapeHtml(companyName)}.
        </p>
        `,
        {
          title: `[Partnership Request] ${companyName}`,
          preheader: `New partnership proposal from ${contactName} (${companyName}) for category ${partnershipType}`,
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

    // 2. Send confirmation email to the submitter (Future Partner)
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: `Partnership Proposal Received — ${site.name}`,
      html: getBrandedEmailHtml(
        `
        <h2 style="color:#0B3D91;margin-top:0;font-size:20px;font-weight:700;margin-bottom:16px;">Hello ${escapeHtml(contactName)},</h2>
        <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
          Thank you for submitting a partnership proposal for <strong>${escapeHtml(companyName)}</strong> under the category of <strong>${escapeHtml(partnershipType)}</strong>. We are thrilled at the prospect of working together.
        </p>
        <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
          Our partnership evaluation and strategy team will review your scope of interest and proposal details. We strive to evaluate all requests within <strong>2 to 3 business days</strong>. If there's a strong mutual alignment, one of our partnership lead managers will reach out to schedule an introductory discovery call.
        </p>
        <div style="background:#EEF4FF;border-left:4px solid #0B3D91;padding:18px;border-radius:6px;margin:24px 0;">
          <h3 style="margin:0 0 6px 0;color:#0B3D91;font-size:15px;font-weight:700;">Book an Introductory Alignment Call</h3>
          <p style="margin:0 0 14px 0;color:#1A1A2E;font-size:13.5px;line-height:1.5;">
            To expedite your proposal review, please schedule a brief 15-minute introductory meeting with our partnership committee.
          </p>
          <a href="${site.calendly}" target="_blank" style="display:inline-block;background-color:#0B3D91;color:#ffffff;text-decoration:none;padding:10px 18px;font-size:13px;font-weight:700;border-radius:6px;box-shadow:0 2px 4px rgba(11,61,145,0.15);">
            Schedule meeting on Calendly
          </a>
        </div>
        <div style="background:#FFF8F2;border-left:4px solid #F47B20;padding:16px;border-radius:6px;margin:24px 0;">
          <p style="margin:0;font-size:13.5px;color:#C2611A;line-height:1.5;">
            <strong>What happens next?</strong><br/>
            1. Technical & business feasibility alignment review.<br/>
            2. Introduction call setup to discuss objectives & synergy.<br/>
            3. Memorandum/SLA drafting for official integration.
          </p>
        </div>
        <p style="color:#5A6680;font-size:14px;line-height:1.6;margin-bottom:24px;">
          If you need to share any additional resources or deck presentation, please do not hesitate to reach us directly at <a href="mailto:${site.email}" style="color:#0B3D91;text-decoration:none;font-weight:500;">${site.email}</a> or talk to our team via WhatsApp: <a href="${site.social.whatsapp}" style="color:#F47B20;font-weight:600;text-decoration:none;">${site.phone}</a>.
        </p>
        <p style="color:#1A1A2E;font-size:14px;margin-bottom:0;">
          Best Regards,<br/>
          <strong>Partnership Steering Committee</strong><br/>
          ${site.name}
        </p>
        `,
        {
          title: `Partnership Proposal Received — ${site.name}`,
          preheader: `Thank you for interest in partnering with Yagwa Tech Solutions. Our steering committee will review your proposal.`,
        }
      ),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Partnership form submit error:", error);
    return NextResponse.json(
      { error: "Something went wrong sending your proposal. Please try again." },
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
