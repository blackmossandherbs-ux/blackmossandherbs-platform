
import { Metadata } from 'next'
import { Play, BookOpen, Image as ImageIcon, Search, ExternalLink, Lock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { SubscriptionService, SubscriptionTier } from '@/services/SubscriptionService'

export const metadata: Metadata = {
    title: 'The Alchemist\'s Wisdom - Black Moss & Herbs',
    description: 'Scientific and Organic Knowledge. The home of alkaline facts.',
}

export default async function WisdomPage() {
    const session = await getServerSession(authOptions);
    const hasAccess = session?.user?.id
        ? await SubscriptionService.hasTierAccess(session.user.id, SubscriptionTier.ALCHEMIST)
        : false;

    return (
        <div className="py-24 bg-stone-950 min-h-screen relative overflow-hidden">
            {/* Background Textures */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] bg-green-900/10 rounded-full blur-[100px] animate-pulse-slow"></div>
                <div className="absolute bottom-[20%] left-[10%] w-[40vw] h-[40vw] bg-amber-900/10 rounded-full blur-[120px] animate-pulse-slow"></div>
            </div>

            <div className="container relative z-10">
                <div className="max-w-4xl mx-auto mb-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 organic-glass rounded-full mb-8 border-amber-500/20">
                        <BookOpen className="w-4 h-4 text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">The Alchemist&apos;s Reserve</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-serif font-bold text-stone-50 mb-8 leading-[0.9] tracking-tighter">
                        Botanical <br />
                        <span className="text-green-500 italic">Wisdom.</span>
                    </h1>
                    <p className="text-xl text-stone-400 max-w-2xl mx-auto leading-relaxed font-light italic">
                        &quot;Respecting the elders, verifying through science. We deal in organic reality.&quot;
                    </p>
                </div>

                <div className={`transition-all duration-1000 ${!hasAccess ? 'blur-2xl pointer-events-none select-none grayscale opacity-30 scale-95' : ''}`}>
                    {/* Wisdom categories */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                        {[
                            {
                                title: 'Scientific Facts',
                                description: 'Biological breakdowns of alkaline restoration.',
                                icon: BookOpen,
                                count: '42 Protocols',
                                accent: 'border-green-500/20'
                            },
                            {
                                title: 'Visual Authority',
                                description: 'Masterclass documentation of our traditions.',
                                icon: Play,
                                count: '15 Masterclasses',
                                accent: 'border-amber-500/20'
                            },
                            {
                                title: 'Botanical Record',
                                description: 'Evidence-based gallery of wildcrafting.',
                                icon: ImageIcon,
                                count: '120 Proofs',
                                accent: 'border-stone-800'
                            }
                        ].map((item, idx) => (
                            <div key={idx} className={`organic-glass p-10 rounded-3xl group border-stone-800/10 hover:border-green-500/30 transition-all duration-700 cursor-pointer`}>
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-green-600 transition-all duration-700">
                                    <item.icon className="w-8 h-8 text-amber-500 group-hover:text-stone-950 transition-colors" />
                                </div>
                                <h3 className="text-3xl font-serif font-bold text-stone-50 mb-4 group-hover:text-amber-500 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-stone-400 font-light leading-relaxed mb-10">{item.description}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">{item.count}</span>
                                    <span className="text-stone-500 group-hover:text-stone-100 transition-colors text-xs font-bold uppercase tracking-widest">Verify →</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Featured Insights */}
                    <div className="space-y-16">
                        <div className="flex items-center gap-6 mb-12">
                            <h2 className="text-4xl font-serif font-bold text-stone-50 tracking-tighter">Latest Realities.</h2>
                            <div className="h-[1px] flex-1 bg-stone-800/50"></div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Video Power Feature */}
                            <div className="group relative rounded-[3rem] overflow-hidden aspect-square lg:aspect-video organic-glass p-4 border-white/5 shadow-2xl">
                                <div className="h-full w-full rounded-[2rem] overflow-hidden relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80"
                                        alt="Herbal processing"
                                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105 opacity-40 group-hover:opacity-60"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex flex-col justify-end p-12">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="px-3 py-1 bg-amber-600 text-stone-950 text-[10px] font-black uppercase tracking-widest rounded-full">Primary Insight</span>
                                            <span className="text-stone-400 text-xs font-bold tracking-widest">12:45 MINS</span>
                                        </div>
                                        <h3 className="text-4xl md:text-5xl font-serif font-bold text-stone-50 mb-4 leading-[0.9]">The Biological <br />Reality of Sea Moss.</h3>
                                        <button className="flex items-center gap-4 text-amber-500 group-hover:text-white transition-all font-black text-xs uppercase tracking-[0.3em] mt-8 group-hover:translate-x-4">
                                            <div className="w-12 h-12 rounded-full border border-amber-500/30 flex items-center justify-center bg-stone-950/80 backdrop-blur-md group-hover:bg-amber-600 group-hover:text-stone-950 group-hover:border-amber-600 transition-all">
                                                <Play size={20} fill="currentColor" className="ml-1" />
                                            </div>
                                            Access Transmission
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Article Grid */}
                            <div className="space-y-6">
                                {[
                                    { title: 'Iron Force: Why Salts aren\'t Iron', date: 'Jan 04, 2026', type: 'Biological' },
                                    { title: 'Batana Oil: Cellular Follicle Repair', date: 'Jan 02, 2026', type: 'Botanical' },
                                    { title: 'The Acidic Myth vs Cellular Reality', date: 'Dec 28, 2025', type: 'Scientific' }
                                ].map((article, idx) => (
                                    <div key={idx} className="organic-glass p-8 rounded-3xl group cursor-pointer border-transparent hover:border-amber-500/20 transition-all duration-700 flex gap-8 items-center">
                                        <div className="w-24 h-24 bg-stone-950 rounded-2xl flex-shrink-0 overflow-hidden border border-stone-800 transition-all duration-700 group-hover:border-amber-500/30 group-hover:scale-95 shadow-lg">
                                            <img src={`https://images.unsplash.com/photo-1544367567-0f2fcb00${idx}?auto=format&fit=crop&q=80`} className="w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity" alt="Article thumbnail" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-3">
                                                <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">{article.type}</span>
                                                <div className="w-1 h-1 bg-stone-800 rounded-full"></div>
                                                <span className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">{article.date}</span>
                                            </div>
                                            <h4 className="text-2xl font-serif font-bold text-stone-100 group-hover:text-amber-500 transition-colors mb-2 leading-tight">{article.title}</h4>
                                            <div className="flex items-center gap-2 text-stone-600 text-[10px] font-black uppercase tracking-widest group-hover:text-stone-300 transition-colors">
                                                Read Fact Sheet <ArrowRight size={10} className="ml-1 group-hover:translate-x-2 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {!hasAccess && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 px-4">
                        <div className="max-w-xl w-full organic-glass p-16 md:p-24 rounded-[4rem] text-center border-amber-500/20 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[2s]"></div>
                            <div className="relative z-10">
                                <div className="w-24 h-24 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl">
                                    <Lock className="text-amber-400 w-10 h-10" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-50 mb-6 leading-tight">Wisdom is Earned.</h1>
                                <p className="text-lg text-stone-400 mb-12 italic leading-relaxed font-light">
                                    &quot;Access to biological truth is reserved for the committed. Join the Alchemist Circle to unlock the full library.&quot;
                                </p>
                                <div className="flex flex-col gap-6">
                                    <Link href="/subscriptions">
                                        <Button size="lg" className="w-full h-20 text-lg rounded-2xl shadow-none">
                                            Become an Alchemist
                                        </Button>
                                    </Link>
                                    <p className="text-stone-500 text-[10px] font-black uppercase tracking-widest">
                                        Existing Authority? <Link href="/login" className="text-amber-500 hover:text-white transition-colors ml-2 underline underline-offset-4">Identify Self</Link>
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
