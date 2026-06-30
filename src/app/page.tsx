/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Home Page
 */
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Leaf, Heart, Shield, Star, ShoppingCart, Play, CheckCircle2 } from 'lucide-react'
import Button from '@/components/Button'
import { ProductService } from '@/services/ProductService'
import { BlogService } from '@/services/BlogService'
import ProductCard from '@/components/ProductCard'
import NewsletterForm from '@/components/NewsletterForm'
import { SettingsService } from '@/lib/settings'

export const metadata: Metadata = {
    title: 'Black Moss & Herbs | Premium Wildcrafted Sea Moss UK',
    description: 'Premium wildcrafted sea moss, herbal blends and wellness subscriptions, delivered across the UK. Food supplements to complement a balanced lifestyle.',
    alternates: { canonical: 'https://blackmossandherbs.com' },
    openGraph: {
        title: 'Black Moss & Herbs | Premium Wildcrafted Sea Moss UK',
        description: 'Premium wildcrafted sea moss and herbal blends, delivered across the UK.',
        url: 'https://blackmossandherbs.com',
        images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Black Moss & Herbs' }],
    },
}

// Renders at request time: the homepage reads featured products and posts from
// the database, which is not available during a static build.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
    const featuredProducts = await ProductService.getFeaturedProducts(4);
    const latestBlogs = await BlogService.getLatestPosts(3);
    const settings = await SettingsService.get();

    return (
        <div className="bg-earth-950 overflow-x-hidden">
            {settings.announcementEnabled && settings.announcementText && (
                <div className="bg-secondary-600 text-stone-950 text-center text-xs font-black uppercase tracking-widest py-3 px-4">
                    {settings.announcementText}
                </div>
            )}
            {/* Premium Hero Section */}
            <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[10%] right-[-5%] w-[40vw] h-[40vw] bg-primary-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-secondary-500/10 rounded-full blur-[150px] animate-pulse-slow"></div>
                </div>

                <div className="container relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                            <div className="inline-flex items-center gap-2 px-5 py-2 glass-premium rounded-full mb-10 border border-primary-500/20 shadow-lg">
                                <Leaf className="w-4 h-4 text-primary-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-300">{settings.heroBadge}</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-serif font-bold text-white mb-8 leading-[0.9] tracking-tighter">
                                {settings.heroTitleLine1}<br />
                                <span className="text-secondary-400 italic">{settings.heroTitleAccent}</span>
                            </h1>
                            <p className="text-xl text-stone-400 mb-12 max-w-lg leading-relaxed font-light italic">
                                &quot;{settings.heroQuote}&quot;
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <Link href="/shop">
                                    <button className="h-20 px-10 text-lg font-black uppercase tracking-widest bg-primary-600 hover:bg-primary-500 text-white rounded-2xl transition-all shadow-2xl shadow-primary-900/40 group flex items-center justify-center">
                                        {settings.heroPrimaryCta}
                                        <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </Link>
                                <Link href="/consultations">
                                    <button className="h-20 px-10 text-lg font-black uppercase tracking-widest border border-earth-700 hover:border-earth-500 text-white rounded-2xl transition-all hover:bg-white/5">
                                        {settings.heroSecondaryCta}
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="relative group animate-in fade-in slide-in-from-right-8 duration-1000">
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden glass-premium p-3 border border-white/10 shadow-3xl">
                                <div className="h-full w-full rounded-[2rem] overflow-hidden relative">
                                    <img
                                        src="/images/sea_moss_gold.webp"
                                        alt="Wildcrafted gold sea moss gel"
                                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-earth-950 via-earth-950/20 to-transparent"></div>
                                    <div className="absolute bottom-10 left-10">
                                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-400 mb-2">Wildcrafted Source</div>
                                        <h3 className="text-4xl font-serif font-bold text-white">Gold Sea Moss.</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Biological Restoration Path Section */}
            <section className="py-32 relative overflow-hidden bg-stone-50">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-earth-950 hidden lg:block"></div>
                <div className="container relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch overflow-hidden rounded-[4rem] shadow-2xl border border-earth-800/10">
                        <div className="bg-white p-12 md:p-24 flex flex-col justify-center">
                            <h2 className="text-5xl md:text-6xl font-serif font-bold text-earth-950 mb-10 tracking-tighter leading-[0.9]">
                                The Black Moss <br />
                                <span className="text-primary-700 italic">Difference.</span>
                            </h2>
                            <p className="text-xl text-stone-600 mb-12 leading-relaxed font-light italic">
                                We believe in nature done properly — wildcrafted sourcing, honest labelling, and quality you can trust as part of a balanced lifestyle.
                            </p>
                            <ul className="space-y-8">
                                {[
                                    { title: 'Wildcrafted Integrity', desc: 'No farm-raised moss. Only wild, ocean-grown sources.' },
                                    { title: 'Naturally Mineral-Rich', desc: 'Our sea moss naturally contains 92 trace minerals.' },
                                    { title: 'Lab-Verified Quality', desc: 'Every batch checked for purity before it reaches you.' }
                                ].map((step, idx) => (
                                    <li key={idx} className="flex gap-6 group">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0 text-primary-700 font-bold text-sm italic group-hover:bg-primary-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                                            0{idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-earth-950 uppercase tracking-tight text-lg mb-2">{step.title}</h4>
                                            <p className="text-stone-500 text-base leading-relaxed">{step.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-earth-950 p-12 md:p-24 relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-40 group-hover:scale-110 transition-transform duration-[4s]">
                                <img
                                    src="/images/sea_moss_purple.webp"
                                    className="w-full h-full object-cover grayscale"
                                    alt=""
                                />
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-center">
                                <div className="mb-12 w-24 h-[2px] bg-secondary-500"></div>
                                <h3 className="text-5xl font-serif font-bold text-white mb-8 leading-tight">Rooted in Nature. <br /><span className="text-secondary-400">Backed by Science.</span></h3>
                                <p className="text-xl text-stone-400 mb-12 italic font-light leading-relaxed">&quot;Give the body the right natural foods, and you give it the best foundation to thrive.&quot;</p>
                                <Link href="/wisdom">
                                    <button className="h-16 px-10 bg-secondary-600 hover:bg-secondary-500 text-stone-950 font-black uppercase tracking-widest text-sm rounded-xl transition-all flex items-center justify-center group w-full sm:w-auto">
                                        Enter the Wisdom Archive
                                        <Star className="ml-3 w-4 h-4 group-hover:rotate-90 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="py-32">
                <div className="container">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary-500 mb-4">Bestsellers</div>
                            <h2 className="text-6xl font-serif font-bold text-white tracking-tighter">{settings.featuredHeading} <span className="text-secondary-400 italic">{settings.featuredAccent}</span></h2>
                        </div>
                        <Link href="/shop">
                            <button className="h-14 px-8 border border-earth-700 hover:border-earth-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all group flex items-center justify-center">
                                Explore Catalog
                                <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {featuredProducts.length > 0 ? featuredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                name={product.name}
                                slug={product.slug}
                                price={product.price}
                                compareAtPrice={product.compareAtPrice ?? undefined}
                                images={product.images}
                                category={product.category}
                            />
                        )) : (
                            <div className="col-span-full py-20 text-center text-earth-600 font-bold uppercase text-sm tracking-[0.2em] animate-pulse">
                                Identifying Alchemical Entities...
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Wisdom Archive (Latest Blogs) */}
            <section className="py-32 bg-earth-900/40 border-y border-earth-800 backdrop-blur-3xl">
                <div className="container">
                    <div className="flex justify-between items-end mb-24">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-400 mb-4">Intellectual Property</div>
                            <h2 className="text-6xl font-serif font-bold text-white tracking-tighter">Wisdom <span className="text-primary-400 italic">Archive.</span></h2>
                        </div>
                        <Link href="/wisdom">
                            <button className="h-14 px-8 bg-earth-800 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-earth-700 transition-all">
                                View Full Repository
                            </button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {latestBlogs.length > 0 ? latestBlogs.map((post) => (
                            <Link key={post.id} href={`/wisdom/blogs/${post.slug}`} className="group block">
                                <article className="premium-card h-full bg-earth-950/50 border-earth-800 group-hover:border-primary-500/30 transition-all duration-700 overflow-hidden relative">
                                    <div className="aspect-video overflow-hidden">
                                        <img
                                            src={post.coverImage || "/images/wisdom-placeholder.jpg"}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] opacity-70 group-hover:opacity-100"
                                        />
                                    </div>
                                    <div className="p-10">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary-400">{post.category}</span>
                                            <div className="w-1 h-1 bg-earth-800 rounded-full"></div>
                                            <span className="text-earth-500 text-[10px] font-bold uppercase tracking-widest">{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="text-2xl font-serif font-bold text-white mb-6 leading-tight group-hover:text-primary-400 transition-colors">
                                            {post.title}
                                        </h3>
                                        <div className="flex items-center gap-3 text-stone-500 font-black text-[10px] uppercase tracking-widest group-hover:text-white transition-colors">
                                            Extract Knowledge <ArrowRight size={12} className="group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        )) : (
                            <div className="col-span-full py-20 text-center text-earth-600 font-bold uppercase text-xs tracking-[0.2em]">
                                Synchronizing Wisdom Streams...
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-900/10 pointer-events-none" />
                <div className="container relative z-10">
                    <div className="max-w-4xl mx-auto glass-premium p-16 md:p-24 rounded-[4rem] text-center border-white/5 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[3s]" />
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 tracking-tighter">
                            {settings.newsletterHeading}
                        </h2>
                        <p className="text-lg text-stone-400 mb-12 max-w-xl mx-auto italic font-light leading-relaxed">
                            {settings.newsletterSubtext}
                        </p>
                        <div className="max-w-lg mx-auto relative z-10">
                            <NewsletterForm
                                placeholder="Your email address"
                                buttonLabel="Subscribe"
                                formClassName="flex flex-col sm:flex-row gap-4"
                                inputClassName="flex-1 h-16 px-8 rounded-2xl bg-earth-950/80 border border-earth-800 text-white placeholder-earth-600 focus:outline-none focus:border-primary-500 transition-all font-medium"
                                buttonClassName="h-16 px-10 bg-primary-600 hover:bg-primary-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-primary-900/20 disabled:opacity-60 inline-flex items-center justify-center"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
