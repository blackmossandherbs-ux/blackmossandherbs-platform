'use client'

/**
 * Black Moss & Herbs Platform - Cart State
 * Client-side cart with localStorage persistence. Prices are stored in GBP
 * (matching the Product.price unit in the database).
 */
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'

export interface CartItem {
    slug: string
    name: string
    price: number // GBP, e.g. 29.99
    image?: string
    quantity: number
}

interface CartContextValue {
    items: CartItem[]
    count: number
    subtotal: number
    addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
    removeItem: (slug: string) => void
    updateQuantity: (slug: string, quantity: number) => void
    clear: () => void
}

const STORAGE_KEY = 'bmh.cart.v1'

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [hydrated, setHydrated] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) setItems(JSON.parse(raw))
        } catch {
            // ignore malformed storage
        }
        setHydrated(true)
    }, [])

    // Persist whenever items change (after initial hydration)
    useEffect(() => {
        if (!hydrated) return
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
        } catch {
            // storage unavailable (private mode) - cart stays in memory
        }
    }, [items, hydrated])

    const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
        setItems(prev => {
            const existing = prev.find(i => i.slug === item.slug)
            if (existing) {
                return prev.map(i =>
                    i.slug === item.slug ? { ...i, quantity: i.quantity + quantity } : i
                )
            }
            return [...prev, { ...item, quantity }]
        })
    }, [])

    const removeItem = useCallback((slug: string) => {
        setItems(prev => prev.filter(i => i.slug !== slug))
    }, [])

    const updateQuantity = useCallback((slug: string, quantity: number) => {
        setItems(prev =>
            quantity <= 0
                ? prev.filter(i => i.slug !== slug)
                : prev.map(i => (i.slug === slug ? { ...i, quantity } : i))
        )
    }, [])

    const clear = useCallback(() => setItems([]), [])

    const count = items.reduce((sum, i) => sum + i.quantity, 0)
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

    return (
        <CartContext.Provider
            value={{ items, count, subtotal, addItem, removeItem, updateQuantity, clear }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used within a CartProvider')
    return ctx
}
