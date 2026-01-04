/**
 * HECTIC Intellectual Property - Copyright 2024
 * Black Moss & Herbs Platform - Standard Button Component
 */
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center rounded-xl font-bold transition-all duration-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'

        const variants = {
            primary: 'bg-green-700 text-stone-50 shadow-[0_10px_20px_-5px_rgba(21,128,61,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(21,128,61,0.6)] hover:bg-green-600',
            secondary: 'bg-amber-600 text-stone-950 shadow-[0_10px_20px_-5px_rgba(202,138,4,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(202,138,4,0.6)] hover:bg-amber-500',
            outline: 'border border-stone-700 bg-stone-900/50 text-stone-100 backdrop-blur-sm hover:bg-stone-800 hover:border-stone-600',
            ghost: 'text-stone-400 hover:text-stone-100 hover:bg-white/5',
        }

        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg',
        }

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'

export default Button
