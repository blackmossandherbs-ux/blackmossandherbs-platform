import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Eye, Clock, Play } from 'lucide-react'

interface Props {
    params: { slug: string }
}

function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const video = await prisma.video.findUnique({ where: { slug: params.slug } })
    if (!video) return { title: 'Video Not Found' }
    return {
        title: `${video.title} - Black Moss & Herbs`,
        description: video.description,
        openGraph: { images: video.thumbnail ? [video.thumbnail] : [] }
    }
}

export default async function VideoPage({ params }: Props) {
    const video = await prisma.video.findUnique({
        where: { slug: params.slug, published: true }
    })

    if (!video) notFound()

    // Increment views (fire-and-forget)
    prisma.video.update({
        where: { id: video.id },
        data: { views: { increment: 1 } }
    }).catch(() => {})

    // Related videos
    const related = await prisma.video.findMany({
        where: { published: true, category: video.category, id: { not: video.id } },
        take: 3,
        orderBy: { views: 'desc' }
    })

    return (
        <div className="py-12 bg-earth-950 min-h-screen">
            <div className="container max-w-5xl">
                <Link href="/videos" className="inline-flex items-center gap-2 text-earth-400 hover:text-amber-500 transition-colors mb-8 text-sm font-bold uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> All Videos
                </Link>

                {/* Video Player */}
                <div className="rounded-[2rem] overflow-hidden bg-earth-900 border border-earth-800 mb-8 aspect-video relative group">
                    {video.videoUrl ? (
                        <iframe
                            src={video.videoUrl}
                            className="w-full h-full"
                            allowFullScreen
                            allow="autoplay; fullscreen; picture-in-picture"
                            title={video.title}
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                            {video.thumbnail && (
                                <img src={video.thumbnail} alt={video.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
                            )}
                            <div className="relative z-10 w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center">
                                <Play className="w-12 h-12 text-white ml-1" fill="white" />
                            </div>
                            <p className="relative z-10 text-earth-400 text-sm">Video coming soon</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main info */}
                    <div className="lg:col-span-2">
                        <div className="mb-3">
                            <span className="px-3 py-1 bg-primary-900/40 border border-primary-700/30 text-primary-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                {video.category}
                            </span>
                        </div>
                        <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                            {video.title}
                        </h1>
                        <div className="flex items-center gap-6 text-earth-500 text-sm mb-8">
                            <span className="flex items-center gap-1.5">
                                <Eye className="w-4 h-4" /> {video.views.toLocaleString()} views
                            </span>
                            {video.duration && (
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" /> {formatDuration(video.duration)}
                                </span>
                            )}
                        </div>
                        <div className="card border border-earth-800 bg-earth-900/40 p-8 rounded-2xl">
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-earth-500 mb-4">About This Video</h2>
                            <p className="text-earth-300 leading-relaxed">{video.description}</p>
                        </div>
                    </div>

                    {/* Related */}
                    {related.length > 0 && (
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-earth-500 mb-6">More in {video.category}</h2>
                            <div className="space-y-4">
                                {related.map((v) => (
                                    <Link key={v.id} href={`/videos/${v.slug}`}>
                                        <div className="flex gap-4 p-4 rounded-2xl border border-earth-800 bg-earth-900/40 hover:border-earth-700 transition-colors group">
                                            <div className="w-20 h-14 bg-earth-800 rounded-xl overflow-hidden shrink-0 relative">
                                                {v.thumbnail ? (
                                                    <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Play className="w-5 h-5 text-earth-600" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-white text-sm font-bold line-clamp-2 group-hover:text-secondary-400 transition-colors">{v.title}</p>
                                                {v.duration && <p className="text-earth-600 text-xs mt-1">{formatDuration(v.duration)}</p>}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
