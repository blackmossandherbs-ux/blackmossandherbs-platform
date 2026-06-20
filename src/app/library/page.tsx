import { Metadata } from 'next'
import Link from 'next/link'
import { Download, FileText, Lock, BookOpen } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { formatPrice } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Digital Library | Black Moss & Herbs',
    description: 'Download protocols, guides, and educational resources on herbal wellness from Black Moss & Herbs.',
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileTypeLabel(type: string): string {
    const map: Record<string, string> = { pdf: 'PDF Guide', epub: 'eBook', mp3: 'Audio', mp4: 'Video', zip: 'Resource Pack' }
    return map[type.toLowerCase()] || type.toUpperCase()
}

export default async function LibraryPage() {
    const session = await getServerSession(authOptions)

    const digitalProducts = await prisma.digitalProduct.findMany({
        include: { product: true },
        orderBy: { createdAt: 'desc' },
    })

    // Get what the user has already purchased (if logged in)
    let purchasedProductIds: string[] = []
    if (session?.user?.id) {
        const orderItems = await prisma.orderItem.findMany({
            where: {
                order: { userId: session.user.id, status: { in: ['PROCESSING', 'SHIPPED', 'DELIVERED'] } },
                productId: { in: digitalProducts.map(d => d.productId) },
            },
            select: { productId: true },
        })
        purchasedProductIds = orderItems.map(i => i.productId)
    }

    return (
        <div className="py-24 bg-earth-950 min-h-screen">
            <div className="container pt-12">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400 mb-4 block">Knowledge</span>
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-4 tracking-tighter">Digital Library</h1>
                    <p className="text-earth-400 text-lg max-w-xl mx-auto">
                        Protocols, guides, and educational resources on herbal wellness — yours to keep.
                    </p>
                </div>

                {digitalProducts.length === 0 ? (
                    <div className="text-center py-24">
                        <BookOpen className="w-16 h-16 text-earth-700 mx-auto mb-6" />
                        <h2 className="text-2xl font-serif font-bold text-white mb-3">Library coming soon</h2>
                        <p className="text-earth-500 mb-8">We&apos;re preparing educational resources. In the meantime, explore our products.</p>
                        <Link href="/shop" className="inline-block px-8 py-4 bg-secondary-500 hover:bg-secondary-400 text-stone-950 font-bold rounded-xl transition-colors">
                            Shop Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {digitalProducts.map((dp) => {
                            const owned = purchasedProductIds.includes(dp.productId)
                            return (
                                <div key={dp.id} className="premium-card p-8 flex flex-col">
                                    <div className="w-14 h-14 bg-primary-900/40 rounded-2xl flex items-center justify-center mb-6 border border-primary-800/30">
                                        <FileText className="w-7 h-7 text-primary-400" />
                                    </div>

                                    <div className="flex-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mb-2 block">
                                            {fileTypeLabel(dp.fileType)}
                                        </span>
                                        <h3 className="font-serif text-xl font-bold text-white mb-3 leading-snug">
                                            {dp.product.name}
                                        </h3>
                                        <p className="text-earth-500 text-sm mb-4 line-clamp-3">
                                            {dp.product.description}
                                        </p>
                                        <p className="text-xs text-earth-600 mb-6">
                                            {formatFileSize(dp.fileSize)} · {fileTypeLabel(dp.fileType)}
                                        </p>
                                    </div>

                                    {owned ? (
                                        <a
                                            href={dp.fileUrl}
                                            download
                                            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-700 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors text-sm"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </a>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-white font-bold text-lg">{formatPrice(dp.product.price)}</span>
                                                <div className="flex items-center gap-1.5 text-earth-500 text-xs">
                                                    <Lock className="w-3.5 h-3.5" />
                                                    Purchase to unlock
                                                </div>
                                            </div>
                                            <Link
                                                href={`/shop/${dp.product.slug}`}
                                                className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary-500 hover:bg-secondary-400 text-stone-950 font-bold rounded-xl transition-colors text-sm w-full"
                                            >
                                                Get Access
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* MHRA disclaimer */}
                <p className="text-center text-xs text-earth-700 italic mt-16 max-w-2xl mx-auto">
                    Resources are for educational purposes only. Not intended to diagnose, treat, cure or prevent any disease. Consult your GP before making changes to your health regimen.
                </p>
            </div>
        </div>
    )
}
