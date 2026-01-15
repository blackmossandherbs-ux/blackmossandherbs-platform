/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Admin Blogs API
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const blogs = await prisma.blogPost.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(blogs);
    } catch (error) {
        console.error('[Admin Blogs GET] Error:', error);
        return NextResponse.json({ error: 'Failed to retrieve wisdom records.' }, { status: 500 });
    }
}

export async function POST(req: Request) {
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
                authorPersona: data.author || 'THE_ALCHEMIST',
                published: data.published ?? true
            }
        });
        return NextResponse.json(blog);
    } catch (error) {
        console.error('[Admin Blogs POST] Error:', error);
        return NextResponse.json({ error: 'Failed to manifest wisdom record.' }, { status: 500 });
    }
}
