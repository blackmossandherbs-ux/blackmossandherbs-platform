/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Admin Blog Detail API
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
        const { id } = params;
        const data = await req.json();
        const blog = await prisma.blogPost.update({
            where: { id },
            data
        });
        return NextResponse.json(blog);
    } catch (error) {
        console.error('[Admin Blog PATCH] Error:', error);
        return NextResponse.json({ error: 'Failed to update wisdom record.' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
        const { id } = params;
        await prisma.blogPost.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Admin Blog DELETE] Error:', error);
        return NextResponse.json({ error: 'Failed to purge wisdom record.' }, { status: 500 });
    }
}
