import { Metadata } from 'next'
import { Download, BookOpen, FileText } from 'lucide-react'
import Button from '@/components/Button'

export const metadata: Metadata = {
    title: 'Digital Library - Black Moss & Herbs',
    description: 'Access your purchased eBooks, guides, and digital resources.',
}

const digitalProducts = [
    {
        id: '1',
        title: 'Complete Herbal Remedies Guide',
        type: 'eBook',
        description: 'Comprehensive guide to herbal medicine and natural remedies for common ailments.',
        fileSize: '12.5 MB',
        format: 'PDF',
        purchasedAt: 'Dec 15, 2024',
    },
    {
        id: '2',
        title: 'Sea Moss Recipe Collection',
        type: 'Recipe Book',
        description: '50+ delicious and nutritious recipes featuring sea moss.',
        fileSize: '8.2 MB',
        format: 'PDF',
        purchasedAt: 'Dec 10, 2024',
    },
    {
        id: '3',
        title: 'Wellness Journal Template',
        type: 'Template',
        description: 'Track your health journey with this comprehensive wellness journal.',
        fileSize: '3.1 MB',
        format: 'PDF',
        purchasedAt: 'Dec 5, 2024',
    },
    {
        id: '4',
        title: 'Herbal Tea Blending Guide',
        type: 'Guide',
        description: 'Learn the art of creating custom herbal tea blends for various health benefits.',
        fileSize: '6.8 MB',
        format: 'PDF',
        purchasedAt: 'Nov 28, 2024',
    },
    {
        id: '5',
        title: 'Adaptogen Handbook',
        type: 'eBook',
        description: 'Everything you need to know about adaptogenic herbs and how to use them.',
        fileSize: '10.3 MB',
        format: 'PDF',
        purchasedAt: 'Nov 20, 2024',
    },
]

const getIcon = (type: string) => {
    switch (type) {
        case 'eBook':
            return BookOpen
        case 'Recipe Book':
            return BookOpen
        case 'Template':
            return FileText
        case 'Guide':
            return FileText
        default:
            return FileText
    }
}

export default function LibraryPage() {
    return (
        <div className="py-12">
            <div className="container">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="section-title">Digital Library</h1>
                    <p className="section-subtitle">
                        Access all your purchased eBooks, guides, and digital resources
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="card p-6">
                        <div className="text-4xl font-bold text-primary-600 mb-2">
                            {digitalProducts.length}
                        </div>
                        <div className="text-earth-600">Total Downloads</div>
                    </div>
                    <div className="card p-6">
                        <div className="text-4xl font-bold text-secondary-600 mb-2">
                            {digitalProducts.filter(p => p.type === 'eBook').length}
                        </div>
                        <div className="text-earth-600">eBooks</div>
                    </div>
                    <div className="card p-6">
                        <div className="text-4xl font-bold text-earth-600 mb-2">
                            {digitalProducts.filter(p => p.type === 'Guide' || p.type === 'Template').length}
                        </div>
                        <div className="text-earth-600">Guides & Templates</div>
                    </div>
                </div>

                {/* Digital Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {digitalProducts.map((product) => {
                        const Icon = getIcon(product.type)

                        return (
                            <div key={product.id} className="card group">
                                <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                                    <Icon className="w-20 h-20 text-primary-600" />
                                    <div className="absolute top-4 right-4">
                                        <span className="badge-primary">{product.type}</span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="font-serif text-xl font-bold text-earth-900 mb-2 line-clamp-2">
                                        {product.title}
                                    </h3>

                                    <p className="text-earth-600 text-sm mb-4 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-earth-500 mb-4">
                                        <span>{product.format}</span>
                                        <span>{product.fileSize}</span>
                                    </div>

                                    <div className="text-xs text-earth-500 mb-4">
                                        Purchased: {product.purchasedAt}
                                    </div>

                                    <Button className="w-full" size="sm">
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Browse More */}
                <div className="mt-12 card p-12 text-center bg-gradient-to-br from-earth-50 to-primary-50">
                    <h2 className="text-3xl font-serif font-bold text-earth-900 mb-4">
                        Looking for More Resources?
                    </h2>
                    <p className="text-earth-600 mb-6 max-w-2xl mx-auto">
                        Explore our collection of digital products including eBooks, guides, templates, and more to support your wellness journey.
                    </p>
                    <Button size="lg">Browse Digital Products</Button>
                </div>
            </div>
        </div>
    )
}
