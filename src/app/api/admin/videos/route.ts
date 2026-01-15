/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Admin Videos API
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const videos = await prisma.video.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(videos);
    } catch (error) {
        console.error('[Admin Videos GET] Error:', error);
        return NextResponse.json({ error: 'Failed to retrieve visual records.' }, { status: 500 });
    }
}

export async function POST(req: Request) {
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
                duration: data.duration || '0:00'
            }
        });
        return NextResponse.json(video);
    } catch (error) {
        console.error('[Admin Videos POST] Error:', error);
        return NextResponse.json({ error: 'Failed to manifest visual record.' }, { status: 500 });
    }
}
