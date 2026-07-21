import { NextResponse } from "next/server";
import { getAllEmployees, getEmployeeByEmail, updateEmployeeProfile } from "@/lib/employeeStore";
import { getAllKYCRecords } from "@/lib/kycStore";
import { getBrandedEmailHtml } from "@/lib/emailTemplate";
import { site } from "@/lib/site";
import { Resend } from "resend";

// ── Phone normalizer ──────────────────────────────────────────────────────────
function normalizePhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("254") && cleaned.length === 12) return cleaned;
  if (cleaned.startsWith("0") && cleaned.length === 10) return "254" + cleaned.substring(1);
  if ((cleaned.startsWith("7") || cleaned.startsWith("1")) && cleaned.length === 9) return "254" + cleaned;
  return cleaned;
}

// ── TextSMS sender ────────────────────────────────────────────────────────────
async function sendSMS(to: string, message: string): Promise<void> {
  const apiKey    = process.env.TEXTSMS_API_KEY;
  const partnerId = process.env.TEXTSMS_PARTNER_ID;
  const shortcode = process.env.TEXTSMS_SHORTCODE || "TextSMS";

  if (!apiKey || !partnerId) {
    console.warn(`[SMS] Credentials not set. Skipping SMS to ${to}`);
    return;
  }

  const normalized = normalizePhoneNumber(to);
  try {
    await fetch("https://sms.textsms.co.ke/api/services/sendsms/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apikey:    apiKey,
        partnerID: parseInt(partnerId, 10),
        message,
        shortcode,
        mobile: normalized,
      }),
    });
  } catch (e) {
    console.error(`[SMS] Exception sending to ${normalized}:`, e);
  }
}

// ── GET Handler ──────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const employees = await getAllEmployees();
    const kycRecords = await getAllKYCRecords();

    const team = employees.map((emp) => {
      const emailLower = emp.email.toLowerCase();
      const kycRec = kycRecords[emailLower];
      return {
        id: emp.id,
        name: emp.fullName,
        email: emp.email,
        phone: emp.phone,
        role: emp.role || "Team Member",
        department: emp.department || "Engineering",
        avatarUrl: emp.avatarUrl || "",
        status: emp.status || "Pending",
        kycStatus: kycRec?.status || "Not Started",
        joinDate: new Date(emp.createdAt).toISOString().split("T")[0],
      };
    });

    return NextResponse.json({
      success: true,
      employees: team,
    });
  } catch (error) {
    console.error("[Admin Employees GET Error]:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

// ── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, status, role, department, fullName, phone } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const currentEmployee = await getEmployeeByEmail(email);
    if (!currentEmployee) {
      return NextResponse.json({ error: "Employee not found." }, { status: 404 });
    }

    const updates: Record<string, any> = {};
    if (status) updates.status = status;
    if (role) updates.role = role;
    if (department) updates.department = department;
    if (fullName) updates.fullName = fullName;
    if (phone) updates.phone = phone;

    const updated = await updateEmployeeProfile(email, updates);
    if (!updated) {
      return NextResponse.json({ error: "Failed to update employee profile." }, { status: 500 });
    }

    // Trigger notifications if employee was approved
    const isNowApproved = status === "Approved" && currentEmployee.status !== "Approved";

    if (isNowApproved) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || site.url;
      const portalUrl = `${baseUrl}/portal`;

      // 1. Send SMS Notification
      if (updated.phone) {
        await sendSMS(
          updated.phone,
          `Hello ${updated.fullName}, your YagwaTech team portal account has been approved by the administrator. Log in at ${portalUrl}`
        );
      }

      // 2. Send Email Notification
      const resendKey = process.env.RESEND_API_KEY;
      if (resendKey) {
        const resend = new Resend(resendKey);
        const emailHtml = getBrandedEmailHtml(
          `
          <h2 style="color:#0B3D91;margin-top:0;font-size:20px;font-weight:700;border-bottom:2px solid #EEF1F7;padding-bottom:12px;margin-bottom:16px;">
            Account Approved! 🎉
          </h2>
          <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
            Hello <strong>${updated.fullName}</strong>,
          </p>
          <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
            Your registration on the YagwaTech Team Portal has been reviewed and approved by the administrator.
          </p>
          <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:24px;">
            You can now log in to access your dashboard, complete tasks, coordinate deliverables, and view the team directory.
          </p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${portalUrl}" style="background-color:#0B3D91;color:white;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:14px;display:inline-block;">
              Login to Team Portal →
            </a>
          </div>
          <p style="color:#5A6680;font-size:13px;line-height:1.6;margin-top:24px;">
            If you have any questions or require support, please reach out to our team at <a href="mailto:${site.email}">${site.email}</a>.
          </p>
          `,
          {
            title: "YagwaTech Account Approved",
            preheader: "Your YagwaTech team portal account is active.",
          }
        );

        await resend.emails.send({
          from: `YagwaTech Portal <onboarding@yagwatech.com>`,
          to: updated.email,
          subject: "Your YagwaTech Team Portal Account Has Been Approved!",
          html: emailHtml,
        }).catch((err) => console.error("[Admin Approval Email Error]:", err));
      }
    }

    return NextResponse.json({
      success: true,
      employee: updated,
    });
  } catch (error) {
    console.error("[Admin Employees POST Error]:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
