'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Lang = 'en' | 'hi'
import en from '@/locales/en.json'
import hi from '@/locales/hi.json'

const locales = { en, hi } as const

interface LangContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (path: string) => string
}

const LangContext = createContext<LangContextType | null>(null)

function getNested(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path
    }
  }
  return typeof current === 'string' ? current : path
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pp-lang') as Lang | null
      if (saved === 'en' || saved === 'hi') return saved
    }
    return 'en'
  })

  useEffect(() => {
    localStorage.setItem('pp-lang', lang)
  }, [lang])

  const t = (path: string): string => getNested(locales[lang] as unknown as Record<string, unknown>, path)

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
