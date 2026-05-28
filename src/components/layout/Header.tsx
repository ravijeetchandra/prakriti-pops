'use client'

import Link from 'next/link'
import { useLang } from '@/lib/locale'
import { useCartStore } from '@/store/cartStore'
import { FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'
import LangToggle from './LangToggle'
import MobileNav from './MobileNav'
import { useToast } from '@/components/ui/Toaster'

export default function Header() {
  const { t, lang } = useLang()
  const totalItems = useCartStore((s) => s.totalItems())
  const [mobileOpen, setMobileOpen] = useState(false)
  const { addToast } = useToast()

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/shop', label: t('nav.shop') },
    { href: '/about', label: t('nav.about') },
    { href: '/track-order', label: t('nav.track') },
  ]

  const handleAddToCart = () => {
    // This would typically trigger cart functionality
    addToast('Item added to cart! 🛒', 'success')
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-extrabold text-xs group-hover:scale-105 transition-transform duration-200">
                PP
              </div>
              <span className="font-bold text-xl text-foreground hidden sm:block">
                Prakriti Pops
              </span>
            </Link>

            {/* Nav Links - Desktop */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-medium text-muted transition-all duration-200 group"
                >
                  {link.label}
                  {/* Animated underline */}
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <LangToggle />

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-3 text-muted hover:text-primary transition-all duration-200"
                onClick={handleAddToCart}
              >
                <FiShoppingCart size={22} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-white ring-2 ring-primary">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>

              {/* User Account - Desktop only */}
              <Link
                href="/my-account"
                className="hidden sm:flex p-3 text-muted hover:text-primary transition-all duration-200 relative"
              >
                <FiUser size={22} />
                {/* Notification dot */}
                <span className="absolute -top-1 -right-1 bg-success w-2 h-2 rounded-full border-2 border-white" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-3 text-muted hover:text-primary transition-all duration-200 hover:scale-105"
              >
                <FiMenu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} links={navLinks} />
    </>
  )
}