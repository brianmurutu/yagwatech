import { NextResponse } from "next/server";
import { fetchProjectsFromZohoProjects, createProjectInZohoProjects, isZohoConfigured } from "@/lib/zoho";
import { getClientIp, formLimiter, rateLimitResponse } from "@/lib/rateLimit";
import { validateOrigin } from "@/lib/csrf";
import { getAllEmployees } from "@/lib/employeeStore";
import { Resend } from "resend";
import { getBrandedEmailHtml } from "@/lib/emailTemplate";
import { site } from "@/lib/site";

export async function GET(request: Request) {
  try {
    const isConfigured = !!(isZohoConfigured() && process.env.ZOHO_PROJECTS_PORTAL_ID);
    
    if (!isConfigured) {
      // Operating in mock mode. Return success indicating mock fallback.
      return NextResponse.json({
        success: true,
        projects: [],
        mock: true,
      });
    }

    const result = await fetchProjectsFromZohoProjects();
    if (result.success) {
      // Map Zoho Projects data to our local schema
      const mapped = (result.projects || []).map((p: any) => ({
        id: p.id_string || p.id?.toString() || Date.now().toString(),
        title: p.name || "",
        client: p.owner_name || "Zoho Sync Client",
        status: mapZohoStatus(p.status),
        assignee: p.owner_name || "Unassigned",
        priority: p.priority || "Medium",
        deadline: p.end_date || new Date().toISOString().split("T")[0],
        budget: "KSh 0 (Zoho Sync)",
        description: p.description || "",
      }));

      return NextResponse.json({
        success: true,
        projects: mapped,
        mock: false,
      });
    } else {
      return NextResponse.json(
        { error: "Failed to fetch projects from Zoho Projects." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[GET Projects API Error]:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // CSRF Origin Check
  const originErr = validateOrigin(request);
  if (originErr) return originErr;

  // Rate Limiting
  const ip = getClientIp(request);
  const rl = formLimiter.check(ip);
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const body = await request.json();
    const { title, client, description, assignee, priority, deadline, budget, status } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Project Title and Description are required." },
        { status: 400 }
      );
    }

    const isConfigured = !!(isZohoConfigured() && process.env.ZOHO_PROJECTS_PORTAL_ID);
    const result = await createProjectInZohoProjects({
      name: title,
      description: `Client: ${client || "N/A"}\nPriority: ${priority || "Medium"}\nBudget: ${budget || "N/A"}\nDeadline: ${deadline || "N/A"}\n\nDescription: ${description}`,
      budget,
      assignee,
      deadline,
      priority,
      status,
    });

    if (result.success) {
      // Send Email Notification to assigned user if they exist in the DB
      try {
        if (assignee) {
          const employees = await getAllEmployees();
          const matchedEmp = employees.find(
            (e) => e.fullName.toLowerCase().trim() === assignee.toLowerCase().trim()
          );

          if (matchedEmp) {
            const resendKey = process.env.RESEND_API_KEY;
            if (resendKey) {
              const resend = new Resend(resendKey);
              const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || site.url;
              const portalUrl = `${baseUrl}/portal`;

              const emailHtml = getBrandedEmailHtml(
                `
                <h2 style="color:#0B3D91;margin-top:0;font-size:20px;font-weight:700;border-bottom:2px solid #EEF1F7;padding-bottom:12px;margin-bottom:16px;">
                  New Project Assigned! 🚀
                </h2>
                <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
                  Hello <strong>${matchedEmp.fullName}</strong>,
                </p>
                <p style="color:#1A1A2E;font-size:15px;line-height:1.6;margin-bottom:16px;">
                  You have been assigned to a new project: <strong>${title}</strong>.
                </p>
                <table style="width:100%; border-collapse:collapse; margin:20px 0; font-size:14px;">
                  <tr style="border-bottom:1px solid #EEF1F7;">
                    <td style="padding:10px 0; color:#5A6680; font-weight:bold; width:120px;">Client:</td>
                    <td style="padding:10px 0; color:#1A1A2E;">${client || "N/A"}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #EEF1F7;">
                    <td style="padding:10px 0; color:#5A6680; font-weight:bold;">Priority:</td>
                    <td style="padding:10px 0; color:#1A1A2E;">
                      <span style="padding:4px 8px; border-radius:4px; font-weight:bold; font-size:12px; background-color:${
                        priority === 'High' ? '#FEE2E2; color:#991B1B;' :
                        priority === 'Medium' ? '#FEF3C7; color:#92400E;' :
                        '#D1FAE5; color:#065F46;'
                      }">${priority || "Medium"}</span>
                    </td>
                  </tr>
                  <tr style="border-bottom:1px solid #EEF1F7;">
                    <td style="padding:10px 0; color:#5A6680; font-weight:bold;">Deadline:</td>
                    <td style="padding:10px 0; color:#1A1A2E;">${deadline || "N/A"}</td>
                  </tr>
                  <tr style="border-bottom:1px solid #EEF1F7;">
                    <td style="padding:10px 0; color:#5A6680; font-weight:bold;">Budget:</td>
                    <td style="padding:10px 0; color:#1A1A2E;">${budget || "N/A"}</td>
                  </tr>
                </table>
                <p style="color:#5A6680;font-size:14px;line-height:1.6;margin-top:16px;">
                  <strong>Description:</strong><br/>
                  ${description || "No description provided."}
                </p>
                <div style="text-align:center;margin:32px 0;">
                  <a href="${portalUrl}" style="background-color:#0B3D91;color:white;padding:14px 28px;text-decoration:none;border-radius:8px;font-weight:bold;font-size:14px;display:inline-block;">
                    View Project on Team Portal →
                  </a>
                </div>
                `,
                {
                  title: "New Project Assigned",
                  preheader: `You have been assigned to project: ${title}`,
                }
              );

              await resend.emails.send({
                from: `YagwaTech <noreply@yagwatech.com>`,
                to: [matchedEmp.email],
                subject: `New Project Assigned: ${title}`,
                html: emailHtml,
              });
              console.log(`[Project Route] Email notification sent to ${matchedEmp.email} for project ${title}`);
            }
          }
        }
      } catch (e) {
        console.error("[Project Route] Error sending email notification:", e);
      }

      return NextResponse.json({
        success: true,
        projectId: result.projectId,
        mock: result.mock,
      });
    } else {
      return NextResponse.json(
        { error: "Failed to create project in Zoho Projects API." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[POST Projects API Error]:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

function mapZohoStatus(zohoStatus: string): "Backlog" | "In Progress" | "Review" | "Done" {
  if (!zohoStatus) return "Backlog";
  const norm = zohoStatus.toLowerCase();
  if (norm.includes("progress") || norm.includes("active")) return "In Progress";
  if (norm.includes("review") || norm.includes("test")) return "Review";
  if (norm.includes("completed") || norm.includes("done") || norm.includes("closed")) return "Done";
  return "Backlog";
}
