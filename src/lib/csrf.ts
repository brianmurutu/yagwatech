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
  // Always skip CSRF origin checks in development mode
  if (process.env.NODE_ENV === "development") return null;

  const origin = request.headers.get("origin");

  // No Origin header — could be a direct server-to-server or curl call.
  // Reject to be safe (browsers always send Origin on cross-origin POSTs).
  if (!origin) {
    return forbidden("Missing origin header.");
  }

  const normalized = origin.replace(/\/$/, "");

  // Allow localhost / loopback on any port for local testing
  const isLocalhost = (urlStr: string) => {
    try {
      const url = new URL(urlStr);
      return url.hostname === "localhost" || url.hostname === "127.0.0.1";
    } catch {
      return false;
    }
  };

  if (isLocalhost(normalized)) {
    return null;
  }

  // 1. Check against process.env.NEXT_PUBLIC_SITE_URL or allowed localhost ports
  if (ALLOWED_ORIGINS.has(normalized)) {
    return null;
  }

  // 2. Dynamic check: Allow if the origin matches the request's own host.
  // This is safe against CSRF because a CSRF attack would have a different Origin
  // than the target site (Host).
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = request.headers.get("host");

  if (forwardedHost) {
    const reconstructed = `${proto}://${forwardedHost}`.replace(/\/$/, "");
    if (normalized === reconstructed) {
      return null;
    }
  }

  if (host) {
    const reconstructed = `${proto}://${host}`.replace(/\/$/, "");
    if (normalized === reconstructed) {
      return null;
    }
  }

  // Check against request URL's origin
  try {
    const requestUrl = new URL(request.url);
    if (normalized === requestUrl.origin) {
      return null;
    }
  } catch (e) {
    // Ignore URL parsing errors
  }

  if (normalized !== "") {
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
