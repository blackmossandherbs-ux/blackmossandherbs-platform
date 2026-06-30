/**
 * Black Moss & Herbs Platform - Video Wisdom Library
 */
import { Metadata } from 'next'
import Link from 'next/link'
import { Play, Clock, Eye, Film } from 'lucide-react'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Video Library | Black Moss & Herbs',
    description: 'Educational videos on herbal wellness, sea moss benefits, product tutorials, and expert interviews from the Black Moss & Herbs team.',
    alternates: { canonical: 'https://blackmossandherbs.com/videos' },
}

function formatDuration(seconds: number | null): string {
    if (!seconds) return ''
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
}

function formatViews(views: number): string {
    return views >= 1000 ? `${(views / 1000).toFixed(1)}K` : views.toString()
}

export default async function VideosPage() {
    const videos = await prisma.video.findMany({
        where: { published: true },
        orderBy: [{ views: 'desc' }, { createdAt: 'desc' }],
    })

    const featured = videos[0] || null
    const rest = videos.slice(1)

    return (
        <div className="py-24 bg-earth-950 min-h-screen">
            <div className="container pt-12">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mb-4 block">Education</span>
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4 tracking-tighter">Video Library</h1>
                    <p className="text-earth-400 text-lg max-w-xl mx-auto">
                        Tutorials, expert insights, and practical guides on herbal wellness and our products.
                    </p>
                </div>

                {videos.length === 0 ? (
                    <div className="text-center py-24">
                        <Film className="w-16 h-16 text-earth-700 mx-auto mb-6" />
                        <h2 className="text-2xl font-serif font-bold text-white mb-3">Videos coming soon</h2>
                        <p className="text-earth-500 mb-8">We&apos;re producing educational content on herbal wellness. Check back shortly.</p>
                        <Link href="/shop" className="inline-block px-8 py-4 bg-secondary-500 hover:bg-secondary-400 text-stone-950 font-bold rounded-xl transition-colors">
                            Shop Products
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Featured Video */}
                        {featured && (
                            <Link href={`/videos/${featured.slug}`} className="block mb-16 group">
                                <div className="premium-card overflow-hidden">
                                    <div className="grid grid-cols-1 lg:grid-cols-2">
                                        <div className="relative aspect-video lg:aspect-auto bg-gradient-to-br from-primary-900 to-earth-900 flex items-center justify-center min-h-64">
                                            {featured.thumbnail ? (
                                                <img src={featured.thumbnail} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" />
                                            ) : null}
                                            <div className="absolute inset-0 bg-black/30" />
                                            <div className="relative z-10 w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                <Play className="w-10 h-10 text-primary-700 ml-1" />
                                            </div>
                                            {featured.duration && (
                                                <span className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded text-sm font-medium">
                                                    {formatDuration(featured.duration)}
                                                </span>
                                            )}
                                            <span className="absolute top-4 left-4 px-4 py-1.5 bg-secondary-500 text-stone-950 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                Featured
                                            </span>
                                        </div>
                                        <div className="p-10 lg:p-14 flex flex-col justify-center">
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mb-4 block">{featured.category}</span>
                                            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4 group-hover:text-secondary-400 transition-colors leading-tight">
                                                {featured.title}
                                            </h2>
                                            <p className="text-earth-400 text-base mb-8 leading-relaxed line-clamp-3">
                                                {featured.description}
                                            </p>
                                            <div className="flex items-center gap-6 text-sm text-earth-500">
                                                <div className="flex items-center gap-2">
                                                    <Eye className="w-4 h-4" />
                                                    {formatViews(featured.views)} views
                                                </div>
                                                {featured.duration && (
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        {formatDuration(featured.duration)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Video Grid */}
                        {rest.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {rest.map((video) => (
                                    <Link key={video.id} href={`/videos/${video.slug}`} className="group">
                                        <div className="premium-card overflow-hidden h-full flex flex-col">
                                            <div className="relative aspect-video bg-gradient-to-br from-earth-900 to-earth-800 flex items-center justify-center">
                                                {video.thumbnail ? (
                                                    <img src={video.thumbnail} alt={video.title} className="absolute inset-0 w-full h-full object-cover" />
                                                ) : null}
                                                <div className="absolute inset-0 bg-black/20" />
                                                <div className="relative z-10 w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                                    <Play className="w-7 h-7 text-primary-700 ml-0.5" />
                                                </div>
                                                {video.duration && (
                                                    <span className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-0.5 rounded text-xs font-medium">
                                                        {formatDuration(video.duration)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="p-6 flex flex-col flex-1">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mb-3 block">{video.category}</span>
                                                <h3 className="font-serif text-lg font-bold text-white mb-3 group-hover:text-secondary-400 transition-colors line-clamp-2 flex-1">
                                                    {video.title}
                                                </h3>
                                                <p className="text-earth-500 text-sm mb-4 line-clamp-2">{video.description}</p>
                                                <div className="flex items-center gap-4 text-xs text-earth-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <Eye className="w-3.5 h-3.5" />
                                                        {formatViews(video.views)} views
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
