'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/locale'
import { FiX } from 'react-icons/fi'
import type { Announcement } from '@/lib/types'

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const { lang } = useLang()

  useEffect(() => {
;(async () => {
      const dismissedId = localStorage.getItem('pp-dismissed-announcement')
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
      if (data && data.length > 0 && data[0].id !== dismissedId) {
        setAnnouncement(data[0])
      }
    })()
  }, [])

  if (!announcement || dismissed) return null

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('pp-dismissed-announcement', announcement.id)
  }

  return (
    <div
      className="relative flex items-center justify-center px-4 py-2 text-sm font-medium text-center"
      style={{ backgroundColor: announcement.bg_color, color: announcement.text_color }}
    >
      <span>{lang === 'hi' ? announcement.text_hi : announcement.text_en}</span>
      <button
        onClick={handleDismiss}
        className="absolute right-3 p-0.5 opacity-70 hover:opacity-100 transition-opacity"
        style={{ color: announcement.text_color }}
      >
        <FiX size={16} />
      </button>
    </div>
  )
}
