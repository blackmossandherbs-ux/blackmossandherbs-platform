import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Leaf } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Wisdom Library | Black Moss & Herbs',
    description: 'In-depth herbal wellness guides, protocols, and research from the Black Moss & Herbs practitioner team.',
}

const CATEGORIES = ['All', 'Sea Moss', 'Herbal Science', 'Protocols', 'Nutrition', 'Lifestyle']

export default async function WisdomBlogsPage({
    searchParams,
}: {
    searchParams: { category?: string }
}) {
    const activeCategory = searchParams.category || 'All'

    const where: any = { published: true }
    if (activeCategory !== 'All') {
        where.category = { contains: activeCategory, mode: 'insensitive' }
    }

    const posts = await prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        take: 24,
    })

    return (
        <div className="py-24 bg-earth-950 min-h-screen">
            <div className="container pt-12">
                {/* Header */}
                <div className="mb-16">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mb-4 block">Knowledge Base</span>
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4 tracking-tighter">Wisdom Library</h1>
                    <p className="text-earth-400 text-lg max-w-2xl">
                        Deep-dive guides on herbal science, alkaline nutrition, and practical wellness protocols — written by our practitioners.
                    </p>
                </div>

                {/* Category filter */}
                <div className="flex flex-wrap gap-3 mb-12">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat}
                            href={cat === 'All' ? '/wisdom/blogs' : `/wisdom/blogs?category=${encodeURIComponent(cat)}`}
                            className={`px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${
                                activeCategory === cat
                                    ? 'bg-primary-700 text-white border border-primary-600'
                                    : 'bg-earth-900 text-earth-500 hover:text-white border border-earth-800 hover:border-earth-600'
                            }`}
                        >
                            {cat}
                        </Link>
                    ))}
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-24">
                        <Leaf className="w-12 h-12 text-earth-700 mx-auto mb-4" />
                        <h2 className="text-2xl font-serif font-bold text-white mb-3">
                            {activeCategory === 'All' ? 'Articles coming soon' : `No articles in "${activeCategory}"`}
                        </h2>
                        {activeCategory !== 'All' && (
                            <Link href="/wisdom/blogs" className="text-primary-400 hover:text-primary-300 font-semibold mt-2 inline-block">
                                View all articles →
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link key={post.id} href={`/wisdom/blogs/${post.slug}`} className="group">
                                <article className="premium-card overflow-hidden h-full flex flex-col hover:border-primary-500/40 transition-colors">
                                    <div className="aspect-[16/9] bg-earth-900 relative overflow-hidden">
                                        {post.coverImage ? (
                                            <div
                                                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                                                style={{ backgroundImage: `url(${post.coverImage})` }}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Leaf className="w-10 h-10 text-earth-700" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                        <span className="absolute top-4 left-4 px-3 py-1 bg-earth-950/80 border border-earth-800 text-primary-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                                            {post.category}
                                        </span>
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <p className="text-earth-600 text-xs font-bold uppercase tracking-widest mb-3">
                                            {formatDate(post.publishedAt || post.createdAt)}
                                            {post.authorPersona ? ` · ${post.authorPersona.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}` : ''}
                                        </p>
                                        <h2 className="font-serif text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors leading-snug flex-1">
                                            {post.title}
                                        </h2>
                                        <p className="text-earth-500 text-sm line-clamp-2 leading-relaxed mb-4">{post.excerpt}</p>
                                        <div className="flex items-center gap-2 text-primary-400 text-xs font-bold uppercase tracking-widest group-hover:gap-3 transition-all">
                                            Read Article <ArrowRight className="w-3.5 h-3.5" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Link back to main wisdom hub */}
                <div className="mt-16 text-center">
                    <Link href="/wisdom" className="text-earth-500 hover:text-earth-300 text-sm font-bold uppercase tracking-widest transition-colors">
                        ← Back to Wisdom Hub
                    </Link>
                </div>
            </div>
        </div>
    )
}
