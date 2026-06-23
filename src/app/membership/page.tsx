import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Check, Crown, Zap, Shield } from 'lucide-react'
import Link from 'next/link'
import MembershipSubscribeButton from '@/components/MembershipSubscribeButton'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Membership | Black Moss & Herbs',
    description: 'Join The Circle — exclusive member benefits, consultation credits, storewide discounts, and priority dispatch from Black Moss & Herbs.',
}

const DEFAULT_FEATURES = [
    'Monthly consultation credit (30 min session)',
    '15% discount on all products, automatically applied',
    'Priority dispatch — your orders ship first',
    'Early access to new product drops',
    'Exclusive member-only protocols and guides',
    'Direct access to our practitioner team via email',
]

const ICONS = [Crown, Zap, Shield, Check, Check, Check]

export default async function MembershipPage() {
    const session = await getServerSession(authOptions)

    const plans = await prisma.subscriptionPlan.findMany({
        where: { active: true },
        orderBy: { price: 'asc' },
    })

    // Check if user already has an active subscription
    let activeSubscription = null
    if (session?.user?.id) {
        activeSubscription = await prisma.subscription.findFirst({
            where: { userId: session.user.id, status: 'ACTIVE' },
            include: { plan: true },
        })
    }

    return (
        <div className="py-24 bg-earth-950 min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="container relative z-10 pt-12">
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-400 mb-4 block">Membership</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tighter leading-none">
                        The Circle
                    </h1>
                    <p className="text-earth-400 text-lg max-w-2xl mx-auto">
                        A dedicated membership for those committed to their wellness journey. Exclusive benefits, real savings, and practitioner support — every month.
                    </p>
                </div>

                {/* Active subscription notice */}
                {activeSubscription && (
                    <div className="max-w-lg mx-auto mb-12 p-6 bg-emerald-900/20 border border-emerald-800/50 rounded-2xl text-center">
                        <p className="text-emerald-400 font-bold mb-1">You&apos;re already a member</p>
                        <p className="text-earth-400 text-sm">Active plan: {activeSubscription.plan.name}</p>
                        <Link href="/dashboard" className="inline-block mt-4 text-secondary-400 hover:text-secondary-300 text-sm font-semibold">
                            View Dashboard →
                        </Link>
                    </div>
                )}

                {plans.length > 0 ? (
                    <div className={`grid grid-cols-1 ${plans.length > 1 ? 'md:grid-cols-' + Math.min(plans.length, 3) : ''} gap-8 max-w-5xl mx-auto`}>
                        {plans.map((plan, index) => (
                            <div key={plan.id} className={`premium-card p-10 flex flex-col ${index === 0 && plans.length === 1 ? 'max-w-lg mx-auto w-full' : ''}`}>
                                <div className="mb-8">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-400 mb-3 block">
                                        {plan.interval === 'yearly' ? 'Annual' : 'Monthly'} Plan
                                    </span>
                                    <h2 className="text-3xl font-serif font-bold text-white mb-2">{plan.name}</h2>
                                    <p className="text-earth-500 text-sm">{plan.description}</p>
                                </div>

                                <div className="flex items-end gap-2 mb-10">
                                    <span className="text-5xl font-bold text-white">£{plan.price.toFixed(0)}</span>
                                    <span className="text-earth-500 mb-2">/ {plan.interval === 'yearly' ? 'year' : 'month'}</span>
                                </div>

                                <ul className="space-y-4 mb-10 flex-1">
                                    {(plan.features.length > 0 ? plan.features : DEFAULT_FEATURES).map((feature, i) => {
                                        const Icon = ICONS[i] || Check
                                        return (
                                            <li key={i} className="flex items-start gap-3 text-sm text-earth-300">
                                                <div className="w-5 h-5 bg-primary-900/40 rounded-full flex items-center justify-center border border-primary-500/30 flex-shrink-0 mt-0.5">
                                                    <Check className="w-3 h-3 text-primary-400" />
                                                </div>
                                                {feature}
                                            </li>
                                        )
                                    })}
                                </ul>

                                {activeSubscription ? (
                                    <div className="w-full py-4 bg-earth-800 text-earth-500 font-bold text-center rounded-xl text-sm cursor-default">
                                        Current Plan
                                    </div>
                                ) : (
                                    <MembershipSubscribeButton planId={plan.id} />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Fallback when no plans in DB yet */
                    <div className="max-w-lg mx-auto">
                        <div className="premium-card p-10 flex flex-col">
                            <div className="mb-8">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-400 mb-3 block">Monthly Plan</span>
                                <h2 className="text-3xl font-serif font-bold text-white mb-2">The Circle</h2>
                                <p className="text-earth-500 text-sm">Full practitioner access, discounts, and priority care — every month.</p>
                            </div>

                            <div className="flex items-end gap-2 mb-10">
                                <span className="text-5xl font-bold text-white">£29</span>
                                <span className="text-earth-500 mb-2">/ month</span>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {DEFAULT_FEATURES.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-earth-300">
                                        <div className="w-5 h-5 bg-primary-900/40 rounded-full flex items-center justify-center border border-primary-500/30 flex-shrink-0 mt-0.5">
                                            <Check className="w-3 h-3 text-primary-400" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/contact"
                                className="w-full py-4 bg-secondary-500 hover:bg-secondary-400 text-stone-950 font-black uppercase tracking-widest rounded-xl transition-all text-sm text-center block"
                            >
                                Express Interest
                            </Link>
                            <p className="text-center text-earth-600 text-xs mt-3">Membership launch coming soon — contact us to be first in line.</p>
                        </div>
                    </div>
                )}

                {/* Trust section */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
                    {[
                        { icon: '🔒', title: 'Cancel Anytime', body: 'No lock-in. Cancel your subscription at any time from your dashboard, effective at period end.' },
                        { icon: '💳', title: 'Secure Payments', body: 'All transactions processed through Stripe. We never store your card details.' },
                        { icon: '📦', title: 'Instant Benefits', body: 'Your discount and consultation credit activate immediately on subscription confirmation.' },
                    ].map((item) => (
                        <div key={item.title} className="p-6">
                            <div className="text-3xl mb-4">{item.icon}</div>
                            <h3 className="font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-earth-500 text-sm leading-relaxed">{item.body}</p>
                        </div>
                    ))}
                </div>

                {/* Disclaimer */}
                <p className="text-center text-xs text-earth-700 italic mt-16 max-w-xl mx-auto">
                    Membership benefits include consultation credits for herbal wellness guidance. This is not a medical service. Always consult your GP for health concerns.
                </p>
            </div>
        </div>
    )
}
