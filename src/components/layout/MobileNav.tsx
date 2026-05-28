'use client'

import Link from 'next/link'
import { FiX } from 'react-icons/fi'
import { cn } from '@/lib/helpers'

interface MobileNavProps {
  open: boolean
  onClose: () => void
  links: { href: string; label: string }[]
}

export default function MobileNav({ open, onClose, links }: MobileNavProps) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-xl transition-transform duration-300 md:hidden',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="font-bold text-primary">Prakriti Pops</span>
          <button onClick={onClose} className="p-2 text-muted hover:text-foreground">
            <FiX size={22} />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-primary/10 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/my-account"
            onClick={onClose}
            className="px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-primary/10 transition-colors"
          >
            My Account
          </Link>
        </nav>
      </div>
    </>
  )
}
