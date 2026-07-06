/**
 * Black Moss & Herbs Platform - Admin Email Archive API
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

export async function GET() {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
        const logs = await prisma.emailLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
        });

        return NextResponse.json(logs);
    } catch (error) {
        console.error('[Admin Emails GET] Error:', error);
        return NextResponse.json({ error: 'Failed to retrieve email archive.' }, { status: 500 });
    }
}
