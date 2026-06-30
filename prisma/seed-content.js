/**
 * Supplemental seed — populates content tables the main seed skips:
 * videos, subscription plans, digital products, site settings.
 * Idempotent: uses upsert / skipDuplicates so it is safe to re-run.
 */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // ---- Subscription Plans ----
    const plans = [
        {
            name: 'Wellness Starter',
            description: 'Perfect for those beginning their herbal wellness journey.',
            price: 29.99,
            interval: 'monthly',
            stripePriceId: process.env.STRIPE_PRICE_STARTER && process.env.STRIPE_PRICE_STARTER !== 'price_placeholder' ? process.env.STRIPE_PRICE_STARTER : 'price_seed_starter',
            features: ['1 premium product per month', '10% discount on all purchases', 'Free UK shipping on subscription orders', 'Access to member-only content', 'Monthly wellness newsletter'],
            active: true,
        },
        {
            name: 'Wellness Plus',
            description: 'Our most popular plan for dedicated wellness enthusiasts.',
            price: 54.99,
            interval: 'monthly',
            stripePriceId: process.env.STRIPE_PRICE_PLUS && process.env.STRIPE_PRICE_PLUS !== 'price_placeholder' ? process.env.STRIPE_PRICE_PLUS : 'price_seed_plus',
            features: ['2 premium products per month', '20% discount on all purchases', 'Free UK shipping on all orders', 'Priority customer support', 'Monthly consultation credit', 'Member-only early access'],
            active: true,
        },
        {
            name: 'Wellness Pro',
            description: 'Complete wellness solution for optimal results.',
            price: 89.99,
            interval: 'monthly',
            stripePriceId: process.env.STRIPE_PRICE_PRO && process.env.STRIPE_PRICE_PRO !== 'price_placeholder' ? process.env.STRIPE_PRICE_PRO : 'price_seed_pro',
            features: ['4 premium products per month', '30% discount on all purchases', 'Free express UK shipping', 'Dedicated wellness advisor', 'Quarterly health sessions', 'VIP product drops', 'Exclusive community access'],
            active: true,
        },
    ]

    for (const plan of plans) {
        await prisma.subscriptionPlan.upsert({
            where: { stripePriceId: plan.stripePriceId },
            update: { name: plan.name, description: plan.description, price: plan.price, features: plan.features, active: true },
            create: plan,
        })
    }
    console.log(`✓ Subscription plans: ${plans.length}`)

    // ---- Videos ----
    const videos = [
        { title: 'How to Use Sea Moss Gel Every Day', slug: 'how-to-use-sea-moss-gel', description: 'A simple daily routine for incorporating sea moss gel into smoothies, teas, and meals for steady mineral support.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', category: 'Tutorials', duration: 480, published: true, views: 12500 },
        { title: 'Sea Moss & Bladderwrack: Why We Pair Them', slug: 'sea-moss-bladderwrack-pairing', description: 'The science behind combining sea moss and bladderwrack for thyroid and metabolic support.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', category: 'Education', duration: 720, published: true, views: 8300 },
        { title: 'Making Sea Moss Gel at Home', slug: 'making-sea-moss-gel-at-home', description: 'Step-by-step guide to preparing your own sea moss gel from raw wildcrafted moss.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', category: 'DIY', duration: 600, published: true, views: 15000 },
        { title: 'Understanding Adaptogens for Stress', slug: 'understanding-adaptogens', description: 'How adaptogenic herbs help the body manage stress, and which ones to start with.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', category: 'Education', duration: 900, published: true, views: 6800 },
        { title: 'Burdock Root: The Blood Purifier', slug: 'burdock-root-benefits', description: 'A deep look at burdock root, its traditional uses, and how to brew it as a tea.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', category: 'Education', duration: 540, published: true, views: 5600 },
        { title: 'Building Your Herbal Pantry', slug: 'building-herbal-pantry', description: 'Essential herbs every wellness-focused household should keep on hand.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', category: 'Tutorials', duration: 660, published: true, views: 9200 },
    ]

    await prisma.video.createMany({ data: videos, skipDuplicates: true })
    console.log(`✓ Videos: ${videos.length}`)

    // ---- Digital Products (attach to a few existing products) ----
    const someProducts = await prisma.product.findMany({ take: 3, orderBy: { createdAt: 'asc' } })
    const guides = [
        { fileUrl: '/downloads/sea-moss-starter-guide.pdf', fileSize: 2_400_000, fileType: 'pdf' },
        { fileUrl: '/downloads/14-day-reset-protocol.pdf', fileSize: 3_100_000, fileType: 'pdf' },
        { fileUrl: '/downloads/alkaline-food-guide.pdf', fileSize: 1_800_000, fileType: 'pdf' },
    ]
    let dpCount = 0
    for (let i = 0; i < someProducts.length && i < guides.length; i++) {
        await prisma.digitalProduct.upsert({
            where: { productId: someProducts[i].id },
            update: guides[i],
            create: { productId: someProducts[i].id, ...guides[i] },
        })
        dpCount++
    }
    console.log(`✓ Digital products: ${dpCount}`)

    // ---- Site Settings ----
    const settings = [
        { key: 'announcement', value: { text: 'Free UK delivery on orders over £40 · Wildcrafted & lab-verified', active: true } },
        { key: 'social', value: { instagram: 'https://instagram.com/blackmossandherbs', facebook: 'https://facebook.com/blackmossandherbs', tiktok: 'https://tiktok.com/@blackmossandherbs' } },
        { key: 'contact', value: { email: 'support@blackmossandherbs.com', phone: '', hours: 'Mon–Fri, 9am–5pm GMT' } },
    ]
    for (const s of settings) {
        await prisma.siteSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s })
    }
    console.log(`✓ Site settings: ${settings.length}`)
}

main()
    .then(() => { console.log('Content seed complete.'); return prisma.$disconnect() })
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
