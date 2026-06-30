/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Wisdom Hub
 */
import { Metadata } from 'next'
import { Play, BookOpen, Search, Lock, ArrowRight, Video } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/Button'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SubscriptionService, SubscriptionTier } from '@/services/SubscriptionService'
import { BlogService } from '@/services/BlogService'
import { VideoService } from '@/services/VideoService'

export const metadata: Metadata = {
    title: 'Wisdom Hub | Black Moss & Herbs',
    description: 'Educational articles and videos on herbal wellness, sea moss, and natural living from the Black Moss & Herbs team.',
    alternates: { canonical: 'https://blackmossandherbs.com/wisdom' },
}

export default async function WisdomPage() {
    const session = await getServerSession(authOptions);
    const hasAccess = session?.user?.id
        ? await SubscriptionService.hasTierAccess(session.user.id, SubscriptionTier.ALCHEMIST)
        : false;

    // Pull real content
    const latestBlogs = await BlogService.getAllPosts();
    const latestVideos = await VideoService.getAllVideos();
    const featuredVideo = latestVideos[0];

    return (
        <div className="py-24 bg-stone-950 min-h-screen relative overflow-hidden">
            {/* Background Textures */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] bg-green-900/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-[20%] left-[10%] w-[40vw] h-[40vw] bg-amber-900/10 rounded-full blur-[120px] animate-pulse-slow"></div>
            </div>

            <div className="container relative z-10">
                <div className="max-w-4xl mx-auto mb-24 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2 glass-premium rounded-full mb-8 border border-amber-500/20">
                        <BookOpen className="w-4 h-4 text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">Knowledge Library</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-serif font-bold text-stone-50 mb-8 leading-[0.9] tracking-tighter">
                        Botanical <br />
                        <span className="text-green-500 italic">Wisdom.</span>
                    </h1>
                    <p className="text-xl text-stone-400 max-w-2xl mx-auto leading-relaxed font-light italic">
                        &quot;Respecting the elders, verifying through science. We deal in organic reality.&quot;
                    </p>
                </div>

                <div className={`transition-all duration-1000 ${!hasAccess ? 'blur-2xl pointer-events-none select-none grayscale opacity-30 scale-95' : ''}`}>

                    {/* Featured Visual Authority */}
                    {featuredVideo && (
                        <div className="mb-24">
                            <div className="flex items-center gap-6 mb-12">
                                <h2 className="text-4xl font-serif font-bold text-stone-50 tracking-tighter">Featured Video.</h2>
                                <div className="h-[1px] flex-1 bg-stone-800/50"></div>
                            </div>

                            <div className="group relative rounded-[4rem] overflow-hidden aspect-video glass-premium p-4 border-white/5 shadow-3xl">
                                <div className="h-full w-full rounded-[3rem] overflow-hidden relative">
                                    <img
                                        src={featuredVideo.thumbnail || "/images/sea_moss_gold.webp"}
                                        alt={featuredVideo.title}
                                        className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-105 opacity-40 group-hover:opacity-70"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex flex-col justify-end p-12 md:p-20">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="px-5 py-2 bg-amber-600 text-stone-950 text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl">Transmission_Live</span>
                                            <span className="text-stone-400 text-xs font-mono font-bold tracking-widest">{featuredVideo.duration || 'SECURE'}</span>
                                        </div>
                                        <h3 className="text-5xl md:text-7xl font-serif font-bold text-stone-50 mb-8 leading-[0.9] tracking-tighter max-w-3xl">{featuredVideo.title}</h3>
                                        <button className="flex items-center gap-6 text-amber-500 group-hover:text-white transition-all font-black text-xs uppercase tracking-[0.4em] mt-8 group-hover:translate-x-4">
                                            <div className="w-20 h-20 rounded-full border border-amber-500/30 flex items-center justify-center bg-stone-950/80 backdrop-blur-md group-hover:bg-amber-600 group-hover:text-stone-950 group-hover:border-amber-600 transition-all shadow-2xl">
                                                <Play size={28} fill="currentColor" className="ml-1" />
                                            </div>
                                            Begin Extraction
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Scientific Records (Blogs) */}
                    <div className="space-y-16">
                        <div className="flex items-center gap-6">
                            <h2 className="text-4xl font-serif font-bold text-stone-50 tracking-tighter">Scientific Records.</h2>
                            <div className="h-[1px] flex-1 bg-stone-800/50"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {latestBlogs.map((post) => (
                                <Link key={post.id} href={`/wisdom/blogs/${post.slug}`} className="group">
                                    <article className="glass-premium p-8 rounded-[2.5rem] border-stone-800 group-hover:border-green-500/20 transition-all duration-700 h-full flex flex-col">
                                        <div className="aspect-square rounded-2xl overflow-hidden mb-8 relative">
                                            <img src={post.coverImage || "/images/wisdom-placeholder.jpg"} className="w-full h-full object-cover opacity-40 group-hover:opacity-80 transition-all duration-[2s] group-hover:scale-110" alt={post.title} />
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 bg-green-500/20 backdrop-blur-md border border-green-500/30 text-[10px] font-black text-green-400 uppercase rounded-lg">
                                                    {post.category}
                                                </span>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-serif font-bold text-stone-100 group-hover:text-green-500 transition-colors mb-6 leading-tight">{post.title}</h3>
                                        <div className="mt-auto flex items-center justify-between">
                                            <span className="text-stone-600 text-[10px] font-bold uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</span>
                                            <div className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                                Read Entity <ArrowRight size={12} />
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {!hasAccess && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
                        <div className="max-w-xl w-full glass-premium p-16 md:p-24 rounded-[4rem] text-center border-amber-500/20 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[2s]"></div>
                            <div className="relative z-10">
                                <div className="w-24 h-24 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl">
                                    <Lock className="text-amber-400 w-10 h-10" />
                                </div>
                                <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-50 mb-6 leading-tight">Members-Only Library.</h2>
                                <p className="text-lg text-stone-400 mb-12 italic leading-relaxed font-light">
                                    &quot;Our full library of guides and videos is available to members. Join to unlock everything.&quot;
                                </p>
                                <div className="flex flex-col gap-6">
                                    <Link href="/subscriptions">
                                        <Button size="lg" className="w-full h-20 text-lg font-black uppercase tracking-widest rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950">
                                            View Membership Plans
                                        </Button>
                                    </Link>
                                    <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest">
                                        Already a member? <Link href="/login" className="text-amber-500 hover:text-white transition-colors ml-2 underline underline-offset-4">Sign In</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
