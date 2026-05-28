'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnnouncementBar from '@/components/layout/AnnouncementBar'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // If the pathname starts with '/admin', we don't show the global header and footer
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      {children}
      <Footer />
    </>
  )
}