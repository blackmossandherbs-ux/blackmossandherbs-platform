/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Core Product Service
 */
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    category: string;
    tags: string[];
    benefits: string[];
    stock: number;
    featured: boolean;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
}

export interface ProductSort {
    field: 'price' | 'createdAt' | 'name';
    order: 'asc' | 'desc';
}

export class ProductService {
    /**
     * Fetch all products with filtering and sorting
     */
    static async getProducts(filters?: ProductFilters, sort?: ProductSort): Promise<Product[]> {
        try {
            const where: Prisma.ProductWhereInput = {
                active: true,
            };

            if (filters?.category && filters.category !== 'All Products') {
                where.category = filters.category;
            }

            if (filters?.featured !== undefined) {
                where.featured = filters.featured;
            }

            if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
                where.price = {
                    gte: filters?.minPrice,
                    lte: filters?.maxPrice,
                };
            }

            const orderBy: Prisma.ProductOrderByWithRelationInput = {};
            if (sort) {
                orderBy[sort.field] = sort.order;
            } else {
                orderBy.createdAt = 'desc';
            }

            const products = await prisma.product.findMany({
                where,
                orderBy,
            });

            return products.map(p => ({
                ...p,
                compareAtPrice: p.compareAtPrice ?? undefined,
            })) as Product[];
        } catch (error) {
            console.error('[ProductService.getProducts] FAILURE:', error);
            throw new Error('INDUSTRIAL_CATALOG_FAILURE: Could not retrieve product list.');
        }
    }

    /**
     * Get a single product by slug
     */
    static async getProductBySlug(slug: string): Promise<Product | null> {
        try {
            const product = await prisma.product.findUnique({
                where: { slug },
            });

            if (!product) return null;

            return {
                ...product,
                compareAtPrice: product.compareAtPrice ?? undefined,
            } as Product;
        } catch (error) {
            console.error(`[ProductService.getProductBySlug] FAILURE for slug ${slug}:`, error);
            return null;
        }
    }

    /**
     * Get all unique categories
     */
    static async getCategories(): Promise<string[]> {
        try {
            const products = await prisma.product.findMany({
                where: { active: true },
                select: { category: true },
                distinct: ['category'],
            });
            return products.map(p => p.category);
        } catch (error) {
            console.error('[ProductService.getCategories] FAILURE:', error);
            return [];
        }
    }
}
