/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Abandoned Cart Recovery Logic
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/mail';

export async function GET(req: Request) {
    try {
        // Authenticate request (should be a secret CRON_SECRET)
        const { searchParams } = new URL(req.url);
        if (searchParams.get('secret') !== process.env.CRON_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Find PENDING orders created more than 2 hours ago but less than 24 hours ago
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const abandonedOrders = await prisma.order.findMany({
            where: {
                status: 'PENDING',
                createdAt: {
                    lte: twoHoursAgo,
                    gte: twentyFourHoursAgo
                },
                // Add a flag or check to ensure we haven't sent a recovery email yet
                // (This would require a new field in Order model, but for now we'll simulate)
            },
            include: {
                user: true,
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        console.log(`[Cron] Found ${abandonedOrders.length} potential abandoned carts.`);

        for (const order of abandonedOrders) {
            const userName = order.user.name || 'Alchemist';
            const productNames = order.items.map(item => item.product.name).join(', ');

            await sendEmail({
                to: order.user.email,
                subject: 'Your Biological Gold is Waiting...',
                html: `
                    <div style="font-family: serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 20px;">
                        <h1 style="color: #065f46; font-size: 24px;">Greetings, ${userName}</h1>
                        <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                            We noticed you left some powerful organic compounds behind. Your path to restoration is waiting for you to complete the final step.
                        </p>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
                            <strong style="color: #065f46; font-size: 14px; text-transform: uppercase;">In Your Matrix:</strong>
                            <p style="margin: 10px 0 0 0; font-weight: bold;">${productNames}</p>
                        </div>
                        <p style="font-size: 16px; line-height: 1.6; color: #4b5563;">
                            Would you like to reclaim your cart and finalize your order?
                        </p>
                        <a href="${process.env.NEXTAUTH_URL}/checkout?orderId=${order.id}" 
                           style="display: inline-block; background: #065f46; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; margin-top: 20px;">
                            Complete Your Restoration
                        </a>
                        <p style="font-size: 12px; color: #9ca3af; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                            HECTIC Authority Control • Black Moss & Herbs
                        </p>
                    </div>
                `
            });

            console.log(`[Cron] Recovery email sent to ${order.user.email} for order ${order.id}`);
        }

        return NextResponse.json({ processed: abandonedOrders.length });

    } catch (error) {
        console.error('[Cron] Error in abandoned-cart:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
