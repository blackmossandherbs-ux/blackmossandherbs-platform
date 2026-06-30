
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// Helper to create variations
function createVariant(baseName, type, price, image, category, benefits) {
    const descriptions = {
        'Sea Moss': `Our wildcrafted ${baseName} in ${type} form is harvested from clean Atlantic waters and carefully prepared to retain its naturally occurring 92 trace minerals. A nutrient-rich food supplement for your everyday routine.`,
        'Herbs': `Wildcrafted and naturally prepared as part of our traditional botanical range. A quality food supplement to complement a balanced lifestyle.`,
        'Supplements': `Our ${baseName} is wildcrafted and naturally prepared as part of our traditional botanical range, to complement a balanced lifestyle.`,
        'Oils': `This ${baseName} is cold-pressed to preserve its naturally occurring fatty acids and botanical nutrients. A natural choice for skin and hair.`,
        'Bundles': `A curated set of our wildcrafted botanicals, brought together to complement a balanced lifestyle.`,
        'Pantry': `This ${baseName} ${type} is a wholesome, naturally prepared pantry staple to complement a balanced lifestyle.`
    };

    const finalDescription = descriptions[category] || `Premium ${baseName} ${type}. ${benefits} Wildcrafted and naturally prepared as part of our traditional botanical range.`;

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
    createVariant('Sea Moss Gold', 'Gel', 29.99, '/images/sea_moss_gold.webp', 'Sea Moss', 'Contains 92 naturally occurring trace minerals.'),
    createVariant('Purple Sea Moss', 'Gel', 34.99, '/images/sea_moss_purple.webp', 'Sea Moss', 'Rich in anthocyanins and antioxidants.'),
    createVariant('Full Spectrum Sea Moss', 'Gel', 39.99, '/images/sea_moss_gold.webp', 'Sea Moss', 'A full-spectrum Gold, Purple and Green blend.'),
    createVariant('Sea Moss & Bladderwrack', 'Gel', 32.99, '/images/sea_moss_gold.webp', 'Sea Moss', 'A classic wildcrafted pairing.'),
    createVariant('Sea Moss & Burdock', 'Gel', 32.99, '/images/sea_moss_gold.webp', 'Sea Moss', 'A traditional herbal blend.'),
    createVariant('Sea Moss & Elderberry', 'Gel', 34.99, '/images/sea_moss_purple.webp', 'Sea Moss', 'A wildcrafted botanical blend.'),
    createVariant('Mango Infused Sea Moss', 'Gel', 34.99, '/images/sea_moss_gold.webp', 'Sea Moss', 'Tropical flavor with mineral benefits.'),
    createVariant('Strawberry Infused Sea Moss', 'Gel', 34.99, '/images/sea_moss_purple.webp', 'Sea Moss', 'A berry-rich antioxidant blend.'),

    createVariant('Sea Moss', 'Capsules', 24.99, '/images/herbal_capsules.webp', 'Sea Moss', 'Convenient daily mineral intake.'),
    createVariant('Purple Sea Moss', 'Capsules', 29.99, '/images/herbal_capsules.webp', 'Sea Moss', 'Antioxidant rich capsules.'),
    createVariant('Sea Moss & Bladderwrack', 'Capsules', 27.99, '/images/herbal_capsules.webp', 'Sea Moss', 'A wildcrafted sea moss and bladderwrack pairing.'),
    createVariant('Sea Moss & Burdock', 'Capsules', 27.99, '/images/herbal_capsules.webp', 'Sea Moss', 'Traditionally used in herbal traditions.'),

    createVariant('Sea Moss Gold', 'Raw', 24.99, '/images/sea_moss_gold.webp', 'Sea Moss', 'Make your own gel at home.'),
    createVariant('Purple Sea Moss', 'Raw', 29.99, '/images/sea_moss_purple.webp', 'Sea Moss', 'Premium raw purple moss.'),
    createVariant('Irish Moss', 'Powder', 22.99, '/images/irish_moss.webp', 'Sea Moss', 'Versatile superfood powder.'),

    createVariant('Burdock Root', 'Capsules', 24.99, '/images/herbal_capsules.webp', 'Herbs', 'Traditionally used in herbal traditions.'),
    createVariant('Burdock Root', 'Powder', 19.99, '/images/herbal_powder.webp', 'Herbs', 'Loose powder for teas and smoothies.'),
    createVariant('Burdock Root', 'Cut Root', 19.99, '/images/burdock_root.webp', 'Herbs', 'Traditional tea root.'),

    createVariant('Sarsaparilla', 'Capsules', 26.99, '/images/herbal_capsules.webp', 'Herbs', 'A naturally iron-rich herb.'),
    createVariant('Sarsaparilla', 'Powder', 21.99, '/images/herbal_powder.webp', 'Herbs', 'Iron-rich powder supplement.'),
    createVariant('Sarsaparilla', 'Cut Root', 21.99, '/images/sarsaparilla.webp', 'Herbs', 'Traditional iron tonic tea.'),

    createVariant('Dandelion Root', 'Capsules', 22.99, '/images/herbal_capsules.webp', 'Herbs', 'Traditionally used in herbal traditions.'),
    createVariant('Dandelion Root', 'Powder', 18.99, '/images/herbal_powder.webp', 'Herbs', 'A traditional herbal powder.'),
    createVariant('Dandelion Root', 'Cut Root', 18.99, '/images/dandelion_root.webp', 'Herbs', 'A traditional bitter herbal tea.'),

    createVariant('Yellow Dock', 'Capsules', 23.99, '/images/herbal_capsules.webp', 'Herbs', 'Traditionally used in herbal traditions.'),
    createVariant('Yellow Dock', 'Powder', 19.99, '/images/herbal_powder.webp', 'Herbs', 'A naturally iron-rich herb.'),

    createVariant('Cascara Sagrada', 'Capsules', 28.99, '/images/herbal_capsules.webp', 'Herbs', 'Traditionally used in herbal traditions.'),
    createVariant('Cascara Sagrada', 'Powder', 24.99, '/images/herbal_powder.webp', 'Herbs', 'A traditional digestive herb.'),
    createVariant('Cascara Sagrada', 'Bark', 24.99, '/images/cascara_sagrada.webp', 'Herbs', 'A traditional botanical bark.'),

    createVariant('Valerian Root', 'Capsules', 25.99, '/images/herbal_capsules.webp', 'Herbs', 'A calming bedtime herb.'),
    createVariant('Valerian Root', 'Root Tea', 25.99, '/images/herbal_tea.webp', 'Herbs', 'Relaxing bedtime tea.'),

    createVariant('Hydrangea Root', 'Capsules', 26.99, '/images/herbal_capsules.webp', 'Herbs', 'Traditionally used in herbal traditions.'),
    createVariant('Hydrangea Root', 'Powder', 22.99, '/images/herbal_powder.webp', 'Herbs', 'Traditionally used in herbal traditions.'),

    createVariant('Ginger Root', 'Capsules', 19.99, '/images/herbal_capsules.webp', 'Herbs', 'A warming culinary herb.'),
    createVariant('Ginger Root', 'Powder', 15.99, '/images/herbal_powder.webp', 'Herbs', 'Warming digestive spice.'),

    createVariant('Elderberry', 'Syrup Kit', 29.99, '/images/elderberry.webp', 'Herbs', 'Make your own herbal syrup at home.'),
    createVariant('Elderberry', 'Dried Berries', 24.99, '/images/elderberry.webp', 'Herbs', 'Antioxidant-rich berries.'),
    createVariant('Elderberry', 'Capsules', 28.99, '/images/herbal_capsules.webp', 'Herbs', 'Part of a balanced daily routine.'),

    createVariant('Blue Vervain', 'Loose Tea', 24.99, '/images/herbal_tea.webp', 'Herbs', 'A traditional calming herb.'),
    createVariant('Blue Vervain', 'Capsules', 27.99, '/images/herbal_capsules.webp', 'Herbs', 'A traditional calming herb.'),

    createVariant('Red Clover', 'Blossoms', 22.99, '/images/herbal_tea.webp', 'Herbs', 'A traditional herbal tea.'),
    createVariant('Red Clover', 'Capsules', 25.99, '/images/herbal_capsules.webp', 'Herbs', 'Traditionally used in herbal traditions.'),

    createVariant('Nettle Leaf', 'Tea', 19.99, '/images/herbal_tea.webp', 'Herbs', 'A traditional herbal tea.'),
    createVariant('Nettle Leaf', 'Capsules', 22.99, '/images/herbal_capsules.webp', 'Herbs', 'Nature\'s multivitamin.'),

    createVariant('Raspberry Leaf', 'Tea', 19.99, '/images/herbal_tea.webp', 'Herbs', 'A traditional herbal tea.'),
    createVariant('Raspberry Leaf', 'Capsules', 22.99, '/images/herbal_capsules.webp', 'Herbs', 'Traditionally used in herbal traditions.'),

    createVariant('Mullein Leaf', 'Tea', 21.99, '/images/herbal_tea.webp', 'Herbs', 'A traditional herbal tea.'),
    createVariant('Mullein Leaf', 'Capsules', 24.99, '/images/herbal_capsules.webp', 'Herbs', 'Traditionally used in herbal traditions.'),

    createVariant('Guaco', 'Tea', 27.99, '/images/herbal_tea.webp', 'Herbs', 'A tropical botanical.'),

    { name: 'Iron Force', slug: 'iron-force', images: ['/images/herbal_capsules.webp'], price: 44.99, category: 'Supplements', description: 'Maximum iron absorption formula with Sarsaparilla and Yellow Dock.', stock: 50, type: 'PHYSICAL' },
    { name: 'Focus Herbal Blend', slug: 'focus-herbal-blend', images: ['/images/herbal_capsules.webp'], price: 49.99, category: 'Supplements', description: 'A herbal blend with Blue Vervain and Sea Moss.', stock: 50, type: 'PHYSICAL' },
    { name: 'Gut Herbal Blend', slug: 'gut-herbal-blend', images: ['/images/herbal_capsules.webp'], price: 39.99, category: 'Supplements', description: 'A traditional herbal blend with Cascara and Rhubarb Root.', stock: 50, type: 'PHYSICAL' },
    { name: 'Cleavers & Red Clover Blend', slug: 'cleavers-red-clover-blend', images: ['/images/herbal_capsules.webp'], price: 42.99, category: 'Supplements', description: 'A traditional herbal blend with Cleavers and Red Clover.', stock: 50, type: 'PHYSICAL' },
    { name: 'Women's Balance Blend', slug: 'womens-balance-blend', images: ['/images/herbal_capsules.webp'], price: 44.99, category: 'Supplements', description: "A women's wellness blend to support everyday balance.", stock: 50, type: 'PHYSICAL' },
    { name: 'Men's Wellness Blend', slug: 'mens-wellness-blend', images: ['/images/herbal_capsules.webp'], price: 44.99, category: 'Supplements', description: "A men's wellness blend to support an active lifestyle.", stock: 50, type: 'PHYSICAL' },
    { name: 'Hydrangea Herbal Blend', slug: 'hydrangea-herbal-blend', images: ['/images/herbal_capsules.webp'], price: 39.99, category: 'Supplements', description: 'A traditional herbal blend with Hydrangea.', stock: 50, type: 'PHYSICAL' },
    { name: 'Balance Herbal Blend', slug: 'balance-herbal-blend', images: ['/images/herbal_capsules.webp'], price: 41.99, category: 'Supplements', description: 'A herbal blend to complement a balanced diet.', stock: 50, type: 'PHYSICAL' },
    { name: 'Stress Less', slug: 'stress-less', images: ['/images/herbal_capsules.webp'], price: 38.99, category: 'Supplements', description: 'A calming herbal blend with Valerian and Hops.', stock: 50, type: 'PHYSICAL' },
    { name: 'Active Life Blend', slug: 'active-life-blend', images: ['/images/herbal_capsules.webp'], price: 42.99, category: 'Supplements', description: 'A herbal blend to support joint comfort and an active lifestyle.', stock: 50, type: 'PHYSICAL' },

    createVariant('Batana Oil', 'Raw', 34.99, '/images/herbal_oil.webp', 'Oils', 'A prized botanical oil from Honduras.'),
    createVariant('Batana Oil', 'Infused', 39.99, '/images/herbal_oil.webp', 'Oils', 'Infused with rosemary.'),
    createVariant('Black Seed Oil', 'Premium', 29.99, '/images/herbal_oil.webp', 'Oils', 'Cold pressed cure-all.'),
    createVariant('Black Seed Oil', 'Capsules', 27.99, '/images/herbal_capsules.webp', 'Oils', 'Oil in convenient vegan caps.'),
    createVariant('Hemp Seed Oil', 'Organic', 24.99, '/images/herbal_oil.webp', 'Oils', 'Omega fatty acid rich oil.'),
    createVariant('Castor Oil', 'Black', 19.99, '/images/herbal_oil.webp', 'Oils', 'Thickening oil for hair and lashes.'),
    createVariant('Oregano Oil', 'Wild', 28.99, '/images/herbal_oil.webp', 'Oils', 'A potent botanical oil.'),

    { name: 'The Starter Kit', slug: 'starter-kit', images: ['/images/sea_moss_gold.webp'], price: 69.99, category: 'Bundles', description: 'Sea Moss Gel, Bladderwrack Capsules, and Burdock Tea.', stock: 50, type: 'PHYSICAL' },
    { name: 'Herbal Reset Bundle', slug: 'herbal-reset-bundle', images: ['/images/herbal_capsules.webp'], price: 149.99, category: 'Bundles', description: 'Gut Herbal Blend, Cleavers & Red Clover Blend, and Hydrangea Herbal Blend.', stock: 50, type: 'PHYSICAL' },
    { name: 'Dr. Sebi Essentials', slug: 'dr-sebi-essentials', images: ['/images/sea_moss_gold.webp'], price: 199.99, category: 'Bundles', description: 'All the core alkaline herbs in one mega pack.', stock: 50, type: 'PHYSICAL' },
    { name: 'Hair & Scalp Bundle', slug: 'hair-scalp-bundle', images: ['/images/herbal_oil.webp'], price: 89.99, category: 'Bundles', description: 'Batana Oil, Bamboo Tea, and Hair Vigor Capsules.', stock: 50, type: 'PHYSICAL' },
    { name: 'Elderberry & Sea Moss Bundle', slug: 'elderberry-sea-moss-bundle', images: ['/images/elderberry.webp'], price: 79.99, category: 'Bundles', description: 'Elderberry Syrup, Sea Moss, and Oregano Oil.', stock: 50, type: 'PHYSICAL' },
    { name: 'Anemia Fighter', slug: 'anemia-fighter', images: ['/images/sarsaparilla.webp'], price: 84.99, category: 'Bundles', description: 'Iron Force, Sarsaparilla, and Yellow Dock.', stock: 50, type: 'PHYSICAL' },
    { name: 'Women's Wellness Bundle', slug: 'womens-wellness-bundle', images: ['/images/herbal_tea.webp'], price: 94.99, category: 'Bundles', description: "Raspberry Leaf, Red Clover, and Women's Balance Blend.", stock: 50, type: 'PHYSICAL' },
    { name: 'Men's Wellness Kit', slug: 'mens-wellness-kit', images: ['/images/herbal_capsules.webp'], price: 94.99, category: 'Bundles', description: "Men's Wellness Blend, Sea Moss, and Black Seed Oil.", stock: 50, type: 'PHYSICAL' },
    { name: 'Alkaline Kitchen', slug: 'alkaline-kitchen', images: ['/images/irish_moss.webp'], price: 129.99, category: 'Bundles', description: 'Spelt Flour, Fonio, Sea Moss Powder, and Agave.', stock: 50, type: 'PHYSICAL' },
    { name: 'Fasting Support Bundle', slug: 'fasting-support-bundle', images: ['/images/cascara_sagrada.webp'], price: 109.99, category: 'Bundles', description: 'Everything you need for a 7-day fast.', stock: 50, type: 'PHYSICAL' },

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
    products.push(createVariant(herb, 'Capsules', 21.99, '/images/herbal_capsules.webp', 'Herbs', 'A traditional herbal supplement.'));
    products.push(createVariant(herb, 'Tea', 18.99, '/images/herbal_tea.webp', 'Herbs', 'Healing herbal tea.'));
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
