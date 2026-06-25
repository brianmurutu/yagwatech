import { NextResponse } from "next/server";
import { Resend } from "resend";
import { quoteSchema } from "@/lib/validation";
import { site } from "@/lib/site";

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

    const { error: resendError } = await resend.emails.send({
      from: `${site.name} website <onboarding@resend.dev>`,
      to: site.email,
      replyTo: email,
      subject: `New quote request: ${service}`,
      html: `
        <h2>New quote request from the website</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
        <p><strong>Company:</strong> ${escapeHtml(company || "Not provided")}</p>
        <p><strong>Service needed:</strong> ${escapeHtml(service)}</p>
        <p><strong>Estimated budget:</strong> ${escapeHtml(budget || "Not specified")}</p>
        <p><strong>Timeline:</strong> ${escapeHtml(timeline || "Not specified")}</p>
        <p><strong>Project details:</strong></p>
        <p>${escapeHtml(details).replace(/\n/g, "<br/>")}</p>
      `,
    });

    if (resendError) {
      console.error("Resend API error:", resendError);
      return NextResponse.json(
        { error: "Email service encountered an error. Please try again later or reach us on WhatsApp." },
        { status: 500 }
      );
    }

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
