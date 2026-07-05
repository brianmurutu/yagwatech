import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const COOKIE_NAME = "admin_session";

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
  if (sig.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

/** GET /api/admin/session — returns 200 if the session cookie is valid, 401 otherwise */
export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value ?? "";
  if (token && verifySessionToken(token)) {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
