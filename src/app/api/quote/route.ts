import { NextResponse } from "next/server";
import { Resend } from "resend";
import { quoteSchema } from "@/lib/validation";
import { site } from "@/lib/site";

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

    // Notify the Yagwa Tech team
    const { error: notifyError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: site.email,
      replyTo: email,
      subject: `[Quote Request] ${service}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#0B3D91;border-bottom:2px solid #F47B20;padding-bottom:12px;">
            New quote request
          </h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#5A6680;font-size:13px;width:140px;"><strong>Name:</strong></td><td style="padding:8px 0;font-size:13px;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:8px 0;color:#5A6680;font-size:13px;"><strong>Email:</strong></td><td style="padding:8px 0;font-size:13px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#5A6680;font-size:13px;"><strong>Phone:</strong></td><td style="padding:8px 0;font-size:13px;">${escapeHtml(phone || "Not provided")}</td></tr>
            <tr><td style="padding:8px 0;color:#5A6680;font-size:13px;"><strong>Company:</strong></td><td style="padding:8px 0;font-size:13px;">${escapeHtml(company || "Not provided")}</td></tr>
            <tr><td style="padding:8px 0;color:#5A6680;font-size:13px;"><strong>Service:</strong></td><td style="padding:8px 0;font-size:13px;"><strong style="color:#F47B20;">${escapeHtml(service)}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#5A6680;font-size:13px;"><strong>Budget:</strong></td><td style="padding:8px 0;font-size:13px;">${escapeHtml(budget || "Not specified")}</td></tr>
            <tr><td style="padding:8px 0;color:#5A6680;font-size:13px;"><strong>Timeline:</strong></td><td style="padding:8px 0;font-size:13px;">${escapeHtml(timeline || "Not specified")}</td></tr>
          </table>
          <div style="margin-top:16px;background:#F7F9FC;border-left:4px solid #0B3D91;padding:16px;border-radius:4px;">
            <strong style="font-size:13px;color:#1A1A2E;">Project details:</strong>
            <p style="margin:8px 0 0;font-size:13px;color:#1A1A2E;white-space:pre-line;">${escapeHtml(details)}</p>
          </div>
          <p style="margin-top:24px;font-size:12px;color:#5A6680;">
            Reply directly to this email to respond to ${escapeHtml(name)}.
          </p>
        </div>
      `,
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
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#0B3D91;">We received your quote request, ${escapeHtml(name)}!</h2>
          <p style="color:#5A6680;font-size:14px;line-height:1.6;">
            Thank you for your interest in our <strong>${escapeHtml(service)}</strong> services. 
            Our team will review your requirements and get back to you within <strong>1–2 business days</strong> with a tailored proposal.
          </p>
          <div style="margin:20px 0;padding:16px;background:#FFF7F0;border-left:4px solid #F47B20;border-radius:4px;font-size:13px;color:#5A6680;">
            <strong>Your request summary:</strong><br/>
            Service: ${escapeHtml(service)}<br/>
            ${budget ? `Budget: ${escapeHtml(budget)}<br/>` : ""}
            ${timeline ? `Timeline: ${escapeHtml(timeline)}` : ""}
          </div>
          <p style="color:#5A6680;font-size:14px;line-height:1.6;">
            Need a quicker response? Chat with us directly on WhatsApp:
            <a href="${site.social.whatsapp}" style="color:#F47B20;font-weight:600;">${site.phone}</a>
          </p>
          <div style="margin-top:24px;padding:16px;background:#F7F9FC;border-radius:8px;font-size:13px;color:#5A6680;">
            <strong>${site.name}</strong><br/>
            ${site.address}<br/>
            ${site.phone} · ${site.email}
          </div>
        </div>
      `,
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
