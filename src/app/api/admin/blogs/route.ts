/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Admin Blogs API
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

export async function GET() {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
        const blogs = await prisma.blogPost.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(blogs);
    } catch (error) {
        console.error('[Admin Blogs GET] Error:', error);
        return NextResponse.json({ error: 'Failed to load blog posts.' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
        const data = await req.json();
        const blog = await prisma.blogPost.create({
            data: {
                title: data.title,
                slug: data.slug || data.title.toLowerCase().replace(/ /g, '-'),
                content: data.content,
                excerpt: data.excerpt,
                coverImage: data.image || '/images/wisdom-placeholder.jpg',
                category: data.category,
                authorPersona: data.author || 'MARCUS_ADEYEMI',
                published: data.published ?? true
            }
        });
        return NextResponse.json(blog);
    } catch (error) {
        console.error('[Admin Blogs POST] Error:', error);
        return NextResponse.json({ error: 'Failed to create blog post.' }, { status: 500 });
    }
}
