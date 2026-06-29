import { NextResponse } from "next/server";
import { Resend } from "resend";
import { quoteSchema } from "@/lib/validation";
import { site } from "@/lib/site";
import { getBrandedEmailHtml } from "@/lib/emailTemplate";

const FROM_ADDRESS = `${site.name} <${site.email}>`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = quoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, phone, company, service, budget, timeline, details } =
      parsed.data;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service is not configured yet. Please try again later or reach us on WhatsApp." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    // Notify the Yagwa Tech admin team
    const { error: notifyError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: site.adminEmails,
      replyTo: email,
      subject: `[Quote Request] ${service}`,
      html: getBrandedEmailHtml(
        `
        <h2 style="color:#0B3D91;margin-top:0;font-size:20px;font-weight:700;margin-bottom:16px;border-bottom:2px solid #EEF1F7;padding-bottom:12px;">
          New Quote Request
        </h2>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;width:140px;"><strong>Name:</strong></td>
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
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;"><strong>Company:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;">${escapeHtml(company || "Not provided")}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;"><strong>Service:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;"><strong style="color:#F47B20;">${escapeHtml(service)}</strong></td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;"><strong>Budget:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;">${escapeHtml(budget || "Not specified")}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;"><strong>Timeline:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;">${escapeHtml(timeline || "Not specified")}</td>
          </tr>
        </table>
        <div style="background:#F7F9FC;border-left:4px solid #0B3D91;padding:20px;border-radius:6px;margin-bottom:24px;">
          <strong style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#5A6680;display:block;margin-bottom:8px;">Project details:</strong>
          <p style="margin:0;font-size:14px;color:#1A1A2E;line-height:1.6;white-space:pre-line;">${escapeHtml(details)}</p>
        </div>
        <p style="margin:0;font-size:13px;color:#5A6680;line-height:1.5;">
          Reply directly to this email to respond to ${escapeHtml(name)}.
        </p>
        `,
        {
          title: `[Quote Request] ${service}`,
          preheader: `New quote request from ${name} for ${service}`,
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

    // Send confirmation email to the requester
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: `Your quote request received — ${site.name}`,
      html: getBrandedEmailHtml(
        `
        <h2 style="color:#0B3D91;margin-top:0;font-size:20px;font-weight:700;margin-bottom:16px;">We received your quote request, ${escapeHtml(name)}!</h2>
        <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
          Thank you for your interest in our <strong>${escapeHtml(service)}</strong> services. 
          Our team will review your requirements and get back to you within <strong>1–2 business days</strong> with a tailored proposal.
        </p>
        <div style="margin:20px 0;padding:20px;background:#FFF7F0;border-left:4px solid #F47B20;border-radius:6px;">
          <strong style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#D96A10;display:block;margin-bottom:8px;">Your Request Summary:</strong>
          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#5A6680;line-height:1.5;">
            <tr><td style="padding:4px 0;width:100px;"><strong>Service:</strong></td><td style="padding:4px 0;color:#1A1A2E;">${escapeHtml(service)}</td></tr>
            ${budget ? `<tr><td style="padding:4px 0;"><strong>Budget:</strong></td><td style="padding:4px 0;color:#1A1A2E;">${escapeHtml(budget)}</td></tr>` : ""}
            ${timeline ? `<tr><td style="padding:4px 0;"><strong>Timeline:</strong></td><td style="padding:4px 0;color:#1A1A2E;">${escapeHtml(timeline)}</td></tr>` : ""}
          </table>
        </div>
        <p style="color:#5A6680;font-size:14px;line-height:1.6;margin-bottom:24px;">
          Need a quicker response? Chat with us directly on WhatsApp:
          <a href="${site.social.whatsapp}" style="color:#F47B20;font-weight:600;text-decoration:none;">${site.phone}</a>.
        </p>
        `,
        {
          title: `Your quote request received — ${site.name}`,
          preheader: `Thank you for requesting a quote from ${site.name}. We will get back to you within 1-2 business days.`,
        }
      ),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Quote form error:", error);
    return NextResponse.json(
      { error: "Something went wrong sending your request. Please try again." },
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
