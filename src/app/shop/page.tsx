/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Shop Catalog
 */
import { Metadata } from 'next'
import ProductCard from '@/components/ProductCard'
import { Filter } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Shop - Black Moss & Herbs',
    description: 'Browse our premium selection of herbal wellness products, supplements, and natural remedies.',
}

import { ProductService } from '@/services/ProductService'

export default async function ShopPage() {
    const products = await ProductService.getProducts();
    const categories = await ProductService.getCategories();
    const availableCategories = ['All Products', ...categories];
    return (
        <div className="py-12">
            <div className="container">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="section-title">Shop Herbal Products</h1>
                    <p className="section-subtitle">
                        Premium quality herbs and supplements for your wellness journey
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="card p-8 sticky top-24 border border-earth-800 bg-earth-900/40 backdrop-blur-xl rounded-[2.5rem]">
                            <div className="flex items-center gap-2 mb-8">
                                <Filter className="w-5 h-5 text-secondary-400" />
                                <h2 className="text-xl font-serif font-bold text-white">Biological Filters</h2>
                            </div>

                            {/* Therapeutic Goals */}
                            <div className="mb-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-earth-500 mb-4">Therapeutic Goals</h3>
                                <div className="space-y-3">
                                    {[
                                        'Deep Cleanse',
                                        'Immune Support',
                                        'Intracellular Hydration',
                                        'Blood Purifier',
                                        'Nervous System',
                                        'Vitality'
                                    ].map((goal) => (
                                        <label key={goal} className="flex items-center cursor-pointer group">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-earth-700 transition-all checked:bg-secondary-500 checked:border-secondary-500"
                                                />
                                                <span className="ml-3 text-sm text-earth-400 group-hover:text-white transition-colors">
                                                    {goal}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="mb-8">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-earth-500 mb-4">Compound Types</h3>
                                <div className="space-y-3">
                                    {availableCategories.map((category) => (
                                        <label key={category} className="flex items-center cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="h-5 w-5 rounded-md border-earth-700 bg-transparent checked:bg-primary-500"
                                                defaultChecked={category === 'All Products'}
                                            />
                                            <span className="ml-3 text-sm text-earth-400 group-hover:text-white transition-colors">
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button className="w-full py-4 bg-earth-800 hover:bg-earth-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all">
                                Reset Filters
                            </button>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-8">
                            <p className="text-earth-500 font-mono text-xs uppercase tracking-widest">
                                <span className="text-white font-bold">{products.length}</span> Entities Identified
                            </p>
                            <select className="bg-earth-900 border border-earth-800 text-white rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-primary-500">
                                <option>Sort by: Priority</option>
                                <option>Potency: High to Low</option>
                                <option>Newest Discovery</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    name={product.name}
                                    slug={product.slug}
                                    price={product.price}
                                    compareAtPrice={product.compareAtPrice ?? undefined}
                                    images={product.images}
                                    category={product.category}
                                    featured={product.featured}
                                    isBundle={product.isBundle}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
