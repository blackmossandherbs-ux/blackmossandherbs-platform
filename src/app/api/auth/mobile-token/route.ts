import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.password) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const secretValue = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
        if (!secretValue) {
            throw new Error("JWT_SECRET or NEXTAUTH_SECRET must be set");
        }
        const secret = new TextEncoder().encode(secretValue);
        const alg = "HS256";

        const token = await new SignJWT({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        })
            .setProtectedHeader({ alg })
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
        console.error("Mobile token error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
