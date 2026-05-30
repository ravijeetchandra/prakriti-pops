'use client'

import { useLang } from '@/lib/locale'
import { FiInstagram, FiFacebook, FiTwitter, FiMail, FiPhone } from 'react-icons/fi'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Footer() {
  const { t } = useLang()
  const [settings, setSettings] = useState({ contact_email: '', contact_phone: '' })

  useEffect(() => {
    supabase.from('site_settings').select('contact_email,contact_phone').single().then(({ data }: { data: { contact_email: string; contact_phone: string } | null }) => {
      if (data) setSettings({ contact_email: data.contact_email, contact_phone: data.contact_phone })
    })
  }, [])

  return (
    <footer className="bg-secondary text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-16 left-0 w-32 h-32 bg-primary/10 rounded-full blur-md" />
      <div className="absolute -bottom-16 right-0 w-32 h-32 bg-primary/10 rounded-full blur-md" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-extrabold text-xs">
                PP
              </div>
              <div>
                <span className="font-bold text-xl">Prakriti Pops</span>
                <p className="text-sm text-white/80 mt-1">
                  Mithila se, pyaar se ❤️
                </p>
              </div>
            </div>
            <p className="text-sm text-white/60 mt-2 max-w-xs">
              Darbhanga, Bihar — India
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold mb-4 text-primary-light flex items-center gap-2">
              Quick Links
              <div className="w-3 h-3 bg-primary-light rounded-full" />
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                href="/shop"
                className="flex items-center gap-2 text-sm text-white/80 hover:text-primary-light transition-all duration-200"
              >
                {t('nav.shop')}
                <FiInstagram className="w-4 h-4 text-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-2 text-sm text-white/80 hover:text-primary-light transition-all duration-200"
              >
                {t('nav.about')}
                <FiFacebook className="w-4 h-4 text-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
              <Link
                href="/track-order"
                className="flex items-center gap-2 text-sm text-white/80 hover:text-primary-light transition-all duration-200"
              >
                {t('nav.track')}
                <FiTwitter className="w-4 h-4 text-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
              <Link
                href="/admin/login"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-primary-light transition-all duration-200"
              >
                Admin
                <FiMail className="w-4 h-4 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-semibold mb-4 text-primary-light flex items-center gap-2">
              {t('common.contact')}
              <div className="w-3 h-3 bg-primary-light rounded-full" />
            </h3>
            <div className="flex flex-col gap-2 text-sm text-white/80">
              <a
                href={`mailto:${settings.contact_email || 'hello@prakritipops.com'}`}
                className="flex items-center gap-2 hover:text-primary-light transition-all duration-200"
              >
                <FiMail size={14} /> {settings.contact_email || 'hello@prakritipops.com'}
              </a>
              <a
                href={`tel:${settings.contact_phone || '+919876543210'}`}
                className="flex items-center gap-2 hover:text-primary-light transition-all duration-200"
              >
                <FiPhone size={14} /> {settings.contact_phone || '+91 98765 43210'}
              </a>
            </div>
            <div className="flex gap-4 mt-2">
              <a href="#" className="p-3 rounded-xl bg-white/10 hover:bg-primary/20 transition-all duration-200 flex items-center justify-center">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="p-3 rounded-xl bg-white/10 hover:bg-primary/20 transition-all duration-200 flex items-center justify-center">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="p-3 rounded-xl bg-white/10 hover:bg-primary/20 transition-all duration-200 flex items-center justify-center">
                <FiTwitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-10 text-center">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} Prakriti Pops. Mithila se, pyaar se ❤️
          </p>
        </div>
      </div>
    </footer>
  )
}