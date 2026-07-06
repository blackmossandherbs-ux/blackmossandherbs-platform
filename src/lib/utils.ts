/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Core Utilities
 */
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatPrice(
    price: number,
    currency: 'GBP' | 'USD' | 'EUR' = 'GBP'
): string {
    const symbols = {
        GBP: '£',
        USD: '$',
        EUR: '€',
    }

    return `${symbols[currency]}${price.toFixed(2)}`
}

export function convertCurrency(
    amount: number,
    from: 'GBP' | 'USD' | 'EUR',
    to: 'GBP' | 'USD' | 'EUR'
): number {
    // Exchange rates (approximate)
    const rates: Record<string, Record<string, number>> = {
        GBP: { GBP: 1, USD: 1.27, EUR: 1.17 },
        USD: { GBP: 0.79, USD: 1, EUR: 0.92 },
        EUR: { GBP: 0.85, USD: 1.09, EUR: 1 },
    }

    return amount * rates[from][to]
}

export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 7)
    return `ORD-${timestamp}-${random}`.toUpperCase()
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}
