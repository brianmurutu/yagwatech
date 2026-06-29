import { NextResponse } from "next/server";
import { Resend } from "resend";
import { newsletterSchema } from "@/lib/validation";
import { site } from "@/lib/site";

const FROM_ADDRESS = `${site.name} <${site.email}>`;

// Validate UUID format to detect placeholder values
function isValidUuid(id: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    && id !== "5e4d5e4d-5e4d-5e4d-5e4d-5e4d5e4d5e4d"; // reject known placeholder
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Newsletter signup is not configured yet. Please try again later." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    // Use Resend Audiences if a valid (non-placeholder) audience ID is set
    if (audienceId && isValidUuid(audienceId)) {
      const { error: contactError } = await resend.contacts.create({
        email,
        audienceId,
      });

      if (contactError) {
        console.error("Resend contact error:", contactError);
        return NextResponse.json(
          { error: contactError.message || "Failed to subscribe. Please try again." },
          { status: 400 }
        );
      }
    } else {
      // Fallback: notify team via email
      const { error: emailError } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: site.email,
        subject: "New newsletter subscriber",
        html: `<p style="font-family:sans-serif;">New newsletter subscriber: <strong>${escapeHtml(email)}</strong></p>`,
      });

      if (emailError) {
        console.error("Resend fallback error:", emailError);
        return NextResponse.json(
          { error: "Newsletter service encountered an error. Please try again later." },
          { status: 500 }
        );
      }
    }

    // Send welcome confirmation to subscriber
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: `Welcome to the ${site.name} newsletter!`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#0B3D91;">You're subscribed!</h2>
          <p style="color:#5A6680;font-size:14px;line-height:1.6;">
            Thanks for subscribing to the <strong>${site.name}</strong> newsletter. 
            You'll receive the latest tech insights, digital transformation stories, and updates from our team in Nairobi.
          </p>
          <p style="color:#5A6680;font-size:14px;line-height:1.6;">
            In the meantime, explore our latest articles at 
            <a href="${site.url}/blog" style="color:#0B3D91;">${site.url}/blog</a>
          </p>
          <div style="margin-top:24px;padding:16px;background:#F7F9FC;border-radius:8px;font-size:13px;color:#5A6680;">
            <strong>${site.name}</strong><br/>
            ${site.address} · <a href="mailto:${site.email}" style="color:#5A6680;">${site.email}</a>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong subscribing you. Please try again." },
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
