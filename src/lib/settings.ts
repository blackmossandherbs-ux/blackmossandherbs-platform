/**
 * Black Moss & Herbs Platform - Editable Site Settings
 *
 * Stores admin-editable front-end content (homepage hero copy, announcement bar,
 * section headings) as a single JSON row so Black Moss & Herbs can edit the site
 * without code changes. Always merges over defaults, so a missing/empty DB never
 * breaks rendering.
 */
import { prisma } from '@/lib/prisma'

export interface SiteSettings {
    announcementEnabled: boolean
    announcementText: string
    heroBadge: string
    heroTitleLine1: string
    heroTitleAccent: string
    heroQuote: string
    heroPrimaryCta: string
    heroSecondaryCta: string
    featuredHeading: string
    featuredAccent: string
    newsletterHeading: string
    newsletterSubtext: string
}

export const DEFAULT_SETTINGS: SiteSettings = {
    announcementEnabled: false,
    announcementText: 'Free UK shipping on orders over £50 — wildcrafted, alkaline-aligned.',
    heroBadge: 'Botanical Authority',
    heroTitleLine1: 'Biological',
    heroTitleAccent: 'Restoration.',
    heroQuote:
        'Where traditional herbal wisdom meets modern biological reality. We don’t just sell products; we provide the framework for alkaline excellence.',
    heroPrimaryCta: 'Manifest Wellness',
    heroSecondaryCta: 'Clinical Guidance',
    featuredHeading: 'Biological',
    featuredAccent: 'Formulas.',
    newsletterHeading: 'Join the Alchemist',
    newsletterSubtext:
        'Subscribe to receive alchemical protocols, botanical discoveries, and exclusive authority updates.',
}

const SETTINGS_KEY = 'site'

export class SettingsService {
    /** Returns settings merged over defaults. Never throws. */
    static async get(): Promise<SiteSettings> {
        try {
            const row = await prisma.siteSetting.findUnique({ where: { key: SETTINGS_KEY } })
            if (!row?.value) return DEFAULT_SETTINGS
            return { ...DEFAULT_SETTINGS, ...(row.value as Partial<SiteSettings>) }
        } catch (error) {
            console.error('[SettingsService.get] falling back to defaults:', error)
            return DEFAULT_SETTINGS
        }
    }

    /** Merge a partial update over the current settings and persist. */
    static async update(partial: Partial<SiteSettings>): Promise<SiteSettings> {
        const current = await this.get()
        const next: SiteSettings = { ...current, ...partial }
        await prisma.siteSetting.upsert({
            where: { key: SETTINGS_KEY },
            update: { value: next as any },
            create: { key: SETTINGS_KEY, value: next as any },
        })
        return next
    }
}
