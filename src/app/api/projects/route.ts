import { NextResponse } from "next/server";
import { fetchProjectsFromZohoProjects, createProjectInZohoProjects, isZohoConfigured } from "@/lib/zoho";
import { getClientIp, formLimiter, rateLimitResponse } from "@/lib/rateLimit";
import { validateOrigin } from "@/lib/csrf";

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
