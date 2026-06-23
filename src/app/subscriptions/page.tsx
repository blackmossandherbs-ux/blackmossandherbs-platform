/**
 * Black Moss & Herbs Platform - Subscription Plans
 */
import { Metadata } from 'next'
import { Check, Zap } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import MembershipSubscribeButton from '@/components/MembershipSubscribeButton'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Subscription Plans | Black Moss & Herbs',
    description: 'Subscribe and save on your herbal wellness essentials. Monthly delivery, exclusive discounts, and practitioner support.',
}

const FALLBACK_PLANS = [
    {
        id: 'starter',
        name: 'Wellness Starter',
        price: 29.99,
        interval: 'monthly',
        description: 'Perfect for those beginning their herbal wellness journey.',
        features: ['1 premium product per month', '10% discount on all purchases', 'Free shipping on subscription orders', 'Access to member content', 'Monthly wellness newsletter'],
        popular: false,
    },
    {
        id: 'plus',
        name: 'Wellness Plus',
        price: 54.99,
        interval: 'monthly',
        description: 'Our most popular plan for dedicated wellness enthusiasts.',
        features: ['2 premium products per month', '20% discount on all purchases', 'Free shipping on all orders', 'Priority customer support', 'Monthly consultation credit', 'Member-only early access'],
        popular: true,
    },
    {
        id: 'pro',
        name: 'Wellness Pro',
        price: 89.99,
        interval: 'monthly',
        description: 'Complete wellness solution for optimal results.',
        features: ['4 premium products per month', '30% discount on all purchases', 'Free express shipping', 'Dedicated wellness advisor', 'Quarterly health sessions', 'VIP product drops', 'Exclusive community access'],
        popular: false,
    },
]

const FAQ = [
    {
        q: 'Can I cancel my subscription anytime?',
        a: 'Yes. Cancel at any time from your dashboard with no penalties. Your subscription stays active until the end of your current billing period.',
    },
    {
        q: 'Can I pause or skip a month?',
        a: 'Contact our team before your next billing date to skip a delivery. We\'ll hold your slot and resume the following month.',
    },
    {
        q: 'Can I change my plan?',
        a: 'You can upgrade or downgrade at any time. Changes take effect on your next billing cycle.',
    },
    {
        q: 'What if I\'m not happy with a product?',
        a: 'We offer a satisfaction guarantee. Contact us within 14 days for a replacement or refund under the Consumer Rights Act 2015.',
    },
]

export default async function SubscriptionsPage() {
    const dbPlans = await prisma.subscriptionPlan.findMany({
        where: { active: true },
        orderBy: { price: 'asc' },
    })

    const hasDbPlans = dbPlans.length > 0

    return (
        <div className="py-24 bg-earth-950 min-h-screen">
            <div className="container pt-12">
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-400 mb-4 block">Subscribe & Save</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 tracking-tighter">Subscription Plans</h1>
                    <p className="text-earth-400 text-lg max-w-2xl mx-auto mb-8">
                        Get your herbal essentials delivered monthly, with exclusive discounts and practitioner access.
                    </p>
                    <div className="inline-flex items-center gap-2 bg-primary-900/20 border border-primary-800/40 text-primary-400 px-5 py-2.5 rounded-full text-sm font-bold">
                        <Zap className="w-4 h-4" />
                        Cancel anytime — no lock-in
                    </div>
                </div>

                {/* Plans */}
                {hasDbPlans ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-24">
                        {dbPlans.map((plan, i) => (
                            <div key={plan.id} className={`premium-card p-8 flex flex-col relative ${i === 1 ? 'border-secondary-500/40 ring-1 ring-secondary-500/20' : ''}`}>
                                {i === 1 && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-secondary-500 text-stone-950 text-[10px] font-black uppercase tracking-widest rounded-full">
                                        Most Popular
                                    </div>
                                )}
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mb-3 block">
                                    {plan.interval === 'yearly' ? 'Annual' : 'Monthly'}
                                </span>
                                <h3 className="font-serif text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-earth-500 text-sm mb-6">{plan.description}</p>
                                <div className="flex items-end gap-2 mb-8">
                                    <span className="text-4xl font-bold text-white">£{plan.price.toFixed(0)}</span>
                                    <span className="text-earth-500 mb-1">/ {plan.interval === 'yearly' ? 'year' : 'month'}</span>
                                </div>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((f, fi) => (
                                        <li key={fi} className="flex items-start gap-3 text-sm text-earth-300">
                                            <div className="w-4 h-4 bg-primary-900/40 rounded-full flex items-center justify-center border border-primary-500/30 flex-shrink-0 mt-0.5">
                                                <Check className="w-2.5 h-2.5 text-primary-400" />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <MembershipSubscribeButton planId={plan.id} label="Get Started" />
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Fallback hardcoded plans when DB has none — still links to /membership */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-24">
                        {FALLBACK_PLANS.map((plan, i) => (
                            <div key={plan.id} className={`premium-card p-8 flex flex-col relative ${plan.popular ? 'border-secondary-500/40 ring-1 ring-secondary-500/20' : ''}`}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-secondary-500 text-stone-950 text-[10px] font-black uppercase tracking-widest rounded-full">
                                        Most Popular
                                    </div>
                                )}
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mb-3 block">Monthly</span>
                                <h3 className="font-serif text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-earth-500 text-sm mb-6">{plan.description}</p>
                                <div className="flex items-end gap-2 mb-8">
                                    <span className="text-4xl font-bold text-white">£{plan.price.toFixed(0)}</span>
                                    <span className="text-earth-500 mb-1">/ month</span>
                                </div>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {plan.features.map((f, fi) => (
                                        <li key={fi} className="flex items-start gap-3 text-sm text-earth-300">
                                            <div className="w-4 h-4 bg-primary-900/40 rounded-full flex items-center justify-center border border-primary-500/30 flex-shrink-0 mt-0.5">
                                                <Check className="w-2.5 h-2.5 text-primary-400" />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href="/membership"
                                    className="w-full py-4 bg-secondary-500 hover:bg-secondary-400 text-stone-950 font-black uppercase tracking-widest rounded-xl transition-all text-sm text-center block"
                                >
                                    Get Started
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                {/* How it works */}
                <div className="bg-earth-900/40 border border-earth-800 rounded-3xl p-12 mb-20">
                    <h2 className="text-3xl font-serif font-bold text-white text-center mb-12">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: '1', title: 'Choose Your Plan', body: 'Pick the tier that fits your wellness goals and budget.' },
                            { step: '2', title: 'Secure Checkout', body: 'Subscribe securely via Stripe — cancel any time from your dashboard.' },
                            { step: '3', title: 'Monthly Delivery', body: 'Your curated products ship straight to your door each month.' },
                            { step: '4', title: 'Enjoy & Save', body: 'Experience the benefits while saving up to 30% on every order.' },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="w-14 h-14 bg-primary-900/40 border border-primary-700/40 text-primary-400 rounded-full flex items-center justify-center text-xl font-black mx-auto mb-4">
                                    {item.step}
                                </div>
                                <h3 className="font-serif text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-earth-500 text-sm">{item.body}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-serif font-bold text-white text-center mb-12">Common Questions</h2>
                    <div className="space-y-4">
                        {FAQ.map((faq, i) => (
                            <div key={i} className="premium-card p-6">
                                <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                                <p className="text-earth-400 text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-center text-xs text-earth-700 italic mt-16 max-w-xl mx-auto">
                    Prices include VAT. Subscription benefits are for herbal wellness products. This is not a medical service. Consult your GP for health concerns.
                </p>
            </div>
        </div>
    )
}
