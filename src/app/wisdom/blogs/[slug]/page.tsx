import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Props {
    params: { slug: string }
}

const PERSONA_LABELS: Record<string, { name: string; role: string }> = {
    MARCUS_ADEYEMI: { name: 'Marcus Adeyemi', role: 'The Alchemist' },
    DR_AMARA_WILLIAMS: { name: 'Dr. Amara Williams', role: 'Clinical Herbalist' },
    SISTER_IFE_OKONKWO: { name: 'Sister Ife Okonkwo', role: 'Ancestral Herbalist' },
    DANIEL_CROSS: { name: 'Daniel Cross', role: 'Wellness Coach' },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await prisma.blogPost.findUnique({ where: { slug: params.slug } })
    if (!post) return { title: 'Article Not Found' }
    return {
        title: `${post.title} - Black Moss & Herbs`,
        description: post.excerpt,
        openGraph: { images: post.coverImage ? [post.coverImage] : [] }
    }
}

export default async function WisdomBlogPostPage({ params }: Props) {
    const post = await prisma.blogPost.findUnique({
        where: { slug: params.slug, published: true }
    })

    if (!post) notFound()

    const persona = post.authorPersona ? PERSONA_LABELS[post.authorPersona] : null

    // Related articles
    const related = await prisma.blogPost.findMany({
        where: { published: true, category: post.category, id: { not: post.id } },
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: { title: true, slug: true, excerpt: true, category: true, createdAt: true }
    })

    return (
        <div className="min-h-screen bg-stone-950 pb-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[10%] right-[5%] w-[30vw] h-[30vw] bg-green-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[40vw] h-[40vw] bg-amber-900/10 rounded-full blur-[150px]" />
            </div>

            {/* Hero */}
            <div className="relative h-[60vh] overflow-hidden">
                {post.coverImage ? (
                    <>
                        <Image src={post.coverImage} alt={post.title} fill sizes="100vw" priority className="object-cover opacity-30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/20" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-stone-950 to-amber-950" />
                )}

                <div className="container relative h-full flex flex-col justify-end pb-16 z-10">
                    <Link href="/wisdom" className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-500 transition-colors mb-8 text-xs font-black uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> Wisdom Library
                    </Link>

                    <div className="max-w-4xl">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="px-4 py-1.5 bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                                {post.category}
                            </span>
                            {persona && (
                                <span className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                                    {persona.role}
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-stone-50 mb-6 leading-tight tracking-tighter">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-stone-400 text-sm">
                            {persona && (
                                <span className="font-bold text-stone-300">{persona.name}</span>
                            )}
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(post.publishedAt || post.createdAt)}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" /> 5 min read
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container relative z-10 max-w-4xl -mt-8">
                <div className="glass-premium border border-stone-800 rounded-[3rem] p-10 md:p-16 mb-16">
                    {post.excerpt && (
                        <p className="text-xl font-serif text-amber-400/80 italic border-l-4 border-amber-500/30 pl-8 mb-12 leading-relaxed">
                            &ldquo;{post.excerpt}&rdquo;
                        </p>
                    )}
                    <div className="prose prose-invert prose-lg prose-stone max-w-none
                        prose-headings:font-serif prose-headings:text-stone-100
                        prose-p:text-stone-300 prose-p:leading-relaxed
                        prose-strong:text-stone-100
                        prose-a:text-green-400 prose-a:no-underline hover:prose-a:text-green-300
                        prose-blockquote:border-amber-500/30 prose-blockquote:text-amber-400/70 prose-blockquote:italic
                        prose-li:text-stone-300">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>

                    <div className="mt-16 pt-10 border-t border-stone-800 flex items-center justify-between">
                        {persona ? (
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-green-900/40 to-amber-900/40 border border-stone-700 rounded-full flex items-center justify-center text-2xl">🌿</div>
                                <div>
                                    <div className="font-bold text-stone-100">{persona.name}</div>
                                    <div className="text-xs text-amber-500 font-black uppercase tracking-widest">{persona.role}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-stone-800 rounded-full flex items-center justify-center text-xl">🌿</div>
                                <div>
                                    <div className="font-bold text-stone-100">Black Moss & Herbs</div>
                                    <div className="text-xs text-stone-500 uppercase tracking-widest">Editorial Council</div>
                                </div>
                            </div>
                        )}
                        <button className="flex items-center gap-2 text-stone-500 hover:text-amber-400 transition-colors text-sm font-bold">
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                    </div>
                </div>

                {/* Related Articles */}
                {related.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-stone-100 mb-8">More from the Library</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {related.map((r) => (
                                <Link key={r.slug} href={`/wisdom/blogs/${r.slug}`} className="group">
                                    <div className="glass-premium p-8 rounded-[2rem] border-stone-800 group-hover:border-green-500/20 transition-all h-full">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-green-400">{r.category}</span>
                                        <h3 className="font-serif text-lg font-bold text-stone-100 mt-3 mb-4 leading-snug group-hover:text-green-400 transition-colors line-clamp-2">
                                            {r.title}
                                        </h3>
                                        <p className="text-stone-500 text-sm line-clamp-2 leading-relaxed">{r.excerpt}</p>
                                        <div className="mt-6 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                                            Read →
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
