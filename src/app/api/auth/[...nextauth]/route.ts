
/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Auth Handler
 */
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const handler = NextAuth(authOptions);

// Rate-limit the credentials login attempt specifically, so a brute-force
// password guesser can't hammer this endpoint unlimited times per IP.
async function rateLimitedHandler(req: Request, ctx: unknown) {
    if (req.method === "POST" && req.url.includes("/callback/credentials")) {
        if (!checkRateLimit(`login:${getClientIp(req)}`, 10, 5 * 60 * 1000)) {
            return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429 });
        }
    }
    // @ts-ignore - handler's signature is (req, ctx) per the App Router route contract
    return handler(req, ctx);
}

export { rateLimitedHandler as GET, rateLimitedHandler as POST };
