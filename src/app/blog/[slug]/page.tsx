import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Calendar, Clock, ArrowLeft, User, Share2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Props {
    params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await prisma.blogPost.findUnique({
        where: { slug: params.slug }
    })

    if (!post) return { title: 'Post Not Found' }

    return {
        title: `${post.title} | Black Moss & Herbs`,
        description: post.excerpt,
        alternates: { canonical: `https://blackmossandherbs.com/blog/${post.slug}` },
        openGraph: {
            title: post.title,
            description: post.excerpt ?? undefined,
            url: `https://blackmossandherbs.com/blog/${post.slug}`,
            type: 'article',
            publishedTime: (post.publishedAt || post.createdAt).toISOString(),
            images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : [],
        },
    }
}

export default async function BlogPostPage({ params }: Props) {
    const post = await prisma.blogPost.findUnique({
        where: { slug: params.slug }
    })

    if (!post) notFound()

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage ?? undefined,
        datePublished: (post.publishedAt || post.createdAt).toISOString(),
        dateModified: post.updatedAt.toISOString(),
        author: {
            '@type': 'Organization',
            name: 'Black Moss & Herbs',
            url: 'https://blackmossandherbs.com',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Black Moss & Herbs',
            logo: { '@type': 'ImageObject', url: 'https://blackmossandherbs.com/images/logo.png' },
        },
        url: `https://blackmossandherbs.com/blog/${post.slug}`,
        mainEntityOfPage: `https://blackmossandherbs.com/blog/${post.slug}`,
    }

    return (
        <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <article className="min-h-screen bg-earth-50 pb-20">
            {/* Hero Header */}
            <div className="relative h-[60vh] bg-earth-900 overflow-hidden">
                {post.coverImage && (
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-60"
                        style={{ backgroundImage: `url(${post.coverImage})` }}
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-earth-900 via-earth-900/50 to-transparent" />

                <div className="container relative h-full flex flex-col justify-end pb-16">
                    <Link href="/blog" className="inline-flex items-center text-earth-300 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="mr-2 w-4 h-4" /> Back to Wisdom
                    </Link>

                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="badge-secondary">{post.category}</span>
                            {post.authorPersona && (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-900/50 text-primary-300 border border-primary-500/30 uppercase tracking-wider">
                                    {post.authorPersona.replace('_', ' ')}
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-6 text-earth-300">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(post.publishedAt || post.createdAt)}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                5 min read
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="container max-w-3xl -mt-10 relative z-10">
                <div className="card p-8 md:p-12 bg-white shadow-xl">
                    <p className="text-xl font-serif text-earth-700 italic border-l-4 border-secondary-500 pl-6 mb-10 leading-relaxed">
                        {post.excerpt}
                    </p>

                    <div className="prose prose-lg prose-earth max-w-none">
                        {/* 
                           SAFEGUARD: In a real "Enterprise" app, use a sanitizer library like 'dompurify' 
                           before rendering HTML from DB. For now, trusting Admin input.
                        */}
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    <hr className="my-12 border-earth-200" />

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-earth-200 rounded-full flex items-center justify-center">
                                <User className="text-earth-600" />
                            </div>
                            <div>
                                <div className="font-bold text-earth-900">Authored by The Council</div>
                                <div className="text-sm text-earth-500">Verified Botanical Research</div>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 text-earth-600 hover:text-primary-600 transition-colors">
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                    </div>
                </div>
            </div>
        </article>
        </>
    )
}
