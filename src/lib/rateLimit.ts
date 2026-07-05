/**
 * In-memory sliding-window rate limiter.
 * No external dependency needed — works on Vercel serverless functions.
 *
 * Usage:
 *   const limiter = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 });
 *   const result  = limiter.check(ip);
 *   if (!result.allowed) return rateLimitResponse(result);
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // epoch ms
}

interface WindowEntry {
  count: number;
  resetAt: number;
}

export function createRateLimiter(options: { windowMs: number; max: number }) {
  const { windowMs, max } = options;
  const store = new Map<string, WindowEntry>();

  // Periodically purge expired entries to avoid memory leaks
  if (typeof setInterval !== "undefined") {
    setInterval(() => {
      const now = Date.now();
      const entries = Array.from(store.entries());
      for (const [key, entry] of entries) {
        if (entry.resetAt < now) store.delete(key);
      }
    }, windowMs);
  }

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();
      const entry = store.get(key);

      if (!entry || entry.resetAt < now) {
        // Fresh window
        store.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
      }

      if (entry.count >= max) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt };
      }

      entry.count += 1;
      return { allowed: true, remaining: max - entry.count, resetAt: entry.resetAt };
    },
  };
}

/** Extract best-effort client IP from Next.js request headers */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}

/** Standard 429 response with Retry-After */
export function rateLimitResponse(result: RateLimitResult): Response {
  const retryAfterSec = Math.ceil((result.resetAt - Date.now()) / 1000);
  return new Response(
    JSON.stringify({
      error: "Too many requests. Please wait a moment and try again.",
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSec),
        "X-RateLimit-Reset": String(result.resetAt),
      },
    }
  );
}

// ── Pre-built limiters for each endpoint ──────────────────────────────────────

/** 5 submissions per 10 minutes — for contact / quote / newsletter forms */
export const formLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 5,
});

/** 5 login attempts per 15 minutes — for admin login */
export const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
});
