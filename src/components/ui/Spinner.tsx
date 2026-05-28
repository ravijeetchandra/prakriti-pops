'use client'

import { cn } from '@/lib/helpers'

interface SpinnerProps {
  className?: string
  text?: string
}

export function Spinner({ className, text }: SpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-12', className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      {text && <p className="text-sm text-muted animate-pulse">{text}</p>}
    </div>
  )
}
