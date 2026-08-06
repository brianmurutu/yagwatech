import { NextResponse } from "next/server";
import { createLeadInZohoCRM } from "@/lib/zoho";
import { getClientIp, formLimiter, rateLimitResponse } from "@/lib/rateLimit";
import { validateOrigin } from "@/lib/csrf";

const allowedCorsOrigins = [
  "https://yagwatech-leads-phi.vercel.app",
  "https://leads.yagwatech.com",
  "https://yagwatech.com",
];

function getCorsHeaders(origin: string | null) {
  const allowed = origin && allowedCorsOrigins.includes(origin) ? origin : "https://yagwatech.com";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  // CSRF Origin Check
  const originErr = validateOrigin(request);
  if (originErr) return originErr;

  // Rate Limiting
  const ip = getClientIp(request);
  const rl = formLimiter.check(ip);
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const body = await request.json();
    const { name, email, phone, company, description, source } = body;

    if (!name || !email || !description) {
      return NextResponse.json(
        { error: "Name, email, and description are required." },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await createLeadInZohoCRM({
      name,
      email,
      phone,
      company,
      description,
      source: source || "Manual Ingestion Portal",
    });

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          leadId: result.leadId,
          mock: result.mock,
        },
        { headers: corsHeaders }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to create lead in Zoho CRM. Please check integration settings." },
        { status: 500, headers: corsHeaders }
      );
    }
  } catch (error) {
    console.error("[CRM Lead Intake API Error]:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500, headers: corsHeaders }
    );
  }
}
