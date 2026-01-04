/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Core Consultation Service
 */
import { prisma } from '@/lib/prisma';
import { ConsultationStatus } from '@prisma/client';

export enum ConsultationType {
    PRIVATE_1ON1 = 'PRIVATE_1ON1',
    ASYNC_PROTOCOL = 'ASYNC_PROTOCOL',
    EMERGENCY_AUDIT = 'EMERGENCY_AUDIT'
}

export class ConsultationService {
    /**
     * Get pricing for a consultation type
     */
    static getPrice(type: ConsultationType): number {
        const pricing = {
            [ConsultationType.PRIVATE_1ON1]: 149.00,
            [ConsultationType.ASYNC_PROTOCOL]: 89.00,
            [ConsultationType.EMERGENCY_AUDIT]: 49.00
        };
        return pricing[type];
    }

    /**
     * Create a new consultation record
     */
    static async createConsultation(userId: string, type: ConsultationType) {
        try {
            return await prisma.consultation.create({
                data: {
                    userId,
                    type: type.toString(),
                    status: ConsultationStatus.PENDING,
                    price: this.getPrice(type)
                }
            });
        } catch (error) {
            console.error(`[ConsultationService.createConsultation] FAILURE for user ${userId}:`, error);
            throw new Error('INDUSTRIAL_PROTOCOL_FAILURE: Could not initiate consultation.');
        }
    }

    /**
     * Get all consultations for a user
     */
    static async getUserConsultations(userId: string) {
        try {
            return await prisma.consultation.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            });
        } catch (error) {
            console.error(`[ConsultationService.getUserConsultations] FAILURE for user ${userId}:`, error);
            return [];
        }
    }

    /**
     * Update consultation status (usually after Stripe webhook)
     */
    static async updateStatus(consultationId: string, status: ConsultationStatus) {
        try {
            return await prisma.consultation.update({
                where: { id: consultationId },
                data: { status }
            });
        } catch (error) {
            console.error(`[ConsultationService.updateStatus] FAILURE for consultation ${consultationId}:`, error);
            throw new Error('INDUSTRIAL_STATUS_FAILURE: Could not finalize protocol state.');
        }
    }
}
