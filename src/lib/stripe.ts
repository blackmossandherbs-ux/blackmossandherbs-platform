/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Stripe Configuration
 */
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
    typescript: true,
    maxNetworkRetries: 3,
    timeout: 20000,
})
