/**
 * Black Moss & Herbs Platform - Security & Routing Middleware
 *
 * Reads the NextAuth JWT directly so it can honour our CUSTOM session cookie
 * name (set in src/lib/auth.ts). The cookie name and Secure flag must match that
 * config exactly or the token can never be read and every protected page would
 * redirect to /login.
 */
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const useSecureCookies = process.env.NODE_ENV === "production";
const SESSION_COOKIE = useSecureCookies
    ? "__Secure-blackmoss.session-token"
    : "blackmoss.session-token";

export default async function middleware(req: NextRequest) {
    const host = req.headers.get("host");
    const url = req.nextUrl;

    // Canonical-domain redirect for the .co.uk / .info variants.
    if (host && (host.includes("blackmossandherbs.co.uk") || host.includes("blackmossandherbs.info"))) {
        return NextResponse.redirect(new URL(`https://blackmossandherbs.com${url.pathname}`, req.url));
    }

    const isAdminPath = url.pathname.startsWith("/admin");
    const isDashboardPath = url.pathname.startsWith("/dashboard");

    if (isAdminPath || isDashboardPath) {
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
            cookieName: SESSION_COOKIE,
            secureCookie: useSecureCookies,
        });

        // Not signed in → send to login and remember where they were headed.
        if (!token) {
            const signInUrl = new URL("/login", req.url);
            signInUrl.searchParams.set("callbackUrl", url.pathname);
            return NextResponse.redirect(signInUrl);
        }

        // The admin area requires the ADMIN role; everyone else goes to their dashboard.
        if (isAdminPath && token.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        // /dashboard is open to any authenticated user (customer or admin).
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
