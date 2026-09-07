
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// Helper to create variations
function createVariant(baseName, type, price, image, category, benefits) {
    const descriptions = {
        'Sea Moss': `Wildcrafted ${baseName} in ${type} form, harvested from Atlantic coastal waters. Sea moss is a genuinely mineral-dense seaweed with real published research behind it — and a real iodine consideration worth knowing before you take it daily. See "The Research" on this page for both sides.`,
        'Herbs': `${baseName} ${type}, wildcrafted and prepared in the alkaline tradition Dr. Sebi taught. This is a traditional herb with a long global history of use — where we have real clinical research to back a specific benefit, we've cited it below rather than just claiming it.`,
        'Supplements': `A ${baseName} blend combining traditional botanical ingredients at a measured dose. We've written this description in plain terms on purpose: it supports an already-healthy routine, it does not diagnose or treat anything.`,
        'Oils': `${baseName}, cold-pressed to preserve its natural fatty acids. Traditional skin and hair care oil — where clinical trial evidence exists for a specific use, it's cited on this page; where it doesn't, we say so.`,
        'Bundles': `A curated set of our alkaline herbal staples, bundled together for a full routine. Each individual product page in this bundle carries its own research and any relevant safety notes.`,
        'Pantry': `${baseName} ${type}, a traditional alkaline food staple rather than a treated "wellness" product. Valued as real food, sourced from the same worldwide traditions as the rest of this shop.`
    };

    const finalDescription = descriptions[category] || `${baseName} ${type}, wildcrafted and alkaline-aligned.`;

    return {
        name: `${baseName} ${type}`,
        slug: `${baseName.toLowerCase().replace(/ /g, '-')}-${type.toLowerCase().replace(/ /g, '-')}`,
        images: [image],
        price: price,
        category: category,
        description: `${finalDescription} ${benefits}`,
        stock: 50,
        type: 'PHYSICAL',
        featured: Math.random() > 0.8
    };
}

