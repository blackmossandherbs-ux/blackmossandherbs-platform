import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = 'https://blackmossandherbs.com'

// Generated at request time so a missing DB at build time does not fail the build.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Static Routes
    const routes = [
        '',
        '/shop',
        '/blog',
        '/videos',
        '/about',
        '/contact',
        '/consultations',
        '/subscriptions',
        '/membership',
        '/library',
        '/quiz',
        '/wisdom',
        '/faq',
        '/legal/privacy',
        '/legal/terms',
        '/login'
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic routes are best-effort: if the DB is unreachable we still return
    // the static sitemap rather than throwing.
    try {
        const [products, posts] = await Promise.all([
            prisma.product.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } }),
            prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
        ])

        const productRoutes = products.map((product) => ({
            url: `${BASE_URL}/shop/${product.slug}`,
            lastModified: product.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }))

        const blogRoutes = posts.map((post) => ({
            url: `${BASE_URL}/blog/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))

        return [...routes, ...productRoutes, ...blogRoutes]
    } catch (error) {
        console.error('[sitemap] dynamic routes unavailable:', error)
        return routes
    }
}
