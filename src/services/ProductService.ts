/**
 * Black Moss & Herbs Platform - Core Product Service
 */
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
    isBundle: boolean;
    bundleItems: string[];
    therapeuticGoals: string[];
    active: boolean;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProductFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    featured?: boolean;
    search?: string;
}

export interface ProductSort {
    field: 'price' | 'createdAt' | 'name';
    order: 'asc' | 'desc';
}

export class ProductService {
    /**
     * Fetch all products with filtering and sorting
     */
    static async getProducts(filters?: ProductFilters, sort?: ProductSort, page = 1, perPage = 12): Promise<{ products: Product[]; total: number; pages: number }> {
        try {
            const where: any = {
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

            if (filters?.search) {
                where.OR = [
                    { name: { contains: filters.search, mode: 'insensitive' } },
                    { description: { contains: filters.search, mode: 'insensitive' } },
                    { category: { contains: filters.search, mode: 'insensitive' } },
                ];
            }

            const orderBy: any = {};
            if (sort) {
                orderBy[sort.field] = sort.order;
            } else {
                orderBy.featured = 'desc';
            }

            const skip = (page - 1) * perPage;
            const [total, products] = await Promise.all([
                prisma.product.count({ where }),
                prisma.product.findMany({ where, orderBy, skip, take: perPage }),
            ]);

            const mapped = products.map(p => {
                let images = p.images;
                if ((p.slug.includes('sea-moss') || p.name.toLowerCase().includes('sea moss')) && !p.images.some(img => img.includes('gold-sea-moss-gel'))) {
                    images = ['/images/products/gold-sea-moss-gel.png', ...p.images];
                }
                return {
                    ...p,
                    price: Number(p.price),
                    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
                    images,
                    isBundle: p.isBundle,
                    therapeuticGoals: p.therapeuticGoals,
                };
            }) as Product[];

            return { products: mapped, total, pages: Math.ceil(total / perPage) };
        } catch (error) {
            console.error('[ProductService.getProducts] error:', error);
            throw new Error('Could not retrieve products.');
        }
    }

    /**
     * Get featured products for the home page
     */
    static async getFeaturedProducts(limit = 4): Promise<Product[]> {
        try {
            const products = await prisma.product.findMany({
                where: { active: true, featured: true },
                take: limit,
                orderBy: { createdAt: 'desc' },
            });

            return products.map(p => {
                let images = p.images;
                if ((p.slug.includes('sea-moss') || p.name.toLowerCase().includes('sea moss')) && !p.images.some(img => img.includes('gold-sea-moss-gel'))) {
                    images = ['/images/products/gold-sea-moss-gel.png', ...p.images];
                }
                return {
                    ...p,
                    price: Number(p.price),
                    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
                    images: images,
                };
            }) as Product[];
        } catch (error) {
            console.error('[ProductService.getFeaturedProducts] FAILURE:', error);
            return [];
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

            let images = product.images;
            if ((product.slug.includes('sea-moss') || product.name.toLowerCase().includes('sea moss')) && !product.images.some(img => img.includes('gold-sea-moss-gel'))) {
                images = ['/images/products/gold-sea-moss-gel.png', ...product.images];
            }

            return {
                ...product,
                price: Number(product.price),
                compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : undefined,
                images: images,
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
