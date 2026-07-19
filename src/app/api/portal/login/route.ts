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
      return NextResponse.json({ error: "Username/Email and Password are required." }, { status: 400 });
    }

    // 1. Check database verification
    const employee = verifyEmployee(username, password);

    if (employee) {
      const kycStatus = getKYCStatus(employee.email);
      if (kycStatus !== "Verified") {
        return NextResponse.json(
          {
            error: "KYC verification is required. Please complete your identity verification first.",
            kycRequired: true,
            email: employee.email,
          },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        employee: {
          id: employee.id,
          fullName: employee.fullName,
          email: employee.email,
          phone: employee.phone,
        },
      });
    }

    // 2. Fallback check for demo credentials
    if (username === "employee" && password === "yagwa2024") {
      return NextResponse.json({
        success: true,
        employee: {
          id: "emp_demo",
          fullName: "Demo Employee",
          email: "employee@yagwatech.com",
          phone: "+254 700 000000",
        },
      });
    }

    // Authentication failure
    return NextResponse.json({ error: "Invalid email/username or password." }, { status: 401 });
  } catch (error) {
    console.error("[Portal Login Route Error]:", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
