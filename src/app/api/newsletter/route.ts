import { NextResponse } from "next/server";
import { Resend } from "resend";
import { newsletterSchema } from "@/lib/validation";
import { site } from "@/lib/site";
import { getBrandedEmailHtml } from "@/lib/emailTemplate";

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
      // Check if the contact is already subscribed
      const { data: existingContact } = await resend.contacts.get({
        email,
        audienceId,
      });

      if (existingContact) {
        return NextResponse.json(
          { error: "You are already subscribed to our newsletter." },
          { status: 400 }
        );
      }

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
      // Fallback: notify admin team via email
      const { error: emailError } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: site.adminEmails,
        subject: "New newsletter subscriber",
        html: getBrandedEmailHtml(
          `
          <h2 style="color:#0B3D91;margin-top:0;font-size:20px;font-weight:700;margin-bottom:16px;border-bottom:2px solid #EEF1F7;padding-bottom:12px;">
            New Newsletter Subscription
          </h2>
          <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
            A visitor has subscribed to the newsletter.
          </p>
          <div style="background:#F7F9FC;border-left:4px solid #F47B20;padding:20px;border-radius:6px;margin-bottom:16px;">
            <strong style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#5A6680;display:block;margin-bottom:4px;">Subscriber Email:</strong>
            <span style="font-size:16px;color:#1A1A2E;font-weight:600;"><a href="mailto:${escapeHtml(email)}" style="color:#0B3D91;text-decoration:none;">${escapeHtml(email)}</a></span>
          </div>
          `,
          {
            title: "New newsletter subscriber",
            preheader: `New subscription from ${email}`,
          }
        ),
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
      html: getBrandedEmailHtml(
        `
        <h2 style="color:#0B3D91;margin-top:0;font-size:20px;font-weight:700;margin-bottom:16px;">You're Subscribed!</h2>
        <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
          Thanks for subscribing to the <strong>${site.name}</strong> newsletter. 
          You'll receive the latest tech insights, digital transformation stories, and updates from our team in Nairobi.
        </p>
        <p style="color:#5A6680;font-size:14px;line-height:1.6;margin-bottom:24px;">
          In the meantime, explore our latest articles at 
          <a href="${site.url}/blog" style="color:#0B3D91;font-weight:500;text-decoration:none;">${site.url}/blog</a>.
        </p>
        `,
        {
          title: `Welcome to the ${site.name} newsletter!`,
          preheader: `You have successfully subscribed to updates from ${site.name}`,
        }
      ),
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
