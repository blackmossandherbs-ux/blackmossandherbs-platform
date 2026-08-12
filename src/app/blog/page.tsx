/**
 * Black Moss & Herbs Platform - Wellness Blog
 */
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Sparkles, Leaf } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'The Journal | Black Moss & Herbs',
    description: 'Botanical wisdom, herbal science, and wellness insights from the Black Moss & Herbs team.',
}

const CATEGORIES = ['All', 'Sea Moss', 'Herbal Wisdom', 'Nutrition', 'Wellness', 'Recipes']

async function getPosts(category?: string) {
    const where: any = { published: true }
    if (category && category !== 'All') {
        where.category = { contains: category, mode: 'insensitive' }
    }
    return await prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        take: 12,
    })
}

export default async function BlogPage({
    searchParams,
}: {
    searchParams: { category?: string }
}) {
    const activeCategory = searchParams.category || 'All'
    const posts = await getPosts(activeCategory)
    const featuredPost = activeCategory === 'All' ? posts[0] : null
    const regularPosts = activeCategory === 'All' ? posts.slice(1) : posts

    const blogSchema = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'The Journal | Black Moss & Herbs',
        description: 'Science-backed insights on herbal wellness, written by practitioners.',
        url: 'https://blackmossandherbs.com/blog',
        blogPost: posts.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            url: `https://blackmossandherbs.com/blog/${p.slug}`,
            datePublished: (p.publishedAt || p.createdAt).toISOString(),
            image: p.coverImage || undefined,
        })),
    }

    return (
        <div className="py-20 bg-earth-950 min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
            <div className="container">
                {/* Header */}
                <div className="mb-20 text-center border-b border-earth-800 pb-12">
                    <p className="text-secondary-500 text-xs font-black uppercase tracking-[0.3em] mb-4">Botanical Knowledge</p>
                    <h1 className="text-6xl md:text-8xl font-serif font-black text-white mb-6 tracking-tighter">
                        THE JOURNAL
                    </h1>
                    <p className="text-earth-400 text-xl max-w-2xl mx-auto font-serif italic">
                        &ldquo;Science-backed insights on herbal wellness, written by practitioners.&rdquo;
                    </p>
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    <Link href="/quiz">
                        <div className="group premium-card p-8 flex items-center justify-between hover:border-primary-500/50 transition-all">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Wellness Quiz</h3>
                                <p className="text-earth-500 text-sm">Find your ideal protocol.</p>
                            </div>
                            <div className="w-10 h-10 bg-primary-900/20 rounded-full flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
                                <Sparkles size={18} />
                            </div>
                        </div>
                    </Link>
                    <Link href="/wisdom/registry">
                        <div className="group premium-card p-8 flex items-center justify-between hover:border-secondary-500/50 transition-all">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Food Registry</h3>
                                <p className="text-earth-500 text-sm">Alkaline vs acidic index.</p>
                            </div>
                            <div className="w-10 h-10 bg-secondary-900/20 rounded-full flex items-center justify-center text-secondary-400 group-hover:scale-110 transition-transform">
                                <Leaf size={18} />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Category filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat}
                            href={cat === 'All' ? '/blog' : `/blog?category=${encodeURIComponent(cat)}`}
                            className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${
                                activeCategory === cat
                                    ? 'bg-white text-black'
                                    : 'bg-earth-900 text-earth-500 hover:text-white border border-earth-800 hover:border-earth-600'
                            }`}
                        >
                            {cat}
                        </Link>
                    ))}
                </div>

                {posts.length > 0 ? (
                    <>
                        {/* Featured post (All view only) */}
                        {featuredPost && (
                            <Link href={`/blog/${featuredPost.slug}`}>
                                <article className="relative rounded-[2.5rem] overflow-hidden mb-20 group cursor-pointer border border-earth-800">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                                    <div className="h-[500px] bg-earth-800 relative">
                                        <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-10" />
                                        {featuredPost.coverImage && (
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                                                style={{ backgroundImage: `url(${featuredPost.coverImage})` }}
                                            />
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-20">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="bg-secondary-500 text-black px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Latest</span>
                                            <span className="text-white text-xs font-bold uppercase tracking-widest border-l border-white/30 pl-4">{featuredPost.category}</span>
                                        </div>
                                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 max-w-3xl leading-tight group-hover:text-secondary-400 transition-colors">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="text-earth-200 text-lg max-w-2xl mb-6 line-clamp-2">{featuredPost.excerpt}</p>
                                        <div className="flex items-center gap-2 text-white font-bold uppercase text-xs tracking-widest group-hover:translate-x-4 transition-transform">
                                            Read Article <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        )}

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {regularPosts.map((post) => (
                                <Link key={post.id} href={`/blog/${post.slug}`}>
                                    <article className="group premium-card overflow-hidden h-full flex flex-col hover:border-earth-600 transition-colors">
                                        <div className="aspect-[4/3] bg-earth-900 overflow-hidden relative">
                                            {post.coverImage ? (
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                                                    style={{ backgroundImage: `url(${post.coverImage})` }}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-earth-700">
                                                    <Leaf className="w-12 h-12" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center gap-3 mb-4 text-xs font-bold uppercase tracking-widest text-secondary-500">
                                                <span>{post.category}</span>
                                                <span className="text-earth-700">•</span>
                                                <span className="text-earth-500">{formatDate(post.publishedAt || post.createdAt)}</span>
                                            </div>
                                            <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-secondary-400 transition-colors leading-tight flex-1">
                                                {post.title}
                                            </h3>
                                            <p className="text-earth-500 text-sm line-clamp-3 leading-relaxed mb-4">
                                                {post.excerpt}
                                            </p>
                                            <div className="text-earth-600 text-xs font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                                                Read Article →
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 border border-dashed border-earth-800 rounded-3xl">
                        <Leaf className="w-12 h-12 text-earth-700 mx-auto mb-4" />
                        <h3 className="text-2xl font-serif font-bold text-white mb-2">
                            {activeCategory === 'All' ? 'Articles coming soon' : `No articles in "${activeCategory}"`}
                        </h3>
                        {activeCategory !== 'All' && (
                            <Link href="/blog" className="text-secondary-400 hover:text-secondary-300 font-semibold mt-4 inline-block">
                                View all articles →
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
