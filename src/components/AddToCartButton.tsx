'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import Button from './Button'
import { useCart } from '@/context/CartContext'

interface AddToCartButtonProps {
    slug: string
    name: string
    price: number
    image?: string
    disabled?: boolean
}

export default function AddToCartButton({ slug, name, price, image, disabled }: AddToCartButtonProps) {
    const { addItem } = useCart()
    const [added, setAdded] = useState(false)

    const handleAdd = () => {
        addItem({ slug, name, price, image })
        setAdded(true)
        setTimeout(() => setAdded(false), 1800)
    }

    return (
        <Button
            size="lg"
            onClick={handleAdd}
            disabled={disabled}
            className="h-20 rounded-2xl text-lg font-bold group"
        >
            {added ? (
                <>
                    Added to Cart
                    <Check className="ml-3 w-5 h-5" />
                </>
            ) : (
                <>
                    Add to Cart
                    <ShoppingCart className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
            )}
        </Button>
    )
}
