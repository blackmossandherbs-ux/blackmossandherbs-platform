/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Admin Order Detail API
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
        const { id } = params;
        const { status } = await req.json();

        const order = await prisma.order.update({
            where: { id },
            data: { status },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('[Admin Order PATCH] Error:', error);
        return NextResponse.json({ error: 'Failed to update logistics status.' }, { status: 500 });
    }
}
