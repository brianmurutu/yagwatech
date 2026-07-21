import { NextResponse } from "next/server";
import { getAllEmployees } from "@/lib/employeeStore";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const employees = await getAllEmployees();

    const db = getSupabase();
    // Fetch list of files in the avatars bucket
    const { data: files, error: storageError } = await db.storage
      .from("avatars")
      .list("", { limit: 1000 });

    if (storageError) {
      console.error("[Team Route] Supabase storage list error:", storageError);
    }

    const avatarSet = new Set((files || []).map((f: any) => f.name.toLowerCase()));

    const baseUrl = process.env.SUPABASE_URL;

    const team = employees.map((emp) => {
      const emailLower = emp.email.toLowerCase();
      const hasAvatar = avatarSet.has(`${emailLower}.png`);
      
      let avatarUrl = "";
      if (hasAvatar) {
        avatarUrl = `${baseUrl}/storage/v1/object/public/avatars/${emailLower}.png?t=${Date.now()}`;
      } else if (emp.avatarUrl) {
        // Preserve any existing URL if preset
        avatarUrl = emp.avatarUrl;
      }

      return {
        id: emp.id,
        name: emp.fullName,
        email: emp.email,
        phone: emp.phone,
        role: emp.role || "Team Member",
        department: emp.department || "Engineering",
        avatarUrl,
        createdAt: emp.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      team,
    });
  } catch (error) {
    console.error("[Team API Route Error]:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
