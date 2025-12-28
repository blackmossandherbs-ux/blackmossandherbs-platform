import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRole } from "@prisma/client";

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const key = ip;
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown";

    // Rate limiting for API routes
    if (path.startsWith("/api/") && !path.startsWith("/api/auth")) {
      if (!rateLimit(ip, 100, 60000)) {
        // 100 requests per minute
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
      }
    }

    // Admin routes
    if (path.startsWith("/admin")) {
      if (token?.role !== UserRole.ADMIN && token?.role !== UserRole.STAFF) {
        return NextResponse.redirect(new URL("/auth/signin?error=Unauthorized", req.url));
      }
    }

    // Staff-only routes
    if (path.startsWith("/admin/staff")) {
      if (token?.role !== UserRole.ADMIN) {
        return NextResponse.redirect(new URL("/admin?error=Unauthorized", req.url));
      }
    }

    // Practitioner routes
    if (path.startsWith("/practitioner")) {
      if (token?.role !== UserRole.PRACTITIONER && token?.role !== UserRole.ADMIN) {
        return NextResponse.redirect(new URL("/auth/signin?error=Unauthorized", req.url));
      }
    }

    // Security headers
    const response = NextResponse.next();
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Public routes
        if (
          path.startsWith("/api/auth") ||
          path.startsWith("/auth") ||
          path === "/" ||
          path.startsWith("/shop") ||
          path.startsWith("/blog") ||
          path.startsWith("/videos") ||
          path.startsWith("/_next") ||
          path.startsWith("/api/public") ||
          path.startsWith("/api/sitemap") ||
          path.startsWith("/api/rss")
        ) {
          return true;
        }

        // Protected routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/practitioner/:path*",
    "/account/:path*",
    "/membership/:path*",
    "/consultations/:path*",
    "/library/:path*",
    "/cart/:path*",
    "/api/:path*",
  ],
};
