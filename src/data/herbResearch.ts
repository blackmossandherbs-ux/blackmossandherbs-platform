/**
 * Black Moss & Herbs Platform - Herb Research Library
 *
 * Real, checkable sources for the herbs we sell — spanning the Caribbean,
 * West Africa, the Mediterranean, the Middle East, East Asia, and beyond.
 * This is the opposite of a single-market claim: every entry below is
 * something a customer anywhere in the world can look up themselves.
 *
 * Rules for adding an entry: only cite a study that was actually found and
 * read. If evidence is thin or mixed, say so. If there's a real safety
 * concern, lead with it — that's the whole point of this file.
 */

export interface Citation {
    label: string
    url: string
}

export interface HerbResearch {
    origin: string
    summary: string
    citations: Citation[]
    safetyNote?: string
}

export const HERB_RESEARCH: Record<string, HerbResearch> = {
    'sea moss': {
        origin: 'Atlantic coastlines — the Caribbean, Ireland, and Canada\'s Maritimes',
        summary:
            'Chondrus crispus (Irish/sea moss) is a genuinely mineral-dense seaweed, and a 2024 review in Marine Drugs found real antioxidant and anticoagulant compounds in it. But it is also naturally high in iodine — one honest serving can carry close to double the daily safe upper limit — so "more is better" is not correct for this ingredient.',
        citations: [
            { label: 'Marine Drugs (2024) — seaweed bioactive compound review, PMC', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11595611/' },
            { label: 'Sea Moss Gel: iodine & thyroid evidence review', url: 'https://superpower.com/guides/emerging-health-topics/sea-moss-gel-evidence-iodine-thyroid' },
            { label: 'Cleveland Clinic — Sea Moss: potential benefits and limits', url: 'https://health.clevelandclinic.org/sea-moss-benefits' },
        ],
        safetyNote:
            'High iodine content can suppress thyroid function in some people (the Wolff-Chaikoff effect), especially with daily use or existing thyroid conditions, and pregnant/breastfeeding people should be cautious. If you take thyroid medication, talk to your doctor before adding sea moss daily.',
    },
    'bladderwrack': {
        origin: 'North Atlantic and North Sea coastlines',
        summary:
            'Bladderwrack is another iodine-rich seaweed. Combining it with sea moss compounds the same iodine consideration above rather than adding a separate benefit.',
        citations: [
            { label: 'OPSS — Sea moss & seaweed in dietary supplements', url: 'https://www.opss.org/article/sea-moss-dietary-supplements' },
        ],
        safetyNote: 'Stacking bladderwrack with sea moss increases total iodine intake — check the combined amount if you use both daily.',
    },
    'burdock': {
        origin: 'East Asia, historically naturalised across Europe and North America',
        summary:
            'Arctium lappa (burdock root) has real clinical evidence: a six-week human trial gave burdock root tea to adults with knee osteoarthritis and measured a significant drop in inflammatory markers (IL-6, hs-CRP) versus baseline. Lab studies also back its antioxidant activity, and the European Medicines Agency lists the root as a traditional aid for skin conditions.',
        citations: [
            { label: 'PMC — Burdock root tea & osteoarthritis inflammatory markers', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12523641/' },
            { label: 'PMC — Antioxidant activity of Arctium lappa root extracts', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3073957/' },
            { label: 'ScienceDirect — Arctium lappa pharmacology & clinical review', url: 'https://www.sciencedirect.com/science/article/pii/S0753332222014937' },
        ],
    },
    'elderberry': {
        origin: 'Traditional use across Europe, and commercialised research out of Australia and Israel',
        summary:
            'One of the better-studied herbs on this site. A 2016 randomized, double-blind, placebo-controlled trial of 312 long-haul air travellers found elderberry extract cut cold duration by roughly two days and reduced symptom severity. Earlier Israeli trials on the Sambucol formulation reported similar reductions during flu outbreaks.',
        citations: [
            { label: 'Nutrients (2016) — Elderberry RCT in air travellers', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4848651/' },
            { label: 'PubMed — same trial, QUT (Australia)', url: 'https://pubmed.ncbi.nlm.nih.gov/27023596/' },
        ],
    },
    'black seed': {
        origin: 'Native to the Mediterranean, North Africa, and South/Southwest Asia — a staple of Middle Eastern, Ayurvedic, and Unani traditional medicine for millennia',
        summary:
            'Nigella sativa has one of the largest modern clinical-trial bodies of any herb here. Meta-analyses of RCTs report modest reductions in blood pressure (roughly 3mmHg systolic) and improvements in inflammatory and cardiometabolic markers in people with prediabetes/type 2 diabetes. Effects are real but modest — this supports an already-healthy routine, it does not replace medical treatment.',
        citations: [
            { label: 'PubMed — meta-analysis, Nigella sativa & blood pressure', url: 'https://pubmed.ncbi.nlm.nih.gov/27512971/' },
            { label: 'ScienceDirect — meta-analysis, cardiometabolic indices in type 2 diabetes', url: 'https://www.sciencedirect.com/science/article/pii/S0965229925000494' },
            { label: 'PMC — meta-analysis, inflammation & oxidative stress markers', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7225850/' },
        ],
    },
    'valerian': {
        origin: 'Traditional European herbalism, formally recognised by Germany\'s Commission E',
        summary:
            'A systematic review of 16 randomized, placebo-controlled trials (1,093 people) found valerian improved subjective sleep quality when taken nightly for one to two weeks, with a low rate of side effects. The effect size is modest and evidence quality is mixed across studies — it is a mild traditional sleep aid, not a sedative-strength treatment.',
        citations: [
            { label: 'American Journal of Medicine — Valerian for Sleep, systematic review & meta-analysis', url: 'https://www.amjmed.com/article/S0002-9343(06)00275-0/pdf' },
            { label: 'AAFP — Valerian evidence summary', url: 'https://www.aafp.org/pubs/afp/issues/2003/0415/p1755.html' },
        ],
    },
    'nettle': {
        origin: 'Temperate regions worldwide; long used in European, North African, and North American herbalism',
        summary:
            'Nettle leaf is genuinely nutrient-dense — real mineral-content research shows meaningful calcium, iron, and B-vitamin levels. A randomized, double-blind, placebo-controlled trial of nettle root extract in 74 people with allergic rhinitis found a significant improvement in symptom scores.',
        citations: [
            { label: 'PMC — Nettle root RCT for allergic rhinitis', url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5963652/' },
            { label: 'Wiley — Mineral properties & dietary value of stinging nettle', url: 'https://onlinelibrary.wiley.com/doi/10.1155/2013/857120' },
        ],
    },
    'cascara sagrada': {
        origin: 'Pacific coast of North America; used traditionally by Indigenous communities before entering Western herbalism',
        summary:
            'Cascara sagrada is a genuine stimulant laxative bark with a long traditional-use history — and a real, documented safety record that matters. In 2002 the FDA reclassified cascara (along with aloe) as not proven safe and effective for over-the-counter laxative use, citing concerns including liver toxicity and electrolyte loss with extended use.',
        citations: [
            { label: 'MSK Cancer Center — FDA rules on aloe & cascara as stimulant laxatives', url: 'https://www.mskcc.org/cancer-care/diagnosis-treatment/symptom-management/integrative-medicine/herbs/news-alerts/fda-rules-aloe-cascara-are-not-safe-stimulant-laxatives' },
            { label: 'People\'s Pharmacy — cascara sagrada and laxative dependence', url: 'https://www.peoplespharmacy.com/articles/cascara-sagrada-use-may-lead-to-laxative-dependence' },
        ],
        safetyNote:
            'Not for daily or long-term use. The FDA withdrew approval for cascara as an OTC laxative in 2002 over liver-toxicity and electrolyte-loss concerns with extended use. Traditional occasional use only, and speak to a doctor before regular use.',
    },
    'batana': {
        origin: 'Miskito Coast, Honduras — Central America',
        summary:
            'Batana oil (Elaeis oleifera) has a genuine, deep-rooted tradition among the Miskito people of Honduras for hair and scalp care. What it doesn\'t have yet is strong published clinical-trial evidence for hair growth specifically — most of what circulates online is anecdotal. We sell it because the tradition is real, not because we found a clinical trial that proves regrowth.',
        citations: [],
    },
}

const CATEGORY_FALLBACK: Record<string, HerbResearch> = {
    Herbs: {
        origin: 'Sourced from traditional herbal-use regions worldwide — West Africa, the Caribbean, the Mediterranean, and beyond',
        summary:
            'This herb is part of long-standing traditional herbal practice. We have not attached a specific clinical citation to it yet — where we have real published research, you will see it listed directly on the product.',
        citations: [],
    },
    Oils: {
        origin: 'Sourced from traditional oil-producing regions worldwide',
        summary: 'This oil is part of long-standing traditional use. Clinical trial evidence for cosmetic/topical herbal oils is generally limited industry-wide.',
        citations: [],
    },
    Pantry: {
        origin: 'Ancient food staples from Africa and the Mediterranean',
        summary: 'A traditional whole-food staple rather than a treated "wellness" ingredient — valued for what it is, not for an unverified health claim.',
        citations: [],
    },
}

export function getResearchForProduct(name: string, category: string): HerbResearch | null {
    const lower = name.toLowerCase()
    const key = Object.keys(HERB_RESEARCH).find((k) => lower.includes(k))
    if (key) return HERB_RESEARCH[key]
    return CATEGORY_FALLBACK[category] ?? null
}
