import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Create sample products
    const products = await Promise.all([
        prisma.product.create({
            data: {
                name: 'Sea Moss Gold Gel',
                slug: 'sea-moss-gold-gel',
                description: 'Premium wildcrafted sea moss gel packed with 92 of the 102 minerals your body needs. Supports immune function, digestion, and overall wellness.',
                price: 34.99,
                compareAtPrice: 44.99,
                images: [],
                category: 'Supplements',
                tags: ['sea moss', 'minerals', 'immune support'],
                stock: 100,
                type: 'PHYSICAL',
                featured: true,
                active: true,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Elderberry Syrup',
                slug: 'elderberry-syrup',
                description: 'Organic elderberry syrup to support immune health naturally. Rich in antioxidants and vitamins.',
                price: 24.99,
                images: [],
                category: 'Immune Support',
                tags: ['elderberry', 'immune', 'antioxidants'],
                stock: 75,
                type: 'PHYSICAL',
                featured: true,
                active: true,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Herbal Tea Blend',
                slug: 'herbal-tea-blend',
                description: 'Calming herbal tea blend with chamomile, lavender, and lemon balm for relaxation and better sleep.',
                price: 18.99,
                compareAtPrice: 22.99,
                images: [],
                category: 'Teas',
                tags: ['tea', 'relaxation', 'sleep'],
                stock: 150,
                type: 'PHYSICAL',
                active: true,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Turmeric Capsules',
                slug: 'turmeric-capsules',
                description: 'High-potency turmeric capsules with black pepper for enhanced absorption. Natural anti-inflammatory support.',
                price: 29.99,
                images: [],
                category: 'Supplements',
                tags: ['turmeric', 'anti-inflammatory', 'capsules'],
                stock: 120,
                type: 'PHYSICAL',
                active: true,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Ashwagandha Root',
                slug: 'ashwagandha-root',
                description: 'Premium ashwagandha root powder. Adaptogenic herb to help manage stress and support overall vitality.',
                price: 26.99,
                images: [],
                category: 'Adaptogens',
                tags: ['ashwagandha', 'stress', 'adaptogen'],
                stock: 90,
                type: 'PHYSICAL',
                active: true,
            },
        }),
        prisma.product.create({
            data: {
                name: 'Moringa Powder',
                slug: 'moringa-powder',
                description: 'Organic moringa powder superfood. Rich in vitamins, minerals, and antioxidants for daily nutrition.',
                price: 22.99,
                images: [],
                category: 'Superfoods',
                tags: ['moringa', 'superfood', 'nutrition'],
                stock: 110,
                type: 'PHYSICAL',
                active: true,
            },
        }),
    ])

    console.log(`✅ Created ${products.length} products`)

    // Create subscription plans
    const plans = await Promise.all([
        prisma.subscriptionPlan.create({
            data: {
                name: 'Wellness Starter',
                description: 'Perfect for those beginning their herbal wellness journey',
                price: 29.99,
                interval: 'monthly',
                stripePriceId: 'price_starter_monthly',
                features: [
                    '1 premium product per month',
                    '10% discount on all purchases',
                    'Free shipping on subscription',
                    'Access to member-only content',
                    'Monthly wellness newsletter',
                ],
                active: true,
            },
        }),
        prisma.subscriptionPlan.create({
            data: {
                name: 'Wellness Plus',
                description: 'Our most popular plan for dedicated wellness enthusiasts',
                price: 54.99,
                interval: 'monthly',
                stripePriceId: 'price_plus_monthly',
                features: [
                    '2 premium products per month',
                    '20% discount on all purchases',
                    'Free shipping on all orders',
                    'Priority customer support',
                    'Access to exclusive products',
                    'Monthly wellness consultation',
                    'Member-only workshops',
                ],
                active: true,
            },
        }),
        prisma.subscriptionPlan.create({
            data: {
                name: 'Wellness Pro',
                description: 'Complete wellness solution for optimal health',
                price: 89.99,
                interval: 'monthly',
                stripePriceId: 'price_pro_monthly',
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
                active: true,
            },
        }),
    ])

    console.log(`✅ Created ${plans.length} subscription plans`)

    // Create membership tiers
    const tiers = await Promise.all([
        prisma.membershipTier.create({
            data: {
                name: 'Bronze',
                description: 'Entry-level membership with basic benefits',
                benefits: ['5% discount', 'Monthly newsletter', 'Early access to sales'],
                price: 0,
                active: true,
            },
        }),
        prisma.membershipTier.create({
            data: {
                name: 'Silver',
                description: 'Enhanced membership with additional perks',
                benefits: ['10% discount', 'Free shipping', 'Priority support', 'Exclusive content'],
                price: 9.99,
                active: true,
            },
        }),
        prisma.membershipTier.create({
            data: {
                name: 'Gold',
                description: 'Premium membership with all benefits',
                benefits: ['15% discount', 'Free express shipping', 'VIP support', 'Exclusive products', 'Monthly gift'],
                price: 19.99,
                active: true,
            },
        }),
    ])

    console.log(`✅ Created ${tiers.length} membership tiers`)

    // Create sample blog posts
    const posts = await Promise.all([
        prisma.blogPost.create({
            data: {
                title: 'The Complete Guide to Sea Moss Benefits',
                slug: 'complete-guide-sea-moss-benefits',
                excerpt: 'Discover the incredible health benefits of sea moss and how to incorporate it into your daily routine for optimal wellness.',
                content: 'Full blog post content here...',
                category: 'Superfoods',
                tags: ['sea moss', 'health', 'nutrition'],
                published: true,
                publishedAt: new Date(),
            },
        }),
        prisma.blogPost.create({
            data: {
                title: '10 Herbs for Natural Immune Support',
                slug: '10-herbs-natural-immune-support',
                excerpt: 'Learn about powerful herbs that can help strengthen your immune system naturally and keep you healthy year-round.',
                content: 'Full blog post content here...',
                category: 'Immune Health',
                tags: ['immune', 'herbs', 'health'],
                published: true,
                publishedAt: new Date(),
            },
        }),
    ])

    console.log(`✅ Created ${posts.length} blog posts`)

    // Create sample videos
    const videos = await Promise.all([
        prisma.video.create({
            data: {
                title: 'How to Use Sea Moss Gel Daily',
                slug: 'how-to-use-sea-moss-gel',
                description: 'Learn the best ways to incorporate sea moss gel into your daily routine for maximum benefits.',
                videoUrl: 'https://example.com/video1',
                category: 'Tutorials',
                duration: 480,
                published: true,
            },
        }),
        prisma.video.create({
            data: {
                title: 'The Science Behind Adaptogens',
                slug: 'science-behind-adaptogens',
                description: 'Discover how adaptogenic herbs work in your body to combat stress and promote balance.',
                videoUrl: 'https://example.com/video2',
                category: 'Education',
                duration: 720,
                published: true,
            },
        }),
    ])

    console.log(`✅ Created ${videos.length} videos`)

    console.log('🎉 Database seeded successfully!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
