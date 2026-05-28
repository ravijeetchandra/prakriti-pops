'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/helpers'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm',
        hover && 'transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}