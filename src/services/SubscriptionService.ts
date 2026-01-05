/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Core Subscription Service
 */
import { prisma } from '@/lib/prisma';

export enum SubscriptionTier {
  NONE = 'NONE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  ALCHEMIST = 'ALCHEMIST',
}

export class SubscriptionService {
  /**
   * Get all active subscription plans (Stripe linked)
   */
  static async getPlans() {
    try {
      return await prisma.subscriptionPlan.findMany({
        where: { active: true },
        orderBy: { price: 'asc' },
      });
    } catch (error) {
      console.error('[SubscriptionService.getPlans] FAILURE:', error);
      throw new Error('INDUSTRIAL_DATA_FAILURE: Could not retrieve subscription plans.');
    }
  }

  /**
   * Get a user's unified access status
   */
  static async getUserAccess(userId: string) {
    try {
      // Check for Active Stripe Subscriptions first (Revenue priority)
      const subscription = await prisma.subscription.findFirst({
        where: {
          userId,
          status: 'ACTIVE',
        },
        include: {
          plan: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (subscription) {
        return {
          tier: subscription.plan.name.toUpperCase() as SubscriptionTier,
          type: 'SUBSCRIPTION',
          expiresAt: subscription.currentPeriodEnd,
        };
      }

      // Fallback to manual Membership
      const membership = await prisma.membership.findUnique({
        where: { userId },
        include: {
          tier: true,
        },
      });

      if (membership && membership.active && membership.endDate > new Date()) {
        return {
          tier: membership.tier.name.toUpperCase() as SubscriptionTier,
          type: 'MEMBERSHIP',
          expiresAt: membership.endDate,
        };
      }

      return {
        tier: SubscriptionTier.NONE,
        type: 'NONE',
        expiresAt: null,
      };
    } catch (error) {
      console.error(`[SubscriptionService.getUserAccess] FAILURE for User ${userId}:`, error);
      // Default to NONE on failure to prevent total site crash, but log heavily
      return {
        tier: SubscriptionTier.NONE,
        type: 'FAILURE_RECOVERY',
        expiresAt: null,
      };
    }
  }

  /**
   * Check if a user has access to a specific tier or higher
   */
  static async hasTierAccess(userId: string, requiredTier: SubscriptionTier): Promise<boolean> {
    try {
      const access = await this.getUserAccess(userId);

      const tierHierarchy = {
        [SubscriptionTier.NONE]: 0,
        [SubscriptionTier.SILVER]: 1,
        [SubscriptionTier.GOLD]: 2,
        [SubscriptionTier.ALCHEMIST]: 3,
      };

      const currentTierValue = tierHierarchy[access.tier] || 0;
      const requiredTierValue = tierHierarchy[requiredTier];

      return currentTierValue >= requiredTierValue;
    } catch (error) {
      console.error(`[SubscriptionService.hasTierAccess] FAILURE for User ${userId}:`, error);
      return false;
    }
  }
}
