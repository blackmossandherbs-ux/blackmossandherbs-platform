/**
 * Black Moss & Herbs Platform - Security & Routing Middleware
 */
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
    const host = req.headers.get("host");
    const url = req.nextUrl;

    // Domain Redirection Strategy for .co.uk and .info
    if (host && (host.includes("blackmossandherbs.co.uk") || host.includes("blackmossandherbs.info"))) {
        return NextResponse.redirect(new URL(`https://blackmossandherbs.com${url.pathname}`, req.url));
    }

    // Admin Authority Protection
    if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/dashboard")) {
        // @ts-ignore - Explicitly invoking the auth middleware for protected authorities
        return withAuth(req, {
            callbacks: {
                authorized: ({ token }) => !!token && token.role === "ADMIN",
            },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
