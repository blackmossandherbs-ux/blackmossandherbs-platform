/**
 * Global Compliance Layer
 * Handles brand-safe content sanitization and region-aware disclaimers.
 * 
 * Objectives:
 * 1. Remove diagnostic language (No cure/treat/diagnose).
 * 2. Append FDA/Global disclaimers.
 * 3. Enforce "Educational Only" boundaries.
 */

/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Compliance Layer
 */
export const ALKALINE_KEYWORDS = [
    'cure', 'treat', 'diagnose', 'healing', 'medicine',
    'doctor', 'prescription', 'disease', 'chronic', 'cancer'
];

export function sanitizeWellnessContent(text: string): string {
    let cleaned = text;

    // Replace high-risk verbs with educational/wellness verbs
    const replacements: Record<string, string> = {
        'cure': 'support',
        'treat': 'balance',
        'diagnose': 'assess',
        'healing': 'rejuvenating',
        'medicine': 'herbal tradition'
    };

    Object.entries(replacements).forEach(([risk, safe]) => {
        const regex = new RegExp(`\\b${risk}\\b`, 'gi');
        cleaned = cleaned.replace(regex, safe);
    });

    return cleaned;
}

export function getGlobalDisclaimer(): string {
    return "Disclaimer: These statements have not been evaluated by the FDA or any medical authority. Our products and protocols are for educational and traditional herbal purposes only. They are not intended to diagnose, treat, cure, or prevent any disease. Always consult with a qualified health professional regarding your biological roadmap.";
}

export function enforceAlchemistBoundary(input: string): boolean {
    // Check if input is asking for specific medical advice
    const medicalStrings = ['should i take this for', 'will this fix my', 'can i stop taking my medication'];
    return medicalStrings.some(s => input.toLowerCase().includes(s));
}
