/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Admin Video Detail API
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
        const { id } = params;
        await prisma.video.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Admin Video DELETE] Error:', error);
        return NextResponse.json({ error: 'Failed to purge visual record.' }, { status: 500 });
    }
}
