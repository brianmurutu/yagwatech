import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/validation";
import { site } from "@/lib/site";

const FROM_ADDRESS = `${site.name} <onboarding@resend.dev>`;

export async function POST(request: Request) {
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

    // Send notification to Yagwa Tech team
    const { error: notifyError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: site.email,
      replyTo: email,
      subject: `[Contact] ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#0B3D91;border-bottom:2px solid #F47B20;padding-bottom:12px;">
            New contact form message
          </h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#5A6680;font-size:13px;width:120px;"><strong>Name:</strong></td><td style="padding:8px 0;font-size:13px;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:8px 0;color:#5A6680;font-size:13px;"><strong>Email:</strong></td><td style="padding:8px 0;font-size:13px;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:8px 0;color:#5A6680;font-size:13px;"><strong>Phone:</strong></td><td style="padding:8px 0;font-size:13px;">${escapeHtml(phone || "Not provided")}</td></tr>
            <tr><td style="padding:8px 0;color:#5A6680;font-size:13px;"><strong>Subject:</strong></td><td style="padding:8px 0;font-size:13px;">${escapeHtml(subject)}</td></tr>
          </table>
          <div style="margin-top:16px;background:#F7F9FC;border-left:4px solid #0B3D91;padding:16px;border-radius:4px;">
            <p style="margin:0;font-size:13px;color:#1A1A2E;white-space:pre-line;">${escapeHtml(message)}</p>
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

    // Send confirmation email to the submitter
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: `We received your message — ${site.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#0B3D91;">Thanks for reaching out, ${escapeHtml(name)}!</h2>
          <p style="color:#5A6680;font-size:14px;line-height:1.6;">
            We received your message about <strong>"${escapeHtml(subject)}"</strong> and our team will get back to you within one business day.
          </p>
          <p style="color:#5A6680;font-size:14px;line-height:1.6;">
            In the meantime, feel free to explore our services at <a href="${site.url}" style="color:#0B3D91;">${site.url}</a>
            or reach us directly on WhatsApp: <a href="${site.social.whatsapp}" style="color:#F47B20;">${site.phone}</a>.
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
