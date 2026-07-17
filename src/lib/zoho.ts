/**
 * Zoho CRM & Projects API Helper Utility
 * Implements token caching, Lead creation, and Project management.
 * Fallbacks to Graceful Mock Mode if environment variables are not configured.
 */

interface LeadData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  description: string;
  source: string;
}

interface ProjectData {
  name: string;
  description: string;
  budget?: string;
  assignee?: string;
  deadline?: string;
  priority?: string;
  status?: string;
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

/**
 * Checks if Zoho integration credentials are fully configured.
 */
export function isZohoConfigured(): boolean {
  return !!(
    process.env.ZOHO_CLIENT_ID &&
    process.env.ZOHO_CLIENT_SECRET &&
    process.env.ZOHO_REFRESH_TOKEN
  );
}

/**
 * Fetches or refreshes a Zoho Access Token using the configured Refresh Token.
 */
export async function getZohoAccessToken(): Promise<string | null> {
  if (!isZohoConfigured()) {
    console.warn("[Zoho OAuth] Credentials are not configured. Operating in mock mode.");
    return null;
  }

  // Check if token is still valid (with 30-second buffer)
  if (cachedToken && Date.now() < tokenExpiresAt - 30000) {
    return cachedToken;
  }

  try {
    const url = "https://accounts.zoho.com/oauth/v2/token";
    const params = new URLSearchParams({
      refresh_token: process.env.ZOHO_REFRESH_TOKEN || "",
      client_id: process.env.ZOHO_CLIENT_ID || "",
      client_secret: process.env.ZOHO_CLIENT_SECRET || "",
      grant_type: "refresh_token",
    });

    const res = await fetch(`${url}?${params.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Zoho token refresh failed status: ${res.status}, response: ${errText}`);
    }

    const data = await res.json();
    if (data.access_token) {
      cachedToken = data.access_token;
      // expires_in is in seconds
      tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;
      console.log("[Zoho OAuth] Token refreshed successfully.");
      return cachedToken;
    } else {
      throw new Error(`Token response did not contain access_token: ${JSON.stringify(data)}`);
    }
  } catch (error) {
    console.error("[Zoho OAuth] Error retrieving access token:", error);
    return null;
  }
}

/**
 * Creates a Lead in Zoho CRM.
 */
export async function createLeadInZohoCRM(lead: LeadData): Promise<{ success: boolean; leadId?: string; mock?: boolean }> {
  console.log(`[Zoho CRM] Attempting to create lead: ${lead.name} (${lead.email}) from ${lead.source}`);
  
  const token = await getZohoAccessToken();
  if (!token) {
    console.log("[Zoho CRM Mock] Success (Mock mode). Lead Data captured:", lead);
    return { success: true, leadId: `mock_lead_${Date.now()}`, mock: true };
  }

  try {
    // Split name into first and last name
    const nameParts = lead.name.trim().split(/\s+/);
    const firstName = nameParts.length > 1 ? nameParts[0] : "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : lead.name;

    const response = await fetch("https://www.zohoapis.com/crm/v3/Leads", {
      method: "POST",
      headers: {
        "Authorization": `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [
          {
            "First_Name": firstName,
            "Last_Name": lastName,
            "Email": lead.email,
            "Phone": lead.phone || "",
            "Company": lead.company || "YagwaTech Ingestion",
            "Description": lead.description,
            "Lead_Source": lead.source,
          }
        ]
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Zoho CRM] API error status ${response.status}:`, errText);
      return { success: false };
    }

    const result = await response.json();
    const leadDetails = result.data?.[0];
    if (leadDetails && leadDetails.status === "success") {
      console.log(`[Zoho CRM] Lead created successfully in CRM. ID: ${leadDetails.details?.id}`);
      return { success: true, leadId: leadDetails.details?.id };
    } else {
      console.error("[Zoho CRM] Lead creation rejected by Zoho:", result);
      return { success: false };
    }
  } catch (error) {
    console.error("[Zoho CRM] Unexpected integration exception:", error);
    return { success: false };
  }
}

/**
 * Fetches all active projects from Zoho Projects.
 */
export async function fetchProjectsFromZohoProjects(): Promise<{ success: boolean; projects: any[]; mock?: boolean }> {
  const portalId = process.env.ZOHO_PROJECTS_PORTAL_ID;
  const token = await getZohoAccessToken();

  if (!token || !portalId) {
    console.log("[Zoho Projects Mock] Reading projects from mock repository (unconfigured).");
    return { success: true, projects: [], mock: true };
  }

  try {
    const url = `https://projectsapi.zoho.com/restapi/portal/${portalId}/projects/`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Zoho-oauthtoken ${token}`,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`[Zoho Projects] API returned error status ${response.status}`);
      return { success: false, projects: [] };
    }

    const data = await response.json();
    // Zoho projects API returns { projects: [...] }
    return { success: true, projects: data.projects || [] };
  } catch (error) {
    console.error("[Zoho Projects] Fetch error:", error);
    return { success: false, projects: [] };
  }
}

/**
 * Creates a project in Zoho Projects.
 */
export async function createProjectInZohoProjects(project: ProjectData): Promise<{ success: boolean; projectId?: string; mock?: boolean }> {
  console.log(`[Zoho Projects] Attempting to create project: ${project.name}`);

  const portalId = process.env.ZOHO_PROJECTS_PORTAL_ID;
  const token = await getZohoAccessToken();

  if (!token || !portalId) {
    console.log("[Zoho Projects Mock] Created project in mock store:", project);
    return { success: true, projectId: `mock_proj_${Date.now()}`, mock: true };
  }

  try {
    const url = `https://projectsapi.zoho.com/restapi/portal/${portalId}/projects/`;
    
    // Zoho Projects API expects x-www-form-urlencoded format for creation params
    const formData = new URLSearchParams({
      name: project.name,
      description: project.description,
      // Map other optional parameters supported by Zoho Projects API
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Zoho Projects] API Error status ${response.status}:`, errText);
      return { success: false };
    }

    const result = await response.json();
    // Zoho projects returns { projects: [ { id: ... } ] } on success
    const projectDetails = result.projects?.[0];
    if (projectDetails?.id) {
      console.log(`[Zoho Projects] Project created successfully. ID: ${projectDetails.id}`);
      return { success: true, projectId: projectDetails.id.toString() };
    } else {
      console.error("[Zoho Projects] API returned response with missing ID:", result);
      return { success: false };
    }
  } catch (error) {
    console.error("[Zoho Projects] Create project exception:", error);
    return { success: false };
  }
}
