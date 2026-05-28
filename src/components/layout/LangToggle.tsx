'use client'

import { useLang } from '@/lib/locale'

export default function LangToggle() {
  const { lang, setLang } = useLang()

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-300 text-xs font-medium text-muted hover:border-primary hover:text-primary transition-colors"
    >
      <span className={lang === 'en' ? 'font-bold text-primary' : ''}>EN</span>
      <span className="text-gray-300">|</span>
      <span className={lang === 'hi' ? 'font-bold text-primary' : ''}>हि</span>
    </button>
  )
}
