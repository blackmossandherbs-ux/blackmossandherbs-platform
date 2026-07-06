/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Admin Product CRUD API
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

export async function GET(req: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        const where: any = {};
        if (category && category !== 'All Categories') {
            where.category = category;
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const products = await prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('[Admin Products GET] Error:', error);
        return NextResponse.json({ error: 'Failed to retrieve manifest.' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
        const body = await req.json();
        const {
            name,
            slug,
            description,
            price,
            compareAtPrice,
            category,
            type,
            stock,
            images,
            therapeuticGoals,
            active,
            featured
        } = body;

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                price: parseFloat(price),
                compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
                category,
                type,
                stock: parseInt(stock),
                images,
                therapeuticGoals: therapeuticGoals || [],
                active: active !== undefined ? active : true,
                featured: featured !== undefined ? featured : false
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('[Admin Products POST] Error:', error);
        return NextResponse.json({ error: 'Failed to manifest new product.' }, { status: 500 });
    }
}
