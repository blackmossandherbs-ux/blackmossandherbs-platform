/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Video Wisdom Library
 */
import { Metadata } from 'next'
import Link from 'next/link'
import { Play, Clock, Eye } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Video Hub - Black Moss & Herbs',
    description: 'Educational videos about herbal wellness, product tutorials, and expert interviews.',
}

const videos = [
    {
        id: '1',
        title: 'How to Use Sea Moss Gel Daily',
        slug: 'how-to-use-sea-moss-gel',
        description: 'Learn the best ways to incorporate sea moss gel into your daily routine for maximum benefits.',
        category: 'Tutorials',
        duration: 480, // seconds
        views: 12500,
        featured: true,
    },
    {
        id: '2',
        title: 'The Science Behind Adaptogens',
        slug: 'science-behind-adaptogens',
        description: 'Discover how adaptogenic herbs work in your body to combat stress and promote balance.',
        category: 'Education',
        duration: 720,
        views: 8300,
    },
    {
        id: '3',
        title: 'Making Herbal Tea Blends at Home',
        slug: 'making-herbal-tea-blends',
        description: 'Step-by-step guide to creating your own custom herbal tea blends.',
        category: 'DIY',
        duration: 600,
        views: 5600,
    },
    {
        id: '4',
        title: 'Interview: Herbalist Sarah Johnson',
        slug: 'interview-herbalist-sarah',
        description: 'Expert insights on traditional herbal medicine and modern wellness practices.',
        category: 'Interviews',
        duration: 1800,
        views: 9200,
    },
    {
        id: '5',
        title: 'Turmeric Golden Milk Recipe',
        slug: 'turmeric-golden-milk-recipe',
        description: 'Create this anti-inflammatory drink that supports overall health and wellness.',
        category: 'Recipes',
        duration: 360,
        views: 15000,
    },
    {
        id: '6',
        title: 'Building Your Herbal First Aid Kit',
        slug: 'herbal-first-aid-kit',
        description: 'Essential herbs and remedies every household should have on hand.',
        category: 'Education',
        duration: 900,
        views: 6800,
    },
]

const categories = ['All', 'Tutorials', 'Education', 'DIY', 'Interviews', 'Recipes']

function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

function formatViews(views: number): string {
    if (views >= 1000) {
        return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
}

export default function VideosPage() {
    return (
        <div className="py-12">
            <div className="container">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="section-title">Video Hub</h1>
                    <p className="section-subtitle">
                        Educational content, tutorials, and expert insights on herbal wellness
                    </p>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${category === 'All'
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-earth-700 hover:bg-earth-100 border border-earth-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Featured Video */}
                {videos.filter(v => v.featured).map((video) => (
                    <Link key={video.id} href={`/videos/${video.slug}`}>
                        <div className="card mb-12 overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="relative h-64 lg:h-auto bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-black/20"></div>
                                    <div className="relative z-10 w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Play className="w-10 h-10 text-primary-600 ml-1" />
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded text-sm font-medium">
                                        {formatDuration(video.duration)}
                                    </div>
                                    <div className="absolute top-4 left-4">
                                        <span className="badge bg-red-600 text-white">Featured</span>
                                    </div>
                                </div>
                                <div className="p-8 lg:p-12 flex flex-col justify-center">
                                    <div className="mb-4">
                                        <span className="badge-primary">{video.category}</span>
                                    </div>
                                    <h2 className="text-3xl lg:text-4xl font-serif font-bold text-earth-900 mb-4 group-hover:text-primary-600 transition-colors">
                                        {video.title}
                                    </h2>
                                    <p className="text-earth-600 text-lg mb-6">
                                        {video.description}
                                    </p>
                                    <div className="flex items-center gap-6 text-sm text-earth-500">
                                        <div className="flex items-center gap-2">
                                            <Eye className="w-4 h-4" />
                                            {formatViews(video.views)} views
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {formatDuration(video.duration)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}

                {/* Video Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {videos.filter(v => !v.featured).map((video) => (
                        <Link key={video.id} href={`/videos/${video.slug}`}>
                            <div className="card group overflow-hidden">
                                <div className="relative h-48 bg-gradient-to-br from-earth-600 to-earth-700 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-black/10"></div>
                                    <div className="relative z-10 w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Play className="w-8 h-8 text-primary-600 ml-1" />
                                    </div>
                                    <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                                        {formatDuration(video.duration)}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="mb-3">
                                        <span className="badge-secondary text-xs">{video.category}</span>
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-earth-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                                        {video.title}
                                    </h3>
                                    <p className="text-earth-600 text-sm mb-4 line-clamp-2">
                                        {video.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-earth-500">
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            {formatViews(video.views)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
