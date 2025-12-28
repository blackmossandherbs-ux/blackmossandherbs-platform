import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
    title: 'Blog - Black Moss & Herbs',
    description: 'Wellness insights, herbal wisdom, and health tips from our experts.',
}

const posts = [
    {
        id: '1',
        title: 'The Complete Guide to Sea Moss Benefits',
        slug: 'complete-guide-sea-moss-benefits',
        excerpt: 'Discover the incredible health benefits of sea moss and how to incorporate it into your daily routine for optimal wellness.',
        category: 'Superfoods',
        publishedAt: new Date('2024-12-20'),
        readTime: 8,
        featured: true,
    },
    {
        id: '2',
        title: '10 Herbs for Natural Immune Support',
        slug: '10-herbs-natural-immune-support',
        excerpt: 'Learn about powerful herbs that can help strengthen your immune system naturally and keep you healthy year-round.',
        category: 'Immune Health',
        publishedAt: new Date('2024-12-18'),
        readTime: 6,
    },
    {
        id: '3',
        title: 'Adaptogens: Nature\'s Stress Solution',
        slug: 'adaptogens-stress-solution',
        excerpt: 'Explore how adaptogenic herbs can help your body manage stress and maintain balance in today\'s fast-paced world.',
        category: 'Wellness',
        publishedAt: new Date('2024-12-15'),
        readTime: 7,
    },
    {
        id: '4',
        title: 'Herbal Tea Blends for Better Sleep',
        slug: 'herbal-tea-blends-better-sleep',
        excerpt: 'Discover calming herbal tea combinations that can help you achieve deeper, more restful sleep naturally.',
        category: 'Sleep & Relaxation',
        publishedAt: new Date('2024-12-12'),
        readTime: 5,
    },
    {
        id: '5',
        title: 'Turmeric: The Golden Spice of Life',
        slug: 'turmeric-golden-spice',
        excerpt: 'Uncover the anti-inflammatory properties of turmeric and creative ways to add it to your diet.',
        category: 'Nutrition',
        publishedAt: new Date('2024-12-10'),
        readTime: 6,
    },
    {
        id: '6',
        title: 'Building Your Home Herbal Apothecary',
        slug: 'building-home-herbal-apothecary',
        excerpt: 'A beginner\'s guide to creating your own collection of essential herbs and natural remedies at home.',
        category: 'DIY Wellness',
        publishedAt: new Date('2024-12-08'),
        readTime: 10,
    },
]

const categories = ['All', 'Superfoods', 'Immune Health', 'Wellness', 'Sleep & Relaxation', 'Nutrition', 'DIY Wellness']

export default function BlogPage() {
    return (
        <div className="py-12">
            <div className="container">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="section-title">Wellness Blog</h1>
                    <p className="section-subtitle">
                        Expert insights, herbal wisdom, and natural health tips
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

                {/* Featured Post */}
                {posts.filter(p => p.featured).map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                        <article className="card mb-12 overflow-hidden group hover:scale-[1.02] transition-transform">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="h-64 lg:h-auto bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
                                    <span className="text-8xl">📚</span>
                                </div>
                                <div className="p-8 lg:p-12 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="badge-primary">Featured</span>
                                        <span className="badge-secondary">{post.category}</span>
                                    </div>
                                    <h2 className="text-3xl lg:text-4xl font-serif font-bold text-earth-900 mb-4 group-hover:text-primary-600 transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-earth-600 text-lg mb-6">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-6 text-sm text-earth-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(post.publishedAt)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            {post.readTime} min read
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.filter(p => !p.featured).map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`}>
                            <article className="card group h-full">
                                <div className="h-48 bg-gradient-to-br from-earth-200 to-earth-300 flex items-center justify-center">
                                    <span className="text-6xl">📖</span>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="badge-secondary text-xs">{post.category}</span>
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-earth-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-earth-600 text-sm mb-4 line-clamp-3">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-earth-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(post.publishedAt)}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {post.readTime} min
                                        </div>
                                    </div>
                                    <div className="text-primary-600 font-medium text-sm inline-flex items-center">
                                        Read More
                                        <ArrowRight className="ml-1 w-4 h-4" />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
