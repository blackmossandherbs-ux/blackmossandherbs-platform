/**
 * MHRA compliance cleanup for product copy.
 * Rewrites flowery / medical-claim descriptions stored in the DB to
 * food-supplement-safe language. Deterministic (no API calls). Idempotent.
 */
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// --- Template prefix rewrites (the 4 seeded "voice" intros) ---
const templateRules = [
    {
        // "Experience the concentrated frequency of sacred botanical restoration. This X is meticulously
        //  wild-crafted and alkaline-aligned according to Dr. Sebi standards. Potent biological enrichment
        //  for the modern alchemist."
        re: /Experience the concentrated frequency of sacred botanical restoration\.\s*This .+? is meticulously wild-crafted and alkaline-aligned according to Dr\. Sebi standards\.\s*Potent biological enrichment for the modern alchemist\./i,
        to: 'Wildcrafted and naturally prepared as part of our traditional botanical range. A quality food supplement to complement a balanced lifestyle.',
    },
    {
        // "The gold standard of mineral restoration. Our wildcrafted X is harvested from pristine Atlantic
        //  waters and meticulously prepared to retain 92 essential minerals. Specifically formulated for
        //  cellular hydration and systemic thyroid support."
        re: /The gold standard of mineral restoration\.\s*Our wildcrafted (.+?) is harvested from pristine Atlantic waters and meticulously prepared to retain 92 essential minerals\.\s*Specifically formulated for cellular hydration and systemic thyroid support\./i,
        to: 'Our wildcrafted $1 is harvested from clean Atlantic waters and carefully prepared to retain its naturally occurring 92 trace minerals. A nutrient-rich food supplement for your everyday routine.',
    },
    {
        // "Liquid restoration for the external temple. This X is extracted using cold-press technology to
        //  preserve high-frequency fatty acids and botanical nutrients. Sacred nourishment for skin and
        //  hair vitality."
        re: /Liquid restoration for the external temple\.\s*This (.+?) is extracted using cold-press technology to preserve high-frequency fatty acids and botanical nutrients\.\s*Sacred nourishment for skin and hair vitality\./i,
        to: 'Our $1 is cold-pressed to preserve its naturally occurring fatty acids and botanical nutrients. For external use as part of your skin and hair care routine.',
    },
    {
        // "Clean fuel for the alkaline transition. This X is a non-hybrid, high-frequency alternative to
        //  modern processed foods. Sustain your biological restoration with ancient nutritional authority."
        re: /Clean fuel for the alkaline transition\.\s*This (.+?) is a non-hybrid, high-frequency alternative to modern processed foods\.\s*Sustain your biological restoration with ancient nutritional authority\./i,
        to: 'A naturally sourced, non-hybrid $1 for your wholefood pantry — a traditional alternative to modern processed staples.',
    },
]

// --- Exact short-description rewrites (claim-y bundle/formula taglines) ---
const phraseMap = {
    'Deep colon cleanse with Cascara and Rhubarb Root.': 'A traditional herbal blend with Cascara and Rhubarb Root to support digestive comfort.',
    'Lymphatic drainage formula with Cleavers and red Clover.': 'A traditional herbal blend with Cleavers and Red Clover.',
    'Testosterone and stamina support.': "A men's wellness blend to support an active lifestyle.",
    'Hormonal regulation for women.': "A women's wellness blend to support everyday balance.",
    'Anxiety relief with Valerian and Hops.': 'A calming herbal blend with Valerian and Hops to support relaxation.',
    'Blood sugar regulation support.': 'A herbal blend to complement a balanced diet.',
    'Kidney filtration support with Hydrangea.': 'A traditional herbal blend with Hydrangea.',
    'Inflammation reduction for joints.': 'A herbal blend to support joint comfort and an active lifestyle.',
    'Mental clarity and focus with Blue Vervain and Sea Moss.': 'A herbal blend with Blue Vervain and Sea Moss to support focus.',
    'Everything you need for a 7-day fast.': 'A curated bundle to support a 7-day wholefood reset.',
    'Gut Scrub, Lymph Flush, and Kidney Flush.': 'Gut, lymph, and kidney herbal support bundle.',
}

// --- Residual banned-word sweep (whole word, case-insensitive) ---
const bannedSweep = [
    [/Dr\.?\s*Sebi'?s?\s+standards/gi, 'traditional methods'],
    [/Dr\.?\s*Sebi/gi, 'traditional herbalism'],
    [/\balchemist\b/gi, 'herbalist'],
    [/\bsacred\b/gi, 'natural'],
    [/\bhealing\b/gi, 'wellness'],
    [/\bcures\b/gi, 'supports'],
    [/\bcure\b/gi, 'support'],
    [/\bdetoxifying\b/gi, 'cleansing'],
    [/\bdetoxif\w*/gi, 'cleansing'],
    [/\bdetox\w*/gi, 'reset'],
    [/\bcolon cleanse\b/gi, 'digestive comfort'],
]

// --- Product name rewrites (claim words in names) ---
const nameMap = {
    'Full Body Detox': 'Full Body Reset Bundle',
    'Fast & Cleanse': 'Fast & Reset Bundle',
}

function cleanText(text) {
    let out = text
    for (const rule of templateRules) out = out.replace(rule.re, rule.to)
    if (phraseMap[out.trim()]) out = phraseMap[out.trim()]
    for (const [re, rep] of bannedSweep) out = out.replace(re, rep)
    out = out.replace(/\s+/g, ' ').trim()
    // Sentence-case: capitalise the first letter after each sentence end.
    out = out.replace(/(^|[.!?]\s+)([a-z])/g, (_, sep, ch) => sep + ch.toUpperCase())
    return out
}

async function main() {
    const products = await prisma.product.findMany()
    let changed = 0

    for (const p of products) {
        const newDesc = cleanText(p.description)
        const newName = nameMap[p.name] || p.name
        if (newDesc !== p.description || newName !== p.name) {
            await prisma.product.update({
                where: { id: p.id },
                data: { description: newDesc, name: newName },
            })
            changed++
        }
    }
    console.log(`✓ Cleaned ${changed} of ${products.length} products`)

    // Verify nothing banned remains
    const remaining = await prisma.product.findMany({
        where: {
            OR: [
                { description: { contains: 'Sebi', mode: 'insensitive' } },
                { description: { contains: 'alchemist', mode: 'insensitive' } },
                { description: { contains: 'sacred', mode: 'insensitive' } },
                { description: { contains: 'healing', mode: 'insensitive' } },
                { description: { contains: 'detox', mode: 'insensitive' } },
            ],
        },
        select: { name: true },
    })
    if (remaining.length) {
        console.log(`⚠ ${remaining.length} still contain flagged terms:`, remaining.map(r => r.name).join(', '))
    } else {
        console.log('✓ No flagged terms remain in any product description')
    }
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
