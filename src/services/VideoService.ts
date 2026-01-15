/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Video Service
 */
import { prisma } from '@/lib/prisma';

export class VideoService {
    static async getLatestVideos(limit = 1) {
        return prisma.video.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }

    static async getAllVideos() {
        return prisma.video.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }
}
