import { NextResponse } from "next/server";
import { getEmployeeByEmail, updateEmployeeProfile, hashPassword } from "@/lib/employeeStore";
import bcrypt from "bcryptjs";
import { validateOrigin } from "@/lib/csrf";

export async function POST(request: Request) {
  const originErr = validateOrigin(request);
  if (originErr) return originErr;

  try {
    const body = await request.json();
    const { email, fullName, phone, currentPassword, newPassword, avatarUrl } = body;

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
      },
    });
  } catch (error) {
    console.error("[Portal Profile Update Route Error]:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
