/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Admin Videos API
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-auth';

export async function GET() {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
        const videos = await prisma.video.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(videos);
    } catch (error) {
        console.error('[Admin Videos GET] Error:', error);
        return NextResponse.json({ error: 'Failed to load videos.' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const denied = await requireAdmin();
    if (denied) return denied;
    try {
        const data = await req.json();
        const video = await prisma.video.create({
            data: {
                title: data.title,
                slug: data.slug || data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                description: data.description,
                videoUrl: data.url,
                thumbnail: data.thumbnail || '/images/placeholder.jpg',
                category: data.category,
                // duration is stored as seconds (Int); coerce or leave null
                duration: data.duration ? parseInt(data.duration, 10) || null : null
            }
        });
        return NextResponse.json(video);
    } catch (error) {
        console.error('[Admin Videos POST] Error:', error);
        return NextResponse.json({ error: 'Failed to create video.' }, { status: 500 });
    }
}
