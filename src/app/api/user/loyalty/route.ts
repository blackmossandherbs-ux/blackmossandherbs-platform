/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Botanical Credits API
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { action, amount } = await req.json();

        // Simple logic for awarding points based on purchase amount (simplified)
        // In a real app, this would be triggered by a Stripe Webhook
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                loyaltyPoints: {
                    increment: Math.floor(amount || 0)
                }
            }
        });

        return NextResponse.json({ points: updatedUser.loyaltyPoints });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
