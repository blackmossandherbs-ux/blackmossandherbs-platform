/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Botanical Credits API
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { requireAdmin } from '@/lib/api-auth';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { loyaltyPoints: true }
        });

        return NextResponse.json({ points: user?.loyaltyPoints || 0 });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

/**
 * Adjust a user's loyalty points. Admin-only: previously any authenticated user
 * could grant themselves unlimited points. Point awards from purchases should be
 * driven server-side (e.g. the Stripe webhook), never by client requests.
 */
export async function POST(req: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
        const { email, amount } = await req.json();

        if (!email || typeof amount !== 'number' || Number.isNaN(amount)) {
            return NextResponse.json({ error: 'email and numeric amount are required.' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { email },
            data: {
                loyaltyPoints: {
                    increment: Math.floor(amount)
                }
            }
        });

        return NextResponse.json({ points: updatedUser.loyaltyPoints });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
