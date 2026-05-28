'use client'

import { ReactNode } from 'react'
import { LangProvider } from '@/lib/locale'
import { Toaster } from '@/components/ui/Toaster'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <Toaster>
        {children}
      </Toaster>
    </LangProvider>
  )
}
