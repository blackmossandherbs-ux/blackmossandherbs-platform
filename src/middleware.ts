/**
 * Black Moss & Herbs Platform - Security & Routing Middleware
 */
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sessionCookieName } from "@/lib/auth";
import { jwtVerify } from "jose";

export default async function middleware(req: NextRequest) {
    const host = req.headers.get("host");
    const url = req.nextUrl;

    // Domain Redirection Strategy for .co.uk and .info
    if (host && (host.includes("blackmossandherbs.co.uk") || host.includes("blackmossandherbs.info"))) {
        return NextResponse.redirect(new URL(`https://blackmossandherbs.com${url.pathname}`, req.url));
    }
    
    // Bearer token validation for API routes
    if (url.pathname.startsWith("/api/")) {
        const authHeader = req.headers.get("authorization");
        if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            try {
                const secretValue = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
                if (!secretValue) {
                    throw new Error("JWT_SECRET or NEXTAUTH_SECRET must be set");
                }
                const secret = new TextEncoder().encode(secretValue);
                const { payload } = await jwtVerify(token, secret);
                
                // Pass user details to API routes via headers
                const requestHeaders = new Headers(req.headers);
                if (payload.id) requestHeaders.set("x-user-id", String(payload.id));
                if (payload.email) requestHeaders.set("x-user-email", String(payload.email));

                return NextResponse.next({
                    request: {
                        headers: requestHeaders,
                    },
                });
            } catch (error) {
                return NextResponse.json({ error: "Unauthorized - Invalid token" }, { status: 401 });
            }
        }
    }

    // Admin Authority Protection — /admin requires the ADMIN role specifically,
    // while /dashboard (a customer's own account area) only requires being
    // logged in as any role.
    if (url.pathname.startsWith("/admin")) {
        // @ts-ignore - Explicitly invoking the auth middleware for protected authorities
        return withAuth(req, {
            cookies: {
                sessionToken: { name: sessionCookieName },
            },
            callbacks: {
                authorized: ({ token }) => !!token && token.role === "ADMIN",
            },
        });
    }

    if (url.pathname.startsWith("/dashboard")) {
        // @ts-ignore
        return withAuth(req, {
            cookies: {
                sessionToken: { name: sessionCookieName },
            },
            callbacks: {
                authorized: ({ token }) => !!token,
            },
        });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
