/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Stripe Configuration
 */
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2023-10-16',
  typescript: true,
});
