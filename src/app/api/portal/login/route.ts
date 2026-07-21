import { NextResponse } from "next/server";
import { verifyEmployee } from "@/lib/employeeStore";
import { getClientIp, loginLimiter, rateLimitResponse } from "@/lib/rateLimit";
import { validateOrigin } from "@/lib/csrf";
import { getKYCStatus } from "@/lib/kycStore";

export async function POST(request: Request) {
  // CSRF Check
  const originErr = validateOrigin(request);
  if (originErr) return originErr;

  // Rate Limiting
  const ip = getClientIp(request);
  const rl = loginLimiter.check(ip);
  if (!rl.allowed) return rateLimitResponse(rl);

  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Verify credentials against Supabase
    const employee = await verifyEmployee(username, password);

    if (!employee) {
      return NextResponse.json(
        { error: "Invalid email/username or password." },
        { status: 401 }
      );
    }

    // Check KYC status — must be Verified to access portal
    const kycStatus = await getKYCStatus(employee.email);
    if (kycStatus !== "Verified") {
      return NextResponse.json(
        {
          error: "KYC verification required. Please complete your identity verification first.",
          kycRequired: true,
          email: employee.email,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      employee: {
        id:       employee.id,
        fullName: employee.fullName,
        email:    employee.email,
        phone:    employee.phone,
      },
    });
  } catch (error) {
    console.error("[Portal Login Route Error]:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
