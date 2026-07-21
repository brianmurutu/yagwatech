import { NextResponse } from "next/server";
import { getEmployeeByEmail, updateEmployeeProfile, hashPassword } from "@/lib/employeeStore";
import bcrypt from "bcryptjs";
import { validateOrigin } from "@/lib/csrf";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const employee = await getEmployeeByEmail(email);
    if (!employee) {
      return NextResponse.json({ error: "Employee account not found." }, { status: 404 });
    }

    const db = getSupabase();
    const emailLower = employee.email.toLowerCase();
    let files: any[] = [];
    try {
      const { data } = await db.storage.from("avatars").list("", { limit: 1000 });
      files = data || [];
    } catch (e) {
      console.error("[Profile GET] Storage list error:", e);
    }
    const avatarSet = new Set(files.map((f: any) => f.name.toLowerCase()));
    const baseUrl = process.env.SUPABASE_URL;
    const hasAvatar = avatarSet.has(`${emailLower}.png`);
    
    let avatarUrl = "";
    if (hasAvatar) {
      avatarUrl = `${baseUrl}/storage/v1/object/public/avatars/${emailLower}.png?t=${Date.now()}`;
    } else if (employee.avatarUrl) {
      avatarUrl = employee.avatarUrl;
    }

    return NextResponse.json({
      success: true,
      employee: {
        id:         employee.id,
        fullName:   employee.fullName,
        email:      employee.email,
        phone:      employee.phone,
        avatarUrl:  avatarUrl,
        role:       employee.role,
        department: employee.department,
      },
    });
  } catch (error) {
    console.error("[Portal Profile GET Error]:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}


export async function POST(request: Request) {
  const originErr = validateOrigin(request);
  if (originErr) return originErr;

  try {
    const body = await request.json();
    const { email, fullName, phone, currentPassword, newPassword, avatarUrl, role, department } = body;

    if (!email || !currentPassword) {
      return NextResponse.json(
        { error: "Verification failed. Email and current password are required." },
        { status: 400 }
      );
    }

    const employee = await getEmployeeByEmail(email);
    if (!employee) {
      return NextResponse.json({ error: "Employee account not found." }, { status: 404 });
    }

    const passwordMatches = await bcrypt.compare(currentPassword, employee.passwordHash);
    if (!passwordMatches) {
      return NextResponse.json({ error: "Incorrect current password." }, { status: 401 });
    }

    const updates: Record<string, string> = {};
    if (fullName) updates.fullName = fullName;
    if (phone) updates.phone = phone;
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;
    if (role !== undefined) updates.role = role;
    if (department !== undefined) updates.department = department;

    if (newPassword) {
      updates.passwordHash = await hashPassword(newPassword);
    }

    const updatedEmployee = await updateEmployeeProfile(email, updates);
    if (!updatedEmployee) {
      return NextResponse.json({ error: "Failed to update profile details." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      employee: {
        id:       updatedEmployee.id,
        fullName: updatedEmployee.fullName,
        email:    updatedEmployee.email,
        phone:    updatedEmployee.phone,
        avatarUrl: updatedEmployee.avatarUrl,
        role:     updatedEmployee.role,
        department: updatedEmployee.department,
      },
    });
  } catch (error) {
    console.error("[Portal Profile Update Route Error]:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
