/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Admin Stats API logic
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

export async function GET() {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
        // 1. Total Revenue (Sum of all non-cancelled orders)
        const totalRevenue = await prisma.order.aggregate({
            _sum: {
                total: true
            },
            where: {
                status: {
                    not: 'CANCELLED'
                }
            }
        });

        // 2. Active Orders (Processing or Shipped)
        const activeOrdersCount = await prisma.order.count({
            where: {
                status: {
                    in: ['PENDING', 'PROCESSING', 'SHIPPED']
                }
            }
        });

        // 3. Total Customers
        const totalCustomers = await prisma.user.count({
            where: {
                role: 'CUSTOMER'
            }
        });

        // 4. MRR (Aggregate active subscription plan prices)
        const activeSubscriptions = await prisma.subscription.findMany({
            where: {
                status: 'ACTIVE'
            },
            include: {
                plan: true
            }
        });

        const mrr = activeSubscriptions.reduce((acc, sub) => acc + sub.plan.price, 0);

        // Total non-cancelled orders (for average order value).
        const totalOrders = await prisma.order.count({ where: { status: { not: 'CANCELLED' } } });

        // 5. Recent Transactions
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        // 6. Top Performing Formulas (Simple count based on OrderItems)
        const topProductsRaw = await prisma.orderItem.groupBy({
            by: ['productId'],
            _count: {
                id: true
            },
            _sum: {
                price: true
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            },
            take: 5
        });

        const topProducts = await Promise.all(topProductsRaw.map(async (tp) => {
            const product = await prisma.product.findUnique({
                where: { id: tp.productId },
                select: { name: true }
            });
            return {
                name: product?.name || 'Unknown Compound',
                sales: tp._count.id,
                revenue: tp._sum.price || 0
            };
        }));

        return NextResponse.json({
            stats: {
                totalRevenue: totalRevenue._sum.total || 0,
                activeOrders: activeOrdersCount,
                totalCustomers,
                mrr,
                totalOrders
            },
            recentOrders: recentOrders.map(o => ({
                id: o.orderNumber,
                customer: o.user.name || o.user.email,
                amount: o.total,
                status: o.status
            })),
            topProducts
        });

    } catch (error) {
        console.error('[Admin Stats API] Error:', error);
        return NextResponse.json({ error: 'Failed to synchronize administration telemetry.' }, { status: 500 });
    }
}
