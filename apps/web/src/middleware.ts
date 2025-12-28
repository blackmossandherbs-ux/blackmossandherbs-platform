import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRole } from "@prisma/client";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes
    if (path.startsWith("/admin")) {
      if (token?.role !== UserRole.ADMIN && token?.role !== UserRole.STAFF) {
        return NextResponse.redirect(new URL("/auth/signin?error=Unauthorized", req.url));
      }
    }

    // Staff routes
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

    return NextResponse.next();
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
          path.startsWith("/api/public")
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
  ],
};
