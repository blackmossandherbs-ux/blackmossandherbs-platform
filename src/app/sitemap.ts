import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = 'https://blackmossandherbs.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Static Routes
    const routes = [
        '',
        '/shop',
        '/blog',
        '/about',
        '/contact',
        '/consultations',
        '/library',
        '/faq',
        '/login'
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // 2. Products
    const products = await prisma.product.findMany({
        select: { slug: true, updatedAt: true }
    })

    const productRoutes = products.map((product) => ({
        url: `${BASE_URL}/shop/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    // 3. Blog Posts
    const posts = await prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true }
    })

    const blogRoutes = posts.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    return [...routes, ...productRoutes, ...blogRoutes]
}
