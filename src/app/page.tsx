/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Home Page
 */
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Leaf, Heart, Shield, Star } from 'lucide-react'
import Button from '@/components/Button'

export default function HomePage() {
    return (
        <>
            <>
                {/* Hero Section */}
                <section className="relative min-h-[90vh] flex items-center pt-24 bg-stone-950">
                    <div className="container">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div className="max-w-xl">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/20 rounded-full mb-8 border border-green-500/30">
                                    <Leaf className="w-4 h-4 text-green-500" />
                                    <span className="text-xs text-green-400">Natural Wellness</span>
                                </div>
                                <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
                                    Natural Sea Moss <br />
                                    <span className="text-amber-500">& Herbal Wellness</span>
                                </h1>
                                <p className="text-lg text-stone-300 mb-8">
                                    Wildcrafted sea moss and traditional herbs sourced directly from nature. Experience the benefits of Dr. Sebi-inspired alkaline nutrition.
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
                                            Get Guidance
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="relative aspect-square rounded-2xl overflow-hidden border border-stone-800">
                                    <img
                                        src="/images/sea_moss_gold.webp"
                                        alt="Sea Moss Gold Gel"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <h3 className="text-2xl font-serif font-bold text-white mb-1">Sea Moss Gold Gel</h3>
                                        <p className="text-stone-300 text-sm">Wildcrafted from the Caribbean</p>
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
                                <div key={index} className="bg-white border border-stone-200 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <feature.icon className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-stone-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Products */}
                <section className="py-20 bg-stone-50">
                    <div className="container">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-4xl font-serif font-bold text-stone-900 mb-2">Featured Products</h2>
                                <p className="text-lg text-stone-600">Handpicked selections for your wellness journey</p>
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
                                <div key={item} className="bg-white border border-stone-200 rounded-lg overflow-hidden hover:border-green-500 transition-colors">
                                    <div className="relative h-64 bg-stone-900 overflow-hidden">
                                        <img
                                            src={`https://images.unsplash.com/photo-${[
                                                '1512106374988-c95f566d339c',
                                                '1612810806563-4cb1a2e71c1b',
                                                '1544367567-0f2fcb009e0b',
                                                '1505575967455-40e256f7377c'
                                            ][item - 1]}?auto=format&fit=crop&q=80`}
                                            alt={`Product ${item}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">
                                            Herbal Blend {item}
                                        </h3>
                                        <p className="text-stone-600 text-sm mb-4">
                                            Natural wellness support for daily vitality
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold text-green-600">$29.99</span>
                                            <Button size="sm">Add to Cart</Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Subscription CTA */}
                <section className="py-20 bg-green-600 text-white">
                    <div className="container">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                                Subscribe & Save 20%
                            </h2>
                            <p className="text-xl mb-8 text-green-50">
                                Get your favorite herbal products delivered monthly and enjoy exclusive member benefits
                            </p>
                            <Link href="/subscriptions">
                                <Button variant="outline" size="lg" className="bg-white text-green-600 hover:bg-green-50 border-white">
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
                                    <div className="relative h-48 bg-earth-900 overflow-hidden">
                                        <img
                                            src={`https://images.unsplash.com/photo-${[
                                                '1540491731775-681283db5630',
                                                '1512428559083-560dfc18b20e',
                                                '1512428559083-560dfc282209'
                                            ][item - 1]}?auto=format&fit=crop&q=80`}
                                            alt="Herbal Knowledge"
                                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                                        />
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
