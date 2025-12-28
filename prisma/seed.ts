import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding Black Moss & Herbs database...')

    // Create comprehensive product catalog with GBP pricing
    const products = await Promise.all([
        // SEA MOSS PRODUCTS
        prisma.product.create({
            data: {
                name: 'Wildcrafted Sea Moss Gold Gel',
                slug: 'wildcrafted-sea-moss-gold-gel',
                description: 'Premium wildcrafted sea moss gel sourced from the pristine waters of the Caribbean. Our gold sea moss contains 92 of the 102 minerals your body needs for optimal health. Rich in iodine, calcium, and potassium. Perfect for smoothies, teas, or taken directly.',
                price: 27.99,
                compareAtPrice: 34.99,
                images: ['/images/sea-moss-gel.jpg'],
                category: 'Sea Moss',
                tags: ['sea moss', 'minerals', 'immune support', 'thyroid health'],
                stock: 150,
                type: 'PHYSICAL',
                featured: true,
                active: true,
                benefits: [
                    'Supports thyroid function with natural iodine',
                    'Boosts immune system',
                    'Promotes healthy digestion',
                    'Enhances skin health and elasticity',
                    'Provides 92 essential minerals',
                ],
            },
        }),

        prisma.product.create({
            data: {
                name: 'Irish Moss (Chondrus Crispus)',
                slug: 'irish-moss-dried',
                description: 'Authentic Irish Moss harvested from the cold Atlantic waters. Known for its mucilaginous properties, Irish moss is excellent for respiratory health and digestive support. Can be used to make gel or added to soups and stews.',
                price: 19.99,
                images: ['/images/irish-moss.jpg'],
                category: 'Sea Moss',
                tags: ['irish moss', 'respiratory', 'digestive health'],
                stock: 100,
                type: 'PHYSICAL',
                active: true,
                benefits: [
                    'Soothes respiratory tract',
                    'Supports digestive health',
                    'Natural source of carrageenan',
                    'Rich in vitamins and minerals',
                ],
            },
        }),

        // IMMUNE SUPPORT
        prisma.product.create({
            data: {
                name: 'Organic Elderberry Syrup',
                slug: 'organic-elderberry-syrup',
                description: 'Handcrafted elderberry syrup made from organic European black elderberries. Traditionally used to support immune function during cold and flu season. Sweetened with raw honey and infused with warming spices including cinnamon and ginger.',
                price: 22.99,
                compareAtPrice: 28.99,
                images: ['/images/elderberry-syrup.jpg'],
                category: 'Immune Support',
                tags: ['elderberry', 'immune', 'antioxidants', 'cold & flu'],
                stock: 85,
                type: 'PHYSICAL',
                featured: true,
                active: true,
                benefits: [
                    'Powerful immune system support',
                    'Rich in antioxidants (anthocyanins)',
                    'May reduce cold and flu duration',
                    'Natural anti-inflammatory properties',
                    'Supports respiratory health',
                ],
            },
        }),

        prisma.product.create({
            data: {
                name: 'Black Seed Oil (Nigella Sativa)',
                slug: 'black-seed-oil',
                description: 'Cold-pressed black seed oil from premium Nigella sativa seeds. Known as "the seed of blessing," black seed oil has been used for centuries in traditional medicine. Rich in thymoquinone, a powerful antioxidant compound.',
                price: 24.99,
                images: ['/images/black-seed-oil.jpg'],
                category: 'Immune Support',
                tags: ['black seed', 'immune', 'antioxidant', 'anti-inflammatory'],
                stock: 120,
                type: 'PHYSICAL',
                featured: true,
                active: true,
                benefits: [
                    'Supports immune function',
                    'Powerful antioxidant properties',
                    'May help regulate blood sugar',
                    'Supports respiratory health',
                    'Anti-inflammatory effects',
                ],
            },
        }),

        // ADAPTOGENS & STRESS SUPPORT
        prisma.product.create({
            data: {
                name: 'Ashwagandha Root Powder',
                slug: 'ashwagandha-root-powder',
                description: 'Premium organic ashwagandha (Withania somnifera) root powder. This powerful adaptogen helps your body manage stress and promotes overall vitality. Traditionally used in Ayurvedic medicine for over 3,000 years.',
                price: 21.99,
                images: ['/images/ashwagandha-root.jpg'],
                category: 'Adaptogens',
                tags: ['ashwagandha', 'stress', 'adaptogen', 'energy'],
                stock: 95,
                type: 'PHYSICAL',
                active: true,
                benefits: [
                    'Reduces stress and anxiety',
                    'Supports adrenal function',
                    'Enhances energy and stamina',
                    'Improves sleep quality',
                    'Supports cognitive function',
                ],
            },
        }),

        // SUPERFOODS
        prisma.product.create({
            data: {
                name: 'Organic Moringa Powder',
                slug: 'organic-moringa-powder',
                description: 'Pure organic moringa oleifera leaf powder from sustainably harvested trees. Known as the "miracle tree," moringa is one of the most nutrient-dense plants on Earth. Contains all 9 essential amino acids, vitamins A, C, and E, plus calcium and iron.',
                price: 18.99,
                images: ['/images/moringa-powder.jpg'],
                category: 'Superfoods',
                tags: ['moringa', 'superfood', 'nutrition', 'energy'],
                stock: 110,
                type: 'PHYSICAL',
                active: true,
                benefits: [
                    'Complete protein source',
                    'Rich in vitamins and minerals',
                    'Supports healthy blood sugar levels',
                    'Anti-inflammatory properties',
                    'Boosts energy naturally',
                ],
            },
        }),

        prisma.product.create({
            data: {
                name: 'Spirulina Tablets (Organic)',
                slug: 'spirulina-tablets-organic',
                description: 'Premium organic spirulina tablets made from pure blue-green algae. One of nature\'s most complete superfoods, spirulina contains protein, B vitamins, iron, and powerful antioxidants including phycocyanin.',
                price: 16.99,
                images: ['/images/spirulina-tablets.jpg'],
                category: 'Superfoods',
                tags: ['spirulina', 'protein', 'superfood', 'detox'],
                stock: 140,
                type: 'PHYSICAL',
                active: true,
                benefits: [
                    '60-70% complete protein',
                    'Rich in B vitamins and iron',
                    'Powerful antioxidant properties',
                    'Supports detoxification',
                    'May lower cholesterol',
                ],
            },
        }),

        // ANTI-INFLAMMATORY
        prisma.product.create({
            data: {
                name: 'Turmeric & Black Pepper Capsules',
                slug: 'turmeric-black-pepper-capsules',
                description: 'High-potency turmeric capsules with black pepper extract (BioPerine) for enhanced absorption. Contains 95% curcuminoids, the active compounds in turmeric. Black pepper increases curcumin bioavailability by up to 2000%.',
                price: 23.99,
                images: ['/images/turmeric-capsules.jpg'],
                category: 'Anti-Inflammatory',
                tags: ['turmeric', 'anti-inflammatory', 'curcumin', 'joint health'],
                stock: 130,
                type: 'PHYSICAL',
                featured: true,
                active: true,
                benefits: [
                    'Powerful anti-inflammatory effects',
                    'Supports joint health and mobility',
                    'Antioxidant protection',
                    'May support brain health',
                    'Aids digestive health',
                ],
            },
        }),

        // HERBAL TEAS
        prisma.product.create({
            data: {
                name: 'Calming Herbal Tea Blend',
                slug: 'calming-herbal-tea-blend',
                description: 'Soothing blend of chamomile, lavender, lemon balm, and passionflower. Perfect for evening relaxation and promoting restful sleep. Caffeine-free and organic. Each tin contains 30 servings.',
                price: 14.99,
                compareAtPrice: 18.99,
                images: ['/images/herbal-tea-blend.jpg'],
                category: 'Herbal Teas',
                tags: ['tea', 'relaxation', 'sleep', 'caffeine-free'],
                stock: 160,
                type: 'PHYSICAL',
                active: true,
                benefits: [
                    'Promotes relaxation and calm',
                    'Supports restful sleep',
                    'Eases digestive discomfort',
                    'Reduces anxiety naturally',
                    'Caffeine-free',
                ],
            },
        }),

        prisma.product.create({
            data: {
                name: 'Burdock Root Tea',
                slug: 'burdock-root-tea',
                description: 'Premium dried burdock root for brewing a cleansing, earthy tea. Traditionally used as a blood purifier and to support liver function. Rich in antioxidants and prebiotic fiber (inulin).',
                price: 12.99,
                images: ['/images/burdock-root.jpg'],
                category: 'Herbal Teas',
                tags: ['burdock', 'detox', 'liver support', 'tea'],
                stock: 90,
                type: 'PHYSICAL',
                active: true,
                benefits: [
                    'Supports liver detoxification',
                    'Blood purifying properties',
                    'Rich in antioxidants',
                    'Supports healthy skin',
                    'Prebiotic fiber for gut health',
                ],
            },
        }),

        prisma.product.create({
            data: {
                name: 'Nettle Leaf Tea (Organic)',
                slug: 'nettle-leaf-tea-organic',
                description: 'Organic stinging nettle leaf tea, rich in vitamins and minerals. Traditionally used to support kidney function, reduce inflammation, and provide natural allergy relief. Earthy, slightly sweet flavor.',
                price: 11.99,
                images: ['/images/nettle-leaf.jpg'],
                category: 'Herbal Teas',
                tags: ['nettle', 'allergies', 'minerals', 'tea'],
                stock: 105,
                type: 'PHYSICAL',
                active: true,
                benefits: [
                    'Natural allergy relief',
                    'Rich in vitamins and minerals',
                    'Supports kidney function',
                    'Anti-inflammatory properties',
                    'May support prostate health',
                ],
            },
        }),

        prisma.product.create({
            data: {
                name: 'Soursop Leaves (Graviola)',
                slug: 'soursop-leaves-graviola',
                description: 'Premium dried soursop (graviola) leaves from the Caribbean. Traditionally used in herbal medicine for its potential health benefits. Can be brewed as tea or used in herbal preparations.',
                price: 15.99,
                images: ['/images/soursop-leaves.jpg'],
                category: 'Herbal Teas',
                tags: ['soursop', 'graviola', 'immune', 'tea'],
                stock: 75,
                type: 'PHYSICAL',
                active: true,
                benefits: [
                    'Rich in antioxidants',
                    'Supports immune function',
                    'May promote relaxation',
                    'Traditional Caribbean remedy',
                    'Caffeine-free',
                ],
            },
        }),
    ])

    console.log(`✅ Created ${products.length} products with detailed descriptions`)

    // Create subscription plans with GBP pricing
    const plans = await Promise.all([
        prisma.subscriptionPlan.create({
            data: {
                name: 'Wellness Starter',
                description: 'Perfect for those beginning their herbal wellness journey',
                price: 24.99,
                interval: 'monthly',
                stripePriceId: 'price_starter_monthly',
                features: [
                    '1 premium product per month',
                    '10% discount on all purchases',
                    'Free UK shipping on subscription',
                    'Access to member-only content',
                    'Monthly wellness newsletter',
                    'Priority customer support',
                ],
                active: true,
            },
        }),
        prisma.subscriptionPlan.create({
            data: {
                name: 'Wellness Plus',
                description: 'Our most popular plan for dedicated wellness enthusiasts',
                price: 44.99,
                interval: 'monthly',
                stripePriceId: 'price_plus_monthly',
                features: [
                    '2 premium products per month',
                    '20% discount on all purchases',
                    'Free shipping on all orders',
                    'Priority customer support',
                    'Access to exclusive products',
                    'Monthly wellness consultation (15 min)',
                    'Member-only workshops and webinars',
                    'Early access to new products',
                ],
                active: true,
            },
        }),
        prisma.subscriptionPlan.create({
            data: {
                name: 'Wellness Pro',
                description: 'Complete wellness solution for optimal health',
                price: 74.99,
                interval: 'monthly',
                stripePriceId: 'price_pro_monthly',
                features: [
                    '4 premium products per month',
                    '30% discount on all purchases',
                    'Free express shipping worldwide',
                    'Dedicated wellness advisor',
                    'Custom product recommendations',
                    'Monthly health assessments (30 min)',
                    'VIP access to new products',
                    'Exclusive community access',
                    'Quarterly gift box',
                    'Free digital wellness guides',
                ],
                active: true,
            },
        }),
    ])

    console.log(`✅ Created ${plans.length} subscription plans`)

    console.log('🎉 Database seeded successfully with GBP pricing!')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
