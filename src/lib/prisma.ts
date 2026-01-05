/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Database Connection
 */
import { PrismaClient } from '@prisma/client'

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in environment variables')
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
})

// Handle graceful shutdown
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

// Graceful shutdown
process.on('beforeExit', async () => {
    await prisma.$disconnect()
})
