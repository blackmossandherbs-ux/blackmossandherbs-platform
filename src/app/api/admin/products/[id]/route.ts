/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Admin Product Detail API
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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
        return NextResponse.json({ error: 'Failed to update alchemical record.' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        await prisma.product.delete({
            where: { id }
        });
        return NextResponse.json({ status: 'Product purged from matrix.' });
    } catch (error) {
        console.error('[Admin Product DELETE] Error:', error);
        return NextResponse.json({ error: 'Failed to purge record.' }, { status: 500 });
    }
}
