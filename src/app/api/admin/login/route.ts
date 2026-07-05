import { NextResponse } from "next/server";
import { timingSafeEqual, createHmac, randomBytes } from "crypto";
import { loginLimiter, getClientIp, rateLimitResponse } from "@/lib/rateLimit";

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours

/** Sign a token with the session secret using HMAC-SHA256 */
function signToken(value: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "change-me-in-production";
  return createHmac("sha256", secret).update(value).digest("hex");
}

/** Create a signed session token: `<random>.<signature>` */
function createSessionToken(): string {
  const rand = randomBytes(32).toString("hex");
  const sig = signToken(rand);
  return `${rand}.${sig}`;
}

/** Verify a session token — returns true if valid */
export function verifySessionToken(token: string): boolean {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const rand = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = signToken(rand);
  try {
    return timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  // ── Rate limit by IP ────────────────────────────────────────────────────────
  const ip = getClientIp(request);
  const rl = loginLimiter.check(ip);
  if (!rl.allowed) return rateLimitResponse(rl);

  // ── Parse body ──────────────────────────────────────────────────────────────
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { username = "", password = "" } = body;

  // ── Read credentials from environment (never from source code) ──────────────
  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    console.error("[admin/login] ADMIN_USERNAME or ADMIN_PASSWORD env vars are not set.");
    return NextResponse.json(
      { error: "Admin credentials are not configured on the server." },
      { status: 500 }
    );
  }

  // ── Constant-time comparison (prevents timing attacks) ─────────────────────
  let usernameMatch = false;
  let passwordMatch = false;
  try {
    const uBuf = Buffer.from(username);
    const eBuf = Buffer.from(expectedUsername);
    // timingSafeEqual requires same length buffers
    usernameMatch =
      uBuf.length === eBuf.length && timingSafeEqual(uBuf, eBuf);

    const pBuf = Buffer.from(password);
    const epBuf = Buffer.from(expectedPassword);
    passwordMatch =
      pBuf.length === epBuf.length && timingSafeEqual(pBuf, epBuf);
  } catch {
    usernameMatch = false;
    passwordMatch = false;
  }

  if (!usernameMatch || !passwordMatch) {
    // Generic message — no hints about which field was wrong
    return NextResponse.json(
      { error: "Invalid credentials." },
      { status: 401 }
    );
  }

  // ── Issue signed session cookie ─────────────────────────────────────────────
  const token = createSessionToken();
  const isSecure = process.env.NODE_ENV === "production";

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  return response;
}
