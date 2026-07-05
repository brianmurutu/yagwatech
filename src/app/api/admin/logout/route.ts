import { NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";

export async function POST() {
  const response = NextResponse.json({ success: true });
  // Clear the session cookie
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  return response;
}
