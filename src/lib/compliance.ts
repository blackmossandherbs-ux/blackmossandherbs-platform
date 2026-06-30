/**
 * UK compliance layer — content sanitisation and disclaimer text.
 * All language is aligned with MHRA food supplement guidelines.
 */

export const HIGH_RISK_TERMS = [
    'cure', 'treat', 'diagnose', 'healing', 'medicine',
    'doctor', 'prescription', 'disease', 'chronic', 'cancer',
    'detox', 'cleanse', 'antiviral', 'antibacterial', 'antimicrobial',
    'diuretic', 'laxative', 'inflammation', 'immune system',
]

/**
 * Replace high-risk medicinal language with compliant wellness phrasing.
 * Order matters: multi-word phrases are handled before single words.
 */
export function sanitizeWellnessContent(text: string): string {
    const replacements: Array<[RegExp, string]> = [
        // Drug-class and detox language (whole words / phrases first).
        [/\bcleanses?\b/gi, 'refreshes'],
        [/\bcleansing\b/gi, 'refreshing'],
        [/\bdetox(es|ifies|ification)?\b/gi, 'supports everyday wellbeing'],
        [/\bdiuretic\b/gi, 'herbal'],
        [/\blaxative\b/gi, 'herbal'],
        [/\bantimicrobial\b/gi, 'botanical'],
        [/\bantiviral\b/gi, 'botanical'],
        [/\bantibacterial\b/gi, 'botanical'],
        [/\bprescriptions?\b/gi, 'recommendations'],
        [/\bprotocols?\b/gi, 'plans'],
        [/\brestoration\b/gi, 'wellbeing'],
        [/\bclinical\b/gi, 'wellness'],
        // Medicinal verbs.
        [/\bcure[sd]?\b/gi, 'support'],
        [/\btreats?\b/gi, 'help maintain'],
        [/\btreating\b/gi, 'helping maintain'],
        [/\bdiagnos(e|es|ed|ing|is)\b/gi, 'assess'],
        [/\bheal(s|ing|ed)?\b/gi, 'support'],
        [/\bmedicine\b/gi, 'herbal tradition'],
    ]
    let cleaned = text
    for (const [pattern, safe] of replacements) {
        cleaned = cleaned.replace(pattern, safe)
    }
    return cleaned
}

/**
 * Returns true if the text still contains language that breaks UK MHRA rules
 * (named diseases, drug classes, cure/treat claims). Use to flag content before
 * publishing.
 */
export function hasRiskyClaims(text: string): boolean {
    const RISKY = /\b(cure|treats?|diagnos|heals?|disease|cancer|diabet\w*|arthrit\w*|diuretic|laxative|antimicrobial|antiviral|antibacterial|detox|immune (system|boost|defen[cs]e)|thyroid (support|function)|kidney stone)\b/i
    return RISKY.test(text)
}

/** Standard MHRA-aligned disclaimer for UK food supplements. */
export function getUKDisclaimer(): string {
    return 'These products are food supplements and have not been evaluated by the Medicines and Healthcare products Regulatory Agency (MHRA). They are intended for general wellbeing and traditional herbal use only. They are not intended to diagnose, treat, cure or prevent any disease. Always consult a qualified healthcare professional before starting any supplement, particularly if you are pregnant, breastfeeding or taking medication.'
}

/** Short inline disclaimer for product pages. */
export const SHORT_DISCLAIMER = 'Food supplement. Not intended to diagnose, treat, cure or prevent any disease. Consult your GP before use.'

/** Detect if a user message is asking for clinical/medical advice. */
export function isMedicalAdviceRequest(input: string): boolean {
    const patterns = [
        'should i take this for',
        'will this fix my',
        'can i stop taking my medication',
        'can this cure',
        'does this treat',
    ]
    return patterns.some(p => input.toLowerCase().includes(p))
}
