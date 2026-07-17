import { NextResponse } from "next/server";
import { isZohoConfigured } from "@/lib/zoho";

export async function GET() {
  try {
    const crmConfigured = isZohoConfigured();
    const projectsConfigured = !!(
      isZohoConfigured() && process.env.ZOHO_PROJECTS_PORTAL_ID
    );
    const kycConfigured = !!(
      process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID &&
      process.env.PERSONA_API_KEY
    );

    return NextResponse.json({
      crm: {
        status: crmConfigured ? "connected" : "mock",
        mode: crmConfigured ? "Live Zoho CRM API" : "Simulated Local Mode",
      },
      projects: {
        status: projectsConfigured ? "connected" : "mock",
        mode: projectsConfigured ? "Live Zoho Projects API" : "Simulated Local Storage",
      },
      kyc: {
        status: kycConfigured ? "connected" : "mock",
        mode: kycConfigured ? "Live Persona Web SDK" : "Sandbox Demo Mode",
      },
    });
  } catch (error) {
    console.error("[Config Status API Error]:", error);
    return NextResponse.json({ error: "Failed to load integration states." }, { status: 500 });
  }
}
