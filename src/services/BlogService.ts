/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Blog Service
 */
import { prisma } from '@/lib/prisma';

export class BlogService {
    static async getLatestPosts(limit = 3) {
        return prisma.blogPost.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }

    static async getPostBySlug(slug: string) {
        return prisma.blogPost.findUnique({
            where: { slug }
        });
    }

    static async getAllPosts() {
        return prisma.blogPost.findMany({
            where: { published: true },
            orderBy: { createdAt: 'desc' }
        });
    }
}
