/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Admin Customers API
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');
        const vipOnly = searchParams.get('vip') === 'true';

        const where: any = {
            role: 'CUSTOMER'
        };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (vipOnly) {
            // Define VIP as users who have spent over £500 or have high loyalty points
            where.OR = [
                { loyaltyPoints: { gte: 1000 } },
                { orders: { some: { total: { gte: 500 } } } }
            ];
        }

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
                lastSync: 'Sync Active' // Placeholder for last activity logic
            };
        });

        return NextResponse.json(formattedUsers);
    } catch (error) {
        console.error('[Admin Customers GET] Error:', error);
        return NextResponse.json({ error: 'Failed to retrieve entity matrix.' }, { status: 500 });
    }
}
