import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Leaf, Heart, Shield, Star } from 'lucide-react'
import Button from '@/components/Button'

export default function HomePage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-50 via-earth-50 to-secondary-50 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/patterns/leaves.svg')] opacity-5"></div>
                <div className="container relative py-20 md:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="animate-fade-in">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-earth-900 mb-6 leading-tight">
                                Natural Wellness,{' '}
                                <span className="text-primary-600">Rooted in Tradition</span>
                            </h1>
                            <p className="text-xl text-earth-600 mb-8 leading-relaxed">
                                Discover the power of nature with our premium herbal products, expert consultations, and comprehensive wellness resources.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/shop">
                                    <Button size="lg" className="w-full sm:w-auto">
                                        Shop Products
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link href="/consultations">
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                        Book Consultation
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="relative h-[400px] lg:h-[600px] animate-slide-up">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-3xl transform rotate-3"></div>
                            <div className="absolute inset-0 bg-earth-800 rounded-3xl overflow-hidden">
                                <div className="w-full h-full bg-gradient-to-br from-primary-600/20 to-secondary-600/20 flex items-center justify-center">
                                    <Leaf className="w-32 h-32 text-white/30" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="text-center mb-16">
                        <h2 className="section-title">Why Choose Black Moss & Herbs</h2>
                        <p className="section-subtitle mx-auto">
                            We're committed to providing the highest quality herbal wellness solutions
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Leaf,
                                title: 'Premium Quality',
                                description: 'Sourced from trusted suppliers and rigorously tested for purity',
                            },
                            {
                                icon: Heart,
                                title: 'Holistic Approach',
                                description: 'Comprehensive wellness solutions for mind, body, and spirit',
                            },
                            {
                                icon: Shield,
                                title: 'Safe & Natural',
                                description: 'No harmful chemicals, only nature\'s finest ingredients',
                            },
                            {
                                icon: Star,
                                title: 'Expert Guidance',
                                description: 'Professional consultations from certified herbalists',
                            },
                        ].map((feature, index) => (
                            <div key={index} className="card p-8 text-center group hover:scale-105">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-600 transition-colors">
                                    <feature.icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-serif font-bold text-earth-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-earth-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-earth-50">
                <div className="container">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="section-title">Featured Products</h2>
                            <p className="section-subtitle">
                                Handpicked selections for your wellness journey
                            </p>
                        </div>
                        <Link href="/shop">
                            <Button variant="outline">
                                View All
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="card group">
                                <div className="relative h-64 bg-gradient-to-br from-primary-100 to-secondary-100 overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Leaf className="w-24 h-24 text-primary-300" />
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <span className="badge-primary">Featured</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-serif text-xl font-bold text-earth-900 mb-2">
                                        Premium Herbal Blend {item}
                                    </h3>
                                    <p className="text-earth-600 text-sm mb-4">
                                        Natural wellness support for daily vitality
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-primary-600">$29.99</span>
                                        <Button size="sm">Add to Cart</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Subscription CTA */}
            <section className="py-20 bg-gradient-primary text-white">
                <div className="container">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                            Subscribe & Save 20%
                        </h2>
                        <p className="text-xl mb-8 text-primary-100">
                            Get your favorite herbal products delivered monthly and enjoy exclusive member benefits
                        </p>
                        <Link href="/subscriptions">
                            <Button variant="outline" size="lg" className="bg-white text-primary-600 hover:bg-primary-50 border-white">
                                View Subscription Plans
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Latest Blog Posts */}
            <section className="py-20 bg-white">
                <div className="container">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="section-title">Wellness Insights</h2>
                            <p className="section-subtitle">
                                Expert tips and herbal wisdom from our blog
                            </p>
                        </div>
                        <Link href="/blog">
                            <Button variant="outline">
                                Read More
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item) => (
                            <article key={item} className="card group">
                                <div className="relative h-48 bg-gradient-to-br from-earth-200 to-earth-300 overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Heart className="w-16 h-16 text-earth-400" />
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="badge-secondary">Wellness</span>
                                        <span className="text-sm text-earth-500">Dec 28, 2024</span>
                                    </div>
                                    <h3 className="font-serif text-xl font-bold text-earth-900 mb-2 group-hover:text-primary-600 transition-colors">
                                        The Benefits of Herbal Wellness
                                    </h3>
                                    <p className="text-earth-600 text-sm mb-4">
                                        Discover how incorporating herbal remedies into your daily routine can transform your health...
                                    </p>
                                    <Link href={`/blog/post-${item}`} className="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center">
                                        Read More
                                        <ArrowRight className="ml-1 w-4 h-4" />
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 bg-earth-900 text-white">
                <div className="container">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-4xl font-serif font-bold mb-4">
                            Join Our Wellness Community
                        </h2>
                        <p className="text-earth-300 mb-8">
                            Get exclusive tips, special offers, and herbal wisdom delivered to your inbox
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-3 rounded-lg bg-earth-800 border border-earth-700 text-white placeholder-earth-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <Button type="submit" size="lg">
                                Subscribe
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}
