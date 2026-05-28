'use client'

import { cn } from '@/lib/helpers'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'viral' | 'new' | 'bihar' | 'soldout' | 'sale' | 'success' | 'warning' | 'info'
  className?: string
}

export function Badge({ children, variant = 'info', className }: BadgeProps) {
  const variants: Record<string, string> = {
    viral: 'bg-red-500 text-white',
    new: 'bg-purple-600 text-white',
    bihar: 'bg-accent text-white',
    soldout: 'bg-gray-800 text-white',
    sale: 'bg-green-500 text-white',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-bold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
