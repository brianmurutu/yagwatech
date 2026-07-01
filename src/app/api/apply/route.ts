import { NextResponse } from "next/server";
import { Resend } from "resend";
import { jobApplicationSchema } from "@/lib/validation";
import { site } from "@/lib/site";
import { getBrandedEmailHtml } from "@/lib/emailTemplate";

const FROM_ADDRESS = `${site.name} <${site.email}>`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = jobApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { jobId, jobTitle, name, email, phone, linkedin, portfolio, intro } =
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

    // Send candidate application notification to Yagwa Tech admin team
    const { error: notifyError } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: site.careersEmails,
      replyTo: email,
      subject: `[Job Application] ${jobTitle} — ${name}`,
      html: getBrandedEmailHtml(
        `
        <h2 style="color:#0B3D91;margin-top:0;font-size:20px;font-weight:700;margin-bottom:16px;border-bottom:2px solid #EEF1F7;padding-bottom:12px;">
          New Job Application Received
        </h2>
        <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
          A candidate has submitted an application for the <strong>${escapeHtml(jobTitle)}</strong> position.
        </p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;width:140px;"><strong>Position:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;"><strong>${escapeHtml(jobTitle)}</strong> (ID: ${escapeHtml(jobId)})</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;"><strong>Candidate Name:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;"><strong>Email Address:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;"><a href="mailto:${escapeHtml(email)}" style="color:#0B3D91;text-decoration:none;">${escapeHtml(email)}</a></td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;"><strong>Phone Number:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;">${escapeHtml(phone)}</td>
          </tr>
          ${linkedin ? `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;"><strong>LinkedIn Profile:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;"><a href="${escapeHtml(linkedin)}" target="_blank" style="color:#0B3D91;text-decoration:none;">${escapeHtml(linkedin)}</a></td>
          </tr>` : ""}
          ${portfolio ? `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#5A6680;font-size:14px;"><strong>Portfolio / GitHub:</strong></td>
            <td style="padding:10px 0;border-bottom:1px solid #EEF1F7;color:#1A1A2E;font-size:14px;"><a href="${escapeHtml(portfolio)}" target="_blank" style="color:#0B3D91;text-decoration:none;">${escapeHtml(portfolio)}</a></td>
          </tr>` : ""}
        </table>
        <div style="background:#F7F9FC;border-left:4px solid #0B3D91;padding:20px;border-radius:6px;margin-bottom:24px;">
          <strong style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#5A6680;display:block;margin-bottom:8px;">Candidate Introduction:</strong>
          <p style="margin:0;font-size:14px;color:#1A1A2E;line-height:1.6;white-space:pre-line;">${escapeHtml(intro)}</p>
        </div>
        <p style="margin:0;font-size:13px;color:#5A6680;line-height:1.5;">
          Reply directly to this email to get in touch with the candidate.
        </p>
        `,
        {
          title: `New Job Application: ${jobTitle} — ${name}`,
          preheader: `New candidate application from ${name} for the ${jobTitle} position.`,
        }
      ),
    });

    if (notifyError) {
      console.error("Resend application notify error:", notifyError);
      return NextResponse.json(
        { error: "Application service encountered an error. Please try again later or contact us directly." },
        { status: 500 }
      );
    }

    // Send confirmation email to the applicant
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: `We received your application — ${site.name}`,
      html: getBrandedEmailHtml(
        `
        <h2 style="color:#0B3D91;margin-top:0;font-size:20px;font-weight:700;margin-bottom:16px;">Application Received!</h2>
        <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
          Hi ${escapeHtml(name)},
        </p>
        <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
          Thank you for applying for the <strong>${escapeHtml(jobTitle)}</strong> position at <strong>${site.name}</strong>.
        </p>
        <p style="color:#5A6680;font-size:14px;line-height:1.6;margin-bottom:16px;">
          Our recruitment team will review your qualifications and experience. If your profile matches what we're looking for, we will get in touch to schedule an initial interview.
        </p>
        <p style="color:#5A6680;font-size:14px;line-height:1.6;margin-bottom:24px;">
          In the meantime, feel free to learn more about our team and projects at <a href="${site.url}" style="color:#0B3D91;font-weight:500;text-decoration:none;">${site.url}</a>.
        </p>
        <p style="color:#1A1A2E;font-size:14px;line-height:1.6;margin-bottom:0;">
          Best regards,<br/>
          <strong>The Careers Team</strong><br/>
          ${site.name}
        </p>
        `,
        {
          title: `Application Received — ${site.name}`,
          preheader: `Thank you for your application for the ${jobTitle} position. We will review your profile shortly.`,
        }
      ),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Job application error:", error);
    return NextResponse.json(
      { error: "Something went wrong sending your application. Please try again." },
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
