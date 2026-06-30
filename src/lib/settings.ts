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
    announcementText: 'Free UK delivery on orders over £40 — wildcrafted & lab-verified.',
    heroBadge: 'Wildcrafted Wellness',
    heroTitleLine1: 'Rooted in Nature,',
    heroTitleAccent: 'Grounded in Science.',
    heroQuote:
        'Where traditional herbal wisdom meets modern quality standards. Premium wildcrafted sea moss and herbs to complement a balanced lifestyle.',
    heroPrimaryCta: 'Shop Wellness',
    heroSecondaryCta: 'Book a Consultation',
    featuredHeading: 'Wellness',
    featuredAccent: 'Essentials.',
    newsletterHeading: 'Join Our Community',
    newsletterSubtext:
        'Subscribe for botanical guides, wellness tips, and exclusive offers — straight to your inbox.',
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
