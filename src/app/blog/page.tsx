/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Wellness Blog
 */
import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight, Sparkles, Leaf } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'The Journal - Black Moss & Herbs',
    description: 'A curated stream of botanical wisdom, alchemical research, and biological reporting.',
}

async function getPosts() {
    return await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { publishedAt: 'desc' },
        take: 12
    })
}

export default async function BlogPage() {
    const posts = await getPosts()
    const featuredPost = posts[0]
    const regularPosts = posts.slice(1)
    const categories = ['All', 'Clinical Reports', 'Herbal Wisdom', 'Ecological News', 'Bio-Electric']

    return (
        <div className="py-20 bg-earth-950 min-h-screen">
            <div className="container">
                {/* Journalist Header */}
                <div className="mb-20 text-center border-b border-earth-800 pb-12">
                    <p className="text-secondary-500 text-xs font-black uppercase tracking-[0.3em] mb-4">The Hectic Chronicle</p>
                    <h1 className="text-6xl md:text-8xl font-serif font-black text-white mb-6 tracking-tighter">
                        THE JOURNAL
                    </h1>
                    <p className="text-earth-400 text-xl max-w-2xl mx-auto font-serif italic">
                        "Reporting from the frontlines of biological warfare and cellular restoration."
                    </p>
                </div>

                {/* Interactive Tickers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    <Link href="/quiz">
                        <div className="group card p-8 border border-earth-800 bg-earth-900/30 hover:bg-earth-800/50 transition-all rounded-2xl flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Bio-Analysis</h3>
                                <p className="text-earth-500 text-sm">Take the diagnostic.</p>
                            </div>
                            <div className="w-10 h-10 bg-primary-900/20 rounded-full flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
                                <Sparkles size={18} />
                            </div>
                        </div>
                    </Link>
                    <Link href="/wisdom/registry">
                        <div className="group card p-8 border border-earth-800 bg-earth-900/30 hover:bg-earth-800/50 transition-all rounded-2xl flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Food Registry</h3>
                                <p className="text-earth-500 text-sm">Alkaline vs Acidic index.</p>
                            </div>
                            <div className="w-10 h-10 bg-secondary-900/20 rounded-full flex items-center justify-center text-secondary-400 group-hover:scale-110 transition-transform">
                                <Leaf size={18} />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${category === 'All'
                                ? 'bg-white text-black'
                                : 'bg-earth-900 text-earth-500 hover:text-white border border-earth-800'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {posts.length > 0 ? (
                    <>
                        {/* Featured High-Impact Post */}
                        {featuredPost && (
                            <Link href={`/blog/${featuredPost.slug}`}>
                                <article className="relative rounded-[2.5rem] overflow-hidden mb-20 group cursor-pointer border border-earth-800">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                                    <div className="h-[600px] bg-earth-800 relative">
                                        {/* Fallback pattern if no image */}
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
                                            <span className="bg-secondary-500 text-black px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"> Breaking News</span>
                                            <span className="text-white text-xs font-bold uppercase tracking-widest border-l border-white/30 pl-4">{featuredPost.category}</span>
                                        </div>
                                        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 max-w-4xl leading-none group-hover:text-secondary-400 transition-colors">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="text-earth-200 text-lg md:text-xl max-w-2xl mb-8 line-clamp-2">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="flex items-center gap-2 text-white font-bold uppercase text-xs tracking-widest group-hover:translate-x-4 transition-transform">
                                            Read Full Report <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        )}

                        {/* News Feed Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {regularPosts.map((post) => (
                                <Link key={post.id} href={`/blog/${post.slug}`}>
                                    <article className="card bg-transparent border-t border-earth-800 rounded-none pt-8 hover:border-earth-600 transition-colors group">
                                        <div className="aspect-[4/3] bg-earth-900 rounded-2xl mb-6 overflow-hidden relative border border-earth-800">
                                            {post.coverImage ? (
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                                                    style={{ backgroundImage: `url(${post.coverImage})` }}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-earth-700 text-4xl">📰</div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mb-4 text-xs font-bold uppercase tracking-widest text-secondary-500">
                                            <span>{post.category}</span>
                                            <span className="text-earth-700">•</span>
                                            <span className="text-earth-500">{formatDate(post.publishedAt || post.createdAt)}</span>
                                        </div>
                                        <h3 className="text-2xl font-serif font-bold text-white mb-3 group-hover:text-primary-400 transition-colors leading-tight">
                                            {post.title}
                                        </h3>
                                        <p className="text-earth-500 text-sm line-clamp-3 leading-relaxed mb-4">
                                            {post.excerpt}
                                        </p>
                                        <div className="text-earth-600 text-xs font-bold uppercase tracking-widest group-hover:text-white transition-colors">
                                            Read Report →
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 border border-dashed border-earth-800 rounded-3xl">
                        <div className="text-6xl mb-4">📡</div>
                        <h3 className="text-2xl font-serif font-bold text-white mb-2">Signal Quiet</h3>
                        <p className="text-earth-500">The Council is currently compiling reports. Check back shortly.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
