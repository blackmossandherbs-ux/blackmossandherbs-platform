import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = 'force-dynamic'

/**
 * Creates a real password-based account for the mobile app. The web platform
 * has no self-serve signup flow — the only pre-existing way a User row gets
 * created without a password is the guest booking flow in /api/consultations
 * (upsert by email). If that email already has a passwordless record, this
 * "claims" it rather than erroring, so a booking's consultation/biological
 * profile history carries over to the new account automatically.
 */
export async function POST(req: NextRequest) {
    if (!checkRateLimit(`mobile-register:${getClientIp(req)}`, 5, 60 * 1000)) {
        return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 })
    }

    try {
        const body = await req.json();
        const { email, password, name } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
        }
        if (typeof password !== 'string' || password.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing?.password) {
            return NextResponse.json({ error: "An account with this email already exists. Please log in instead." }, { status: 409 });
        }

        const hashed = await bcrypt.hash(password, 12);
        const user = existing
            ? await prisma.user.update({
                where: { email },
                data: { password: hashed, name: name?.trim() || existing.name },
            })
            : await prisma.user.create({
                data: { email, password: hashed, name: name?.trim() || null },
            });

        const secretValue = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
        if (!secretValue) {
            throw new Error("JWT_SECRET or NEXTAUTH_SECRET must be set");
        }
        const secret = new TextEncoder().encode(secretValue);

        const token = await new SignJWT({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("30d")
            .sign(secret);

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            }
        });
    } catch (error) {
        console.error("Mobile register error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