const products = [
    // --- SEA MOSS (The Core) ---
    createVariant('Sea Moss Gold', 'Gel', 29.99, '/images/sea_moss_gold.webp', 'Sea Moss', 'Contains 92 minerals. Daily immune support.'),
    createVariant('Purple Sea Moss', 'Gel', 34.99, '/images/sea_moss_purple.webp', 'Sea Moss', 'Rich in anthocyanins and antioxidants.'),
    createVariant('Full Spectrum Sea Moss', 'Gel', 39.99, '/images/sea_moss_gold.webp', 'Sea Moss', 'Gold, Purple, and Green blend for maximum potency.'),
    createVariant('Sea Moss & Bladderwrack', 'Gel', 32.99, '/images/sea_moss_gold.webp', 'Sea Moss', 'Two iodine-rich seaweeds — check "The Research" below before taking daily, especially alongside other iodine sources.'),
    createVariant('Sea Moss & Burdock', 'Gel', 32.99, '/images/sea_moss_gold.webp', 'Sea Moss', 'Blood purifying blend.'),
    createVariant('Sea Moss & Elderberry', 'Gel', 34.99, '/images/sea_moss_purple.webp', 'Sea Moss', 'Immune defense blend.'),
    createVariant('Mango Infused Sea Moss', 'Gel', 34.99, '/images/sea_moss_gold.webp', 'Sea Moss', 'Tropical flavor with mineral benefits.'),
    createVariant('Strawberry Infused Sea Moss', 'Gel', 34.99, '/images/sea_moss_purple.webp', 'Sea Moss', 'Berry antioxidant boost.'),

    createVariant('Sea Moss', 'Capsules', 24.99, '/images/herbal_capsules.webp', 'Sea Moss', 'Convenient daily mineral intake.'),
    createVariant('Purple Sea Moss', 'Capsules', 29.99, '/images/herbal_capsules.webp', 'Sea Moss', 'Antioxidant rich capsules.'),
    createVariant('Sea Moss & Bladderwrack', 'Capsules', 27.99, '/images/herbal_capsules.webp', 'Sea Moss', 'Two iodine-rich seaweeds in capsule form — same iodine consideration as the gel, see "The Research" below.'),
    createVariant('Sea Moss & Burdock', 'Capsules', 27.99, '/images/herbal_capsules.webp', 'Sea Moss', 'Skin and blood cleanser.'),

    createVariant('Sea Moss Gold', 'Raw', 24.99, '/images/sea_moss_gold.webp', 'Sea Moss', 'Make your own gel at home.'),
    createVariant('Purple Sea Moss', 'Raw', 29.99, '/images/sea_moss_purple.webp', 'Sea Moss', 'Premium raw purple moss.'),
    createVariant('Irish Moss', 'Powder', 22.99, '/images/irish_moss.webp', 'Sea Moss', 'Versatile superfood powder.'),

    createVariant('Burdock Root', 'Capsules', 24.99, '/images/herbal_capsules.webp', 'Herbs', 'Traditional root with real antioxidant research behind it — see "The Research" below.'),
    createVariant('Burdock Root', 'Powder', 19.99, '/images/herbal_powder.webp', 'Herbs', 'Loose powder for teas and smoothies.'),
    createVariant('Burdock Root', 'Cut Root', 19.99, '/images/burdock_root.webp', 'Herbs', 'Traditional tea root.'),

    createVariant('Sarsaparilla', 'Capsules', 26.99, '/images/herbal_capsules.webp', 'Herbs', 'Highest iron content herb.'),
    createVariant('Sarsaparilla', 'Powder', 21.99, '/images/herbal_powder.webp', 'Herbs', 'Iron-rich powder supplement.'),
    createVariant('Sarsaparilla', 'Cut Root', 21.99, '/images/sarsaparilla.webp', 'Herbs', 'Traditional iron tonic tea.'),

    createVariant('Dandelion Root', 'Capsules', 22.99, '/images/herbal_capsules.webp', 'Herbs', 'Traditional bitter root, long used in European and North American herbalism to support digestion.'),
    createVariant('Dandelion Root', 'Powder', 18.99, '/images/herbal_powder.webp', 'Herbs', 'Detoxifying powder.'),
    createVariant('Dandelion Root', 'Cut Root', 18.99, '/images/dandelion_root.webp', 'Herbs', 'Bitter detox tea.'),

    createVariant('Yellow Dock', 'Capsules', 23.99, '/images/herbal_capsules.webp', 'Herbs', 'Blood builder and cleanser.'),
    createVariant('Yellow Dock', 'Powder', 19.99, '/images/herbal_powder.webp', 'Herbs', 'Iron-rich blood support.'),

    createVariant('Cascara Sagrada', 'Capsules', 28.99, '/images/herbal_capsules.webp', 'Herbs', 'Traditional stimulant-laxative bark — not for daily use, see the safety note in "The Research" below.'),
    createVariant('Cascara Sagrada', 'Powder', 24.99, '/images/herbal_powder.webp', 'Herbs', 'Traditional stimulant-laxative bark — not for daily use, see the safety note in "The Research" below.'),
    createVariant('Cascara Sagrada', 'Bark', 24.99, '/images/cascara_sagrada.webp', 'Herbs', 'Traditional stimulant-laxative bark — not for daily use, see the safety note in "The Research" below.'),

    createVariant('Valerian Root', 'Capsules', 25.99, '/images/herbal_capsules.webp', 'Herbs', 'Deep sleep support.'),
    createVariant('Valerian Root', 'Root Tea', 25.99, '/images/herbal_tea.webp', 'Herbs', 'Relaxing bedtime tea.'),

    createVariant('Hydrangea Root', 'Capsules', 26.99, '/images/herbal_capsules.webp', 'Herbs', 'Root used historically in Cherokee and Appalachian herbalism for urinary tract wellness — traditional use, not a clinical treatment.'),
    createVariant('Hydrangea Root', 'Powder', 22.99, '/images/herbal_powder.webp', 'Herbs', 'Urinary tract health.'),

    createVariant('Ginger Root', 'Capsules', 19.99, '/images/herbal_capsules.webp', 'Herbs', 'Digestive fire and circulation.'),
    createVariant('Ginger Root', 'Powder', 15.99, '/images/herbal_powder.webp', 'Herbs', 'Warming digestive spice.'),

    createVariant('Elderberry', 'Syrup Kit', 29.99, '/images/elderberry.webp', 'Herbs', 'Make your own immune syrup.'),
    createVariant('Elderberry', 'Dried Berries', 24.99, '/images/elderberry.webp', 'Herbs', 'Immune boosting berries.'),
    createVariant('Elderberry', 'Capsules', 28.99, '/images/herbal_capsules.webp', 'Herbs', 'Daily immune defense.'),

    createVariant('Blue Vervain', 'Loose Tea', 24.99, '/images/herbal_tea.webp', 'Herbs', 'Nervous system relaxant.'),
    createVariant('Blue Vervain', 'Capsules', 27.99, '/images/herbal_capsules.webp', 'Herbs', 'Calming nerve support.'),

    createVariant('Red Clover', 'Blossoms', 22.99, '/images/herbal_tea.webp', 'Herbs', 'Blood purifier tea.'),
    createVariant('Red Clover', 'Capsules', 25.99, '/images/herbal_capsules.webp', 'Herbs', 'Hormonal balance support.'),

    createVariant('Nettle Leaf', 'Tea', 19.99, '/images/herbal_tea.webp', 'Herbs', 'Allergy fighting tea.'),
    createVariant('Nettle Leaf', 'Capsules', 22.99, '/images/herbal_capsules.webp', 'Herbs', 'Nature\'s multivitamin.'),

    createVariant('Raspberry Leaf', 'Tea', 19.99, '/images/herbal_tea.webp', 'Herbs', 'Womb toning tea.'),
    createVariant('Raspberry Leaf', 'Capsules', 22.99, '/images/herbal_capsules.webp', 'Herbs', 'Reproductive health.'),

    createVariant('Mullein Leaf', 'Tea', 21.99, '/images/herbal_tea.webp', 'Herbs', 'Respiratory support tea.'),
    createVariant('Mullein Leaf', 'Capsules', 24.99, '/images/herbal_capsules.webp', 'Herbs', 'Lung clearing support.'),

    createVariant('Guaco', 'Tea', 27.99, '/images/herbal_tea.webp', 'Herbs', 'Tropical lung support.'),

    { name: 'Iron Force', slug: 'iron-force', images: ['/images/herbal_capsules.webp'], price: 44.99, category: 'Supplements', description: 'High-iron herbal blend combining Sarsaparilla and Yellow Dock — two roots long valued in traditional herbalism for their iron content.', stock: 50, type: 'PHYSICAL' },
    { name: 'Brain Food', slug: 'brain-food', images: ['/images/herbal_capsules.webp'], price: 49.99, category: 'Supplements', description: 'Traditional focus blend combining Blue Vervain and Sea Moss, herbs long used to support calm mental clarity.', stock: 50, type: 'PHYSICAL' },
    { name: 'Gut Scrub', slug: 'gut-scrub', images: ['/images/herbal_capsules.webp'], price: 39.99, category: 'Supplements', description: 'Traditional digestive-bitters blend with Cascara Sagrada and Rhubarb Root — potent stimulant herbs meant for occasional use only, not daily. Cascara has documented long-term safety concerns; see "The Research" for details.', stock: 50, type: 'PHYSICAL' },
    { name: 'Lymph Flush', slug: 'lymph-flush', images: ['/images/herbal_capsules.webp'], price: 42.99, category: 'Supplements', description: 'Traditional lymphatic-support blend with Cleavers and Red Clover, herbs long used in folk herbalism for lymphatic and skin wellness.', stock: 50, type: 'PHYSICAL' },
    { name: 'Endo Balance', slug: 'endo-balance', images: ['/images/herbal_capsules.webp'], price: 44.99, category: 'Supplements', description: 'Herbal blend traditionally used to support women\'s cycle-related wellness.', stock: 50, type: 'PHYSICAL' },
    { name: 'Male Vigor', slug: 'male-vigor', images: ['/images/herbal_capsules.webp'], price: 44.99, category: 'Supplements', description: 'Traditional herbal blend associated with vitality and stamina.', stock: 50, type: 'PHYSICAL' },
    { name: 'Kidney flush', slug: 'kidney-flush', images: ['/images/herbal_capsules.webp'], price: 39.99, category: 'Supplements', description: 'Traditional herbal blend with Hydrangea root, long used in folk herbalism to support urinary tract wellness.', stock: 50, type: 'PHYSICAL' },
    { name: 'Sugar Buster', slug: 'sugar-buster', images: ['/images/herbal_capsules.webp'], price: 41.99, category: 'Supplements', description: 'Herbal blend traditionally used to support already-healthy blood sugar levels as part of a balanced diet.', stock: 50, type: 'PHYSICAL' },
    { name: 'Stress Less', slug: 'stress-less', images: ['/images/herbal_capsules.webp'], price: 38.99, category: 'Supplements', description: 'Calming bedtime blend with Valerian and Hops. Valerian has real clinical research behind modest sleep-quality improvements — see "The Research" below. This supports relaxation; it is not a treatment for anxiety disorders.', stock: 50, type: 'PHYSICAL' },
    { name: 'Joint Ease', slug: 'joint-ease', images: ['/images/herbal_capsules.webp'], price: 42.99, category: 'Supplements', description: 'Traditional herbal blend for everyday joint comfort and flexibility.', stock: 50, type: 'PHYSICAL' },

    createVariant('Batana Oil', 'Raw', 34.99, '/images/herbal_oil.webp', 'Oils', 'Traditional Miskito (Honduras) hair oil — real cultural tradition, but clinical hair-growth evidence is still limited.'),
    createVariant('Batana Oil', 'Infused', 39.99, '/images/herbal_oil.webp', 'Oils', 'Infused with Rosemary for extra growth.'),
    createVariant('Black Seed Oil', 'Premium', 29.99, '/images/herbal_oil.webp', 'Oils', 'Cold pressed wellness oil.'),
    createVariant('Black Seed Oil', 'Capsules', 27.99, '/images/herbal_capsules.webp', 'Oils', 'Oil in convenient vegan caps.'),
    createVariant('Hemp Seed Oil', 'Organic', 24.99, '/images/herbal_oil.webp', 'Oils', 'Omega fatty acid rich oil.'),
    createVariant('Castor Oil', 'Black', 19.99, '/images/herbal_oil.webp', 'Oils', 'Thickening oil for hair and lashes.'),
    createVariant('Oregano Oil', 'Wild', 28.99, '/images/herbal_oil.webp', 'Oils', 'Potent antimicrobial oil.'),

    { name: 'The Starter Kit', slug: 'starter-kit', images: ['/images/sea_moss_gold.webp'], price: 69.99, category: 'Bundles', description: 'Sea Moss Gel, Bladderwrack Capsules, and Burdock Tea.', stock: 50, type: 'PHYSICAL' },
    { name: 'Full Body Detox', slug: 'full-body-detox', images: ['/images/herbal_capsules.webp'], price: 149.99, category: 'Bundles', description: 'Gut Scrub, Lymph Flush, and Kidney Flush.', stock: 50, type: 'PHYSICAL' },
    { name: 'Dr. Sebi Essentials', slug: 'dr-sebi-essentials', images: ['/images/sea_moss_gold.webp'], price: 199.99, category: 'Bundles', description: 'All the core alkaline herbs in one mega pack.', stock: 50, type: 'PHYSICAL' },
    { name: 'Hair Growth Max', slug: 'hair-growth-max', images: ['/images/herbal_oil.webp'], price: 89.99, category: 'Bundles', description: 'Batana Oil, Bamboo Tea, and Hair Vigor Capsules.', stock: 50, type: 'PHYSICAL' },
    { name: 'Immune Fortress', slug: 'immune-fortress', images: ['/images/elderberry.webp'], price: 79.99, category: 'Bundles', description: 'Elderberry Syrup, Sea Moss, and Oregano Oil.', stock: 50, type: 'PHYSICAL' },
    { name: 'Iron & Vitality Bundle', slug: 'iron-vitality-bundle', images: ['/images/sarsaparilla.webp'], price: 84.99, category: 'Bundles', description: 'Iron Force, Sarsaparilla, and Yellow Dock — our iron-focused traditional herbs, bundled together.', stock: 50, type: 'PHYSICAL' },
    { name: 'Womb Wellness', slug: 'womb-wellness', images: ['/images/herbal_tea.webp'], price: 94.99, category: 'Bundles', description: 'Raspberry Leaf, Red Clover, and Endo Balance.', stock: 50, type: 'PHYSICAL' },
    { name: 'King\'s Kit', slug: 'kings-kit', images: ['/images/herbal_capsules.webp'], price: 94.99, category: 'Bundles', description: 'Male Vigor, Sea Moss, and Black Seed Oil.', stock: 50, type: 'PHYSICAL' },
    { name: 'Alkaline Kitchen', slug: 'alkaline-kitchen', images: ['/images/irish_moss.webp'], price: 129.99, category: 'Bundles', description: 'Spelt Flour, Fonio, Sea Moss Powder, and Agave.', stock: 50, type: 'PHYSICAL' },
    { name: 'Fast & Cleanse', slug: 'fast-and-cleanse', images: ['/images/cascara_sagrada.webp'], price: 109.99, category: 'Bundles', description: 'Everything you need for a 7-day fast.', stock: 50, type: 'PHYSICAL' },

    createVariant('Fonio', 'Grain', 14.99, '/images/herbal_powder.webp', 'Pantry', 'Ancient African alkaline grain.'),
    createVariant('Kamut', 'Flour', 12.99, '/images/herbal_powder.webp', 'Pantry', 'Ancient wheat flour for baking.'),
    createVariant('Spelt', 'Flour', 12.99, '/images/herbal_powder.webp', 'Pantry', 'Nutty alkaline flour.'),
    createVariant('Teff', 'Grain', 13.99, '/images/herbal_powder.webp', 'Pantry', 'Tiny grain, huge nutrition.'),
    createVariant('Chickpea', 'Flour', 9.99, '/images/herbal_powder.webp', 'Pantry', 'Versatile gluten-free flour.'),
    createVariant('Date Sugar', 'Raw', 15.99, '/images/herbal_powder.webp', 'Pantry', 'Natural alkaline sweetener.'),
    createVariant('Agave Syrup', 'Raw', 12.99, '/images/herbal_oil.webp', 'Pantry', 'Low glycemic sweetener.'),
    createVariant('Walnut', 'Butter', 16.99, '/images/herbal_powder.webp', 'Pantry', 'Rich alkaline nut butter.'),
];

