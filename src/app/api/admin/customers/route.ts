/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Admin Customers API
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

export async function GET(req: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');
        const vipOnly = searchParams.get('vip') === 'true';

        const where: any = {
            role: 'CUSTOMER'
        };

        // Combine search and VIP filters with AND so they don't overwrite each other.
        const and: any[] = [];

        if (search) {
            and.push({
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ]
            });
        }

        if (vipOnly) {
            // Define VIP as users who have spent over £500 or have high loyalty points
            and.push({
                OR: [
                    { loyaltyPoints: { gte: 1000 } },
                    { orders: { some: { total: { gte: 500 } } } }
                ]
            });
        }

        if (and.length) where.AND = and;

        const users = await prisma.user.findMany({
            where,
            include: {
                orders: {
                    select: {
                        total: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedUsers = users.map(user => {
            const spent = user.orders.reduce((acc, order) => acc + order.total, 0);
            return {
                id: user.id,
                name: user.name || 'Anonymous Entity',
                email: user.email,
                ordersCount: user.orders.length,
                spent,
                loyaltyPoints: user.loyaltyPoints,
                status: spent > 500 ? 'VIP Authority' : 'Active Member',
            };
        });

        return NextResponse.json(formattedUsers);
    } catch (error) {
        console.error('[Admin Customers GET] Error:', error);
        return NextResponse.json({ error: 'Failed to retrieve entity matrix.' }, { status: 500 });
    }
}
