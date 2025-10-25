import { NextResponse, type NextRequest } from "next/server";

/**
 * Edge Middleware - Guards (Stubs for V2)
 * 
 * Non-blocking stubs for authentication and rate limiting.
 * Logs guard decisions in development; actual enforcement deferred to later clusters.
 * 
 * Future Integration Points:
 * - Auth: Will check real session from NextAuth/Clerk in V3
 * - Rate Limiting: Will use Upstash Redis or Vercel KV for distributed state in V3
 * - CSRF: Will validate CSRF tokens on mutation routes in V4
 * 
 * Matches: /dashboard, /admin/:path*
 */

// In-memory rate limit tracker (non-persistent, resets on deploy)
// TODO: Replace with Upstash Redis or Vercel KV for production
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 30;
const rateLimitHits = new Map<string, { count: number; resetAt: number }>();

/**
 * Check if guards are enabled (controlled by env/flags)
 * In dev, guards are log-only unless explicitly enabled
 */
function areGuardsEnabled(): boolean {
  const isDev = process.env.NODE_ENV === "development";
  const guardsFlag = process.env.GUARDS_ENABLED === "true";
  
  // Guards disabled by default in dev, enabled in staging/prod
  return !isDev || guardsFlag;
}

/**
 * Auth Guard (Stub)
 * Checks for a fake session cookie: "dev-session-token"
 * Real implementation will use NextAuth/Clerk session validation
 */
function checkAuth(req: NextRequest): { 
  authenticated: boolean; 
  shouldRedirect: boolean;
  userId?: string;
} {
  const sessionCookie = req.cookies.get("dev-session-token");
  const authenticated = !!sessionCookie?.value;
  
  const enforceGuards = areGuardsEnabled();
  
  // Log decision (visible in dev console)
  if (!authenticated && req.nextUrl.pathname.startsWith("/dashboard")) {
    console.log(`[guard:auth] ${req.nextUrl.pathname} - no session cookie found`);
    if (enforceGuards) {
      console.log(`[guard:auth] would-redirect → /login`);
    } else {
      console.log(`[guard:auth] blocking disabled in dev (NODE_ENV=${process.env.NODE_ENV})`);
    }
  }
  
  return {
    authenticated,
    shouldRedirect: !authenticated && enforceGuards,
    userId: sessionCookie?.value || undefined,
  };
}

/**
 * Rate Limit Guard (Stub)
 * Simple in-memory counter per IP address
 * Real implementation will use distributed store (Redis/KV)
 */
function checkRateLimit(req: NextRequest): {
  allowed: boolean;
  shouldThrottle: boolean;
  remaining: number;
} {
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";
  const now = Date.now();
  
  let entry = rateLimitHits.get(ip);
  
  // Reset window if expired
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  }
  
  entry.count += 1;
  rateLimitHits.set(ip, entry);
  
  const allowed = entry.count <= RATE_LIMIT_MAX_REQUESTS;
  const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count);
  const enforceGuards = areGuardsEnabled();
  
  // Log throttle decisions
  if (!allowed) {
    console.log(`[guard:ratelimit] ${req.nextUrl.pathname} - IP ${ip} exceeded limit (${entry.count}/${RATE_LIMIT_MAX_REQUESTS})`);
    if (enforceGuards) {
      console.log(`[guard:ratelimit] would-throttle (429 Too Many Requests)`);
    } else {
      console.log(`[guard:ratelimit] throttling disabled in dev`);
    }
  }
  
  return {
    allowed,
    shouldThrottle: !allowed && enforceGuards,
    remaining,
  };
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Run auth guard for protected routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    const authResult = checkAuth(req);
    
    // If guards enabled and not authenticated, redirect to login
    if (authResult.shouldRedirect) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Run rate limit guard for all routes
  const rateLimitResult = checkRateLimit(req);
  
  // If guards enabled and rate limited, return 429
  if (rateLimitResult.shouldThrottle) {
    return new NextResponse("Too Many Requests", { 
      status: 429,
      headers: {
        "Retry-After": String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)),
        "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
        "X-RateLimit-Remaining": String(rateLimitResult.remaining),
      },
    });
  }
  
  // Add rate limit headers to response
  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(RATE_LIMIT_MAX_REQUESTS));
  response.headers.set("X-RateLimit-Remaining", String(rateLimitResult.remaining));
  
  return response;
}

// Match protected routes and admin paths
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};
