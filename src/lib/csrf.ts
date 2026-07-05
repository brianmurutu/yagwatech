/**
 * CSRF Origin validation helper.
 *
 * Checks that POST requests originate from the same site by inspecting
 * the `Origin` header (set by all modern browsers on cross-site requests).
 *
 * Usage:
 *   const err = validateOrigin(request);
 *   if (err) return err;
 */

const ALLOWED_ORIGINS = new Set([
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "",
  // Allow localhost in development
  "http://localhost:3000",
  "http://localhost:3001",
]);

/**
 * Returns a 403 Response if the request Origin is disallowed, otherwise null.
 * Safe to call on every mutating API route (POST / PUT / DELETE).
 */
export function validateOrigin(request: Request): Response | null {
  // Skip in development if no env var is set
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl && process.env.NODE_ENV === "development") return null;

  const origin = request.headers.get("origin");

  // No Origin header — could be a direct server-to-server or curl call.
  // Reject to be safe (browsers always send Origin on cross-origin POSTs).
  if (!origin) {
    // Allow in dev for ease of testing with curl / Postman
    if (process.env.NODE_ENV === "development") return null;
    return forbidden("Missing origin header.");
  }

  const normalized = origin.replace(/\/$/, "");
  if (!ALLOWED_ORIGINS.has(normalized) && normalized !== "") {
    return forbidden(`Origin not allowed: ${normalized}`);
  }

  return null;
}

function forbidden(reason: string): Response {
  return new Response(
    JSON.stringify({ error: "Forbidden", reason }),
    {
      status: 403,
      headers: { "Content-Type": "application/json" },
    }
  );
}
