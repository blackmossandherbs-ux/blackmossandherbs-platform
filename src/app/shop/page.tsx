import { Metadata } from 'next'
import ProductCard from '@/components/ProductCard'
import { Filter } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Shop - Black Moss & Herbs',
    description: 'Browse our premium selection of herbal wellness products, supplements, and natural remedies.',
}

// Mock data - will be replaced with database queries
const products = [
    {
        id: '1',
        name: 'Sea Moss Gold Gel',
        slug: 'sea-moss-gold-gel',
        price: 34.99,
        compareAtPrice: 44.99,
        images: ['/images/sea_moss_gold.png'],
        category: 'Supplements',
        featured: true,
    },
    {
        id: '2',
        name: 'Elderberry Syrup',
        slug: 'elderberry-syrup',
        price: 24.99,
        images: ['/images/elderberry.png'],
        category: 'Immune Support',
        featured: true,
    },
    {
        id: '3',
        name: 'Herbal Tea Blend',
        slug: 'herbal-tea-blend',
        price: 18.99,
        compareAtPrice: 22.99,
        images: [],
        category: 'Teas',
    },
    {
        id: '4',
        name: 'Turmeric Capsules',
        slug: 'turmeric-capsules',
        price: 29.99,
        images: ['/images/burdock_root.png'],
        category: 'Supplements',
    },
    {
        id: '5',
        name: 'Ashwagandha Root',
        slug: 'ashwagandha-root',
        price: 26.99,
        images: [],
        category: 'Adaptogens',
    },
    {
        id: '6',
        name: 'Moringa Powder',
        slug: 'moringa-powder',
        price: 22.99,
        images: [],
        category: 'Superfoods',
    },
    {
        id: '7',
        name: 'Burdock Root Tea',
        slug: 'burdock-root-tea',
        price: 16.99,
        images: ['/images/dandelion_root.png', '/images/burdock_root.png'],
        category: 'Teas',
    },
    {
        id: '8',
        name: 'Seamoss Capsules',
        slug: 'seamoss-capsules',
        price: 32.99,
        images: [],
        category: 'Supplements',
        featured: true,
    },
]

const categories = [
    'All Products',
    'Supplements',
    'Teas',
    'Immune Support',
    'Adaptogens',
    'Superfoods',
]

export default function ShopPage() {
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
                        <div className="card p-6 sticky top-24">
                            <div className="flex items-center gap-2 mb-6">
                                <Filter className="w-5 h-5 text-earth-700" />
                                <h2 className="text-lg font-bold text-earth-900">Filters</h2>
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-earth-900 mb-3">Categories</h3>
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <label key={category} className="flex items-center cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-primary-600 border-earth-300 rounded focus:ring-primary-500"
                                                defaultChecked={category === 'All Products'}
                                            />
                                            <span className="ml-2 text-sm text-earth-700 group-hover:text-primary-600">
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-earth-900 mb-3">Price Range</h3>
                                <div className="space-y-2">
                                    {[
                                        'Under $20',
                                        '$20 - $30',
                                        '$30 - $40',
                                        'Over $40',
                                    ].map((range) => (
                                        <label key={range} className="flex items-center cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-primary-600 border-earth-300 rounded focus:ring-primary-500"
                                            />
                                            <span className="ml-2 text-sm text-earth-700 group-hover:text-primary-600">
                                                {range}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Special Offers */}
                            <div>
                                <h3 className="font-semibold text-earth-900 mb-3">Special Offers</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-primary-600 border-earth-300 rounded focus:ring-primary-500"
                                        />
                                        <span className="ml-2 text-sm text-earth-700 group-hover:text-primary-600">
                                            On Sale
                                        </span>
                                    </label>
                                    <label className="flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-primary-600 border-earth-300 rounded focus:ring-primary-500"
                                        />
                                        <span className="ml-2 text-sm text-earth-700 group-hover:text-primary-600">
                                            Featured
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-earth-600">
                                Showing <span className="font-semibold">{products.length}</span> products
                            </p>
                            <select className="input w-auto">
                                <option>Sort by: Featured</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} {...product} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
