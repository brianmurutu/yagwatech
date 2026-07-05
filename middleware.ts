import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const COOKIE_NAME = "admin_session";
const ADMIN_PREFIX = "/admin";

function signToken(value: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "change-me-in-production";
  return createHmac("sha256", secret).update(value).digest("hex");
}

function verifySessionToken(token: string): boolean {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const rand = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = signToken(rand);
  // Constant-length comparison (both are hex strings of the same digest)
  if (sig.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (but not the API routes used by the login form)
  if (!pathname.startsWith(ADMIN_PREFIX)) return NextResponse.next();
  if (
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/admin/logout")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value ?? "";

  if (!token || !verifySessionToken(token)) {
    // If this is an API call, return 401 JSON; otherwise redirect to /admin login
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
    }
    // Redirect to the admin page (which renders the login form when unauthenticated)
    const loginUrl = new URL("/admin", request.url);
    loginUrl.searchParams.set("unauthorized", "1");
    // We clear the cookie just in case it's corrupted
    const res = NextResponse.redirect(loginUrl);
    res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
    return res;
  }

  return NextResponse.next();
}

export const config = {
  // Run on all /admin/* paths and admin API routes
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
