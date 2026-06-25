import { NextResponse } from "next/server";
import { Resend } from "resend";
import { newsletterSchema } from "@/lib/validation";
import { site } from "@/lib/site";

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

    if (audienceId) {
      const { error: resendError } = await resend.contacts.create({
        email,
        audienceId,
      });

      if (resendError) {
        console.error("Resend contact creation error:", resendError);
        return NextResponse.json(
          { error: resendError.message || "Failed to add subscription to newsletter." },
          { status: 400 }
        );
      }
    } else {
      const { error: resendError } = await resend.emails.send({
        from: `${site.name} website <onboarding@resend.dev>`,
        to: site.email,
        subject: "New newsletter subscriber",
        html: `<p>New subscriber: ${escapeHtml(email)}</p>`,
      });

      if (resendError) {
        console.error("Resend API error:", resendError);
        return NextResponse.json(
          { error: "Newsletter service encountered an error. Please try again later." },
          { status: 500 }
        );
      }
    }

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
