/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Admin Product Detail API
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
        const { id } = params;
        const body = await req.json();

        const product = await prisma.product.update({
            where: { id },
            data: {
                ...body,
                price: body.price !== undefined ? parseFloat(body.price) : undefined,
                compareAtPrice: body.compareAtPrice !== undefined ? parseFloat(body.compareAtPrice) : undefined,
                stock: body.stock !== undefined ? parseInt(body.stock) : undefined
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('[Admin Product PATCH] Error:', error);
        return NextResponse.json({ error: 'Failed to update product.' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
        const { id } = params;
        await prisma.product.delete({
            where: { id }
        });
        return NextResponse.json({ status: 'Product deleted.' });
    } catch (error) {
        console.error('[Admin Product DELETE] Error:', error);
        return NextResponse.json({ error: 'Failed to delete product.' }, { status: 500 });
    }
}
