/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Subscription Tiers
 */
import { Metadata } from 'next'
import { Check, Zap } from 'lucide-react'
import SubscribeButton from '@/components/SubscribeButton'
import { formatPrice } from '@/lib/utils'

export const metadata: Metadata = {
    title: 'Subscriptions - Black Moss & Herbs',
    description: 'Subscribe and save on your favorite herbal products. Get monthly deliveries and exclusive member benefits.',
}

const plans = [
    {
        id: '1',
        key: 'starter' as const,
        name: 'Wellness Starter',
        price: 29.99,
        interval: 'month',
        description: 'Perfect for those beginning their herbal wellness journey',
        features: [
            '1 premium product per month',
            '10% discount on all purchases',
            'Free shipping on subscription',
            'Access to member-only content',
            'Monthly wellness newsletter',
        ],
        popular: false,
    },
    {
        id: '2',
        key: 'plus' as const,
        name: 'Wellness Plus',
        price: 54.99,
        interval: 'month',
        description: 'Our most popular plan for dedicated wellness enthusiasts',
        features: [
            '2 premium products per month',
            '20% discount on all purchases',
            'Free shipping on all orders',
            'Priority customer support',
            'Access to exclusive products',
            'Monthly wellness consultation',
            'Member-only workshops',
        ],
        popular: true,
    },
    {
        id: '3',
        key: 'pro' as const,
        name: 'Wellness Pro',
        price: 89.99,
        interval: 'month',
        description: 'Complete wellness solution for optimal health',
        features: [
            '4 premium products per month',
            '30% discount on all purchases',
            'Free express shipping',
            'Dedicated wellness advisor',
            'Custom product recommendations',
            'Quarterly health assessments',
            'VIP access to new products',
            'Exclusive community access',
        ],
        popular: false,
    },
]

export default function SubscriptionsPage() {
    return (
        <div className="py-12">
            <div className="container">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="section-title">Subscription Plans</h1>
                    <p className="section-subtitle mx-auto mb-6">
                        Choose the perfect plan for your wellness journey and save up to 30%
                    </p>
                    <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full">
                        <Zap className="w-5 h-5" />
                        <span className="font-medium">Cancel anytime, no commitments</span>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`card relative ${plan.popular ? 'ring-2 ring-primary-600 scale-105' : ''
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="badge-primary px-6 py-2 text-sm font-bold">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="p-8">
                                <h3 className="font-serif text-2xl font-bold text-earth-900 mb-2">
                                    {plan.name}
                                </h3>
                                <p className="text-earth-600 text-sm mb-6">{plan.description}</p>

                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold text-earth-900">
                                            {formatPrice(plan.price).split('.')[0]}
                                        </span>
                                        <span className="text-earth-600">/{plan.interval}</span>
                                    </div>
                                </div>

                                <SubscribeButton plan={plan.key} popular={plan.popular} />

                                <div className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <Check className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-earth-700 text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* How It Works */}
                <div className="bg-earth-50 rounded-3xl p-12 mb-16">
                    <h2 className="text-3xl font-serif font-bold text-earth-900 text-center mb-12">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            {
                                step: '1',
                                title: 'Choose Your Plan',
                                description: 'Select the subscription that fits your wellness goals',
                            },
                            {
                                step: '2',
                                title: 'Customize',
                                description: 'Pick your preferred products or let us curate for you',
                            },
                            {
                                step: '3',
                                title: 'Receive Monthly',
                                description: 'Get your products delivered right to your door',
                            },
                            {
                                step: '4',
                                title: 'Enjoy & Save',
                                description: 'Experience wellness while saving on every order',
                            },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="w-16 h-16 bg-gradient-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    {item.step}
                                </div>
                                <h3 className="font-serif text-xl font-bold text-earth-900 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-earth-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-serif font-bold text-earth-900 text-center mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        {[
                            {
                                q: 'Can I cancel my subscription anytime?',
                                a: 'Yes! You can cancel your subscription at any time with no penalties or fees. Your subscription will remain active until the end of your current billing period.',
                            },
                            {
                                q: 'Can I skip a month?',
                                a: 'Absolutely. You can pause or skip any month through your account dashboard. Just let us know before your next billing date.',
                            },
                            {
                                q: 'Can I change my plan?',
                                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes will take effect on your next billing cycle.',
                            },
                            {
                                q: 'What if I don\'t like a product?',
                                a: 'We offer a 100% satisfaction guarantee. If you\'re not happy with any product, contact us for a full refund or replacement.',
                            },
                        ].map((faq, index) => (
                            <div key={index} className="card p-6">
                                <h3 className="font-semibold text-earth-900 mb-2">{faq.q}</h3>
                                <p className="text-earth-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