const extraHerbs = ['Chaparral', 'Nopal', 'Sage', 'Thyme', 'Oregano', 'Basil', 'Dill', 'Cilantro', 'Parsley', 'Savory', 'Tarragon', 'Marjoram'];
extraHerbs.forEach(herb => {
    products.push(createVariant(herb, 'Capsules', 21.99, '/images/herbal_capsules.webp', 'Herbs', 'Alkaline herbal support.'));
    products.push(createVariant(herb, 'Tea', 18.99, '/images/herbal_tea.webp', 'Herbs', 'Rejuvenating herbal tea.'));
});

async function main() {
    console.log(`Seeding database...`);

    // Create Admin User. Credentials are configurable via env so production
    // deployments do not ship with a known default password.
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@blackmossandherbs.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Hectic2024!';
    if (!process.env.ADMIN_PASSWORD) {
        console.warn('⚠ ADMIN_PASSWORD not set — using the default password. Change it before going live.');
    }
    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!existingAdmin) {
        console.log('Creating admin user...');
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await prisma.user.create({
            data: {
                email: adminEmail,
                name: 'Black Moss Admin',
                password: hashedPassword,
                role: 'ADMIN',
            }
        });
    }

    // Subscription plans mirror the static display data on /subscriptions —
    // keep name/price/features in sync with src/app/subscriptions/page.tsx.
    const subscriptionPlans = [
        {
            stripePriceId: process.env.STRIPE_PRICE_STARTER,
            name: 'Wellness Starter',
            description: 'Perfect for those beginning their herbal wellness journey',
            price: 29.99,
            interval: 'month',
            features: ['1 premium product per month', '10% discount on all purchases', 'Free shipping on subscription', 'Access to member-only content', 'Monthly wellness newsletter'],
        },
        {
            stripePriceId: process.env.STRIPE_PRICE_PLUS,
            name: 'Wellness Plus',
            description: 'Our most popular plan for dedicated wellness enthusiasts',
            price: 54.99,
            interval: 'month',
            features: ['2 premium products per month', '20% discount on all purchases', 'Free shipping on all orders', 'Priority customer support', 'Access to exclusive products', 'Monthly wellness consultation', 'Member-only workshops'],
        },
        {
            stripePriceId: process.env.STRIPE_PRICE_PRO,
            name: 'Wellness Pro',
            description: 'Complete wellness solution for optimal health',
            price: 89.99,
            interval: 'month',
            features: ['4 premium products per month', '30% discount on all purchases', 'Free express shipping', 'Dedicated wellness advisor', 'Custom product recommendations', 'Quarterly health assessments', 'VIP access to new products', 'Exclusive community access'],
        },
    ];

    console.log('Seeding subscription plans...');
    for (const plan of subscriptionPlans) {
        if (!plan.stripePriceId) {
            console.warn(`⚠ Skipping "${plan.name}" — its STRIPE_PRICE_* env var is not set.`);
            continue;
        }
        await prisma.subscriptionPlan.upsert({
            where: { stripePriceId: plan.stripePriceId },
            update: plan,
            create: plan,
        });
    }

    console.log(`Seeding ${products.length} products...`);

    try {
        await prisma.product.deleteMany({});
    } catch (e) {
        console.log('Delete failed (maybe table empty), continuing...');
    }

    const createdSkus = new Set();
    for (const p of products) {
        let slug = p.slug;
        if (createdSkus.has(slug)) {
            slug = `${slug}-${Math.floor(Math.random() * 1000)}`;
        }
        createdSkus.add(slug);

        await prisma.product.create({
            data: {
                name: p.name,
                slug: slug,
                description: p.description,
                price: p.price,
                images: p.images,
                category: p.category,
                stock: p.stock,
                type: p.type,
                active: true,
                featured: p.featured || false,
            },
        });
    }

    console.log('Seed completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
