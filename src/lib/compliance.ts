/**
 * UK compliance layer — content sanitisation and disclaimer text.
 * All language is aligned with MHRA food supplement guidelines.
 */

export const HIGH_RISK_TERMS = [
    'cure', 'treat', 'diagnose', 'healing', 'medicine',
    'doctor', 'prescription', 'disease', 'chronic', 'cancer',
]

/** Replace high-risk medicinal verbs with compliant wellness language. */
export function sanitizeWellnessContent(text: string): string {
    const replacements: Record<string, string> = {
        'cure': 'support',
        'treat': 'help maintain',
        'diagnose': 'assess',
        'healing': 'supporting',
        'medicine': 'herbal tradition',
    }
    let cleaned = text
    Object.entries(replacements).forEach(([risk, safe]) => {
        cleaned = cleaned.replace(new RegExp(`\\b${risk}\\b`, 'gi'), safe)
    })
    return cleaned
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
