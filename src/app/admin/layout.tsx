'use client'

import { ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLang } from '@/lib/locale'
import { cn } from '@/lib/helpers'
import {
  FiGrid, FiPackage, FiShoppingBag, FiTag, FiBell, FiZap, FiSettings, FiLogOut, FiMenu, FiX, FiChevronLeft
} from 'react-icons/fi'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toaster'
import { useAdminAuth } from '@/hooks/useAdminAuth'

const navItems = [
  { href: '/admin/dashboard', label: 'admin.dashboard', icon: FiGrid },
  { href: '/admin/orders', label: 'admin.orders', icon: FiPackage },
  { href: '/admin/products', label: 'admin.products', icon: FiShoppingBag },
  { href: '/admin/coupons', label: 'admin.coupons', icon: FiTag },
  { href: '/admin/announcements', label: 'admin.announcements', icon: FiBell },
  { href: '/admin/campaigns', label: 'admin.campaigns', icon: FiZap },
  { href: '/admin/settings', label: 'admin.settings', icon: FiSettings },
  { href: '', label: 'logout', icon: FiLogOut, isLogout: true },
]

function SidebarContent({ pathname, setSidebarOpen, collapsed }: { pathname: string; setSidebarOpen: (v: boolean) => void; collapsed: boolean }) {
  const { t } = useLang()
  const router = useRouter()
  const { addToast } = useToast()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    document.cookie = 'pp-admin-session=; path=/; max-age=0'
    addToast('Logged out successfully! 👋', 'success')
    router.push('/')
  }

  return (
    <div className="flex flex-col h-full">
      <div className={cn('border-b border-gray-200', collapsed ? 'p-3' : 'p-4')}>
        <Link href="/admin/dashboard" className="flex items-center gap-2 justify-center md:justify-start">
          <div className="w-8 h-8 min-w-[32px] rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-extrabold text-xs">
            PP
          </div>
          {!collapsed && <span className="font-bold text-sm">Admin Panel</span>}
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const { isLogout } = item as any
          const isActive = !isLogout && (pathname === item.href || pathname.startsWith(item.href + '/'))
          if (isLogout) {
            return (
              <button
                key="logout"
                onClick={() => { handleLogout(); setSidebarOpen(false) }}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-colors duration-200 cursor-pointer hover:font-bold',
                  collapsed ? 'justify-center' : '',
                  'text-red-600 hover:bg-red-50/10',
                  isActive && 'bg-red-50/20'
                )}
                title="Logout"
              >
                <Icon size={18} className="min-w-[18px] transition-all group-hover:stroke-[2px]" />
                {!collapsed && 'Logout'}
              </button>
            )
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200',
                collapsed ? 'justify-center' : '',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted hover:bg-gray-50 hover:text-foreground'
              )}
              title={collapsed ? ((t as any)(item.label) || item.label.split('.').pop()) : undefined}
            >
              <Icon size={18} className="min-w-[18px] transition-transform duration-200" />
              {!collapsed && ((t as any)(item.label) || item.label.split('.').pop())}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { isAuthenticated, isLoading } = useAdminAuth()

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('pp-admin-sidebar-collapsed', String(next))
      return next
    })
  }

  const sidebarWidth = collapsed ? 'md:w-16' : 'md:w-64 lg:w-72'
  const marginLeft = collapsed ? 'md:ml-16' : 'md:ml-64 lg:ml-72'

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className={cn(
        'hidden md:flex bg-white border-r border-gray-200 flex-col fixed top-0 left-0 h-full z-40 transition-all duration-300',
        sidebarWidth
      )}>
        <button
          onClick={toggleCollapse}
          className={cn(
            'absolute -right-3 top-6 z-50 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition-transform duration-200',
            collapsed && 'rotate-180'
          )}
        >
          <FiChevronLeft size={14} />
        </button>
        <SidebarContent pathname={pathname} setSidebarOpen={setSidebarOpen} collapsed={collapsed} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 z-50 h-full w-72 bg-white shadow-xl md:hidden">
            <div className="flex justify-end p-2">
              <button onClick={() => setSidebarOpen(false)} className="p-2"><FiX size={20} /></button>
            </div>
            <SidebarContent pathname={pathname} setSidebarOpen={setSidebarOpen} collapsed={false} />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className={cn('flex-1 transition-all duration-300', marginLeft)}>
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 p-4 bg-white border-b border-gray-200 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-1">
            <FiMenu size={22} />
          </button>
          <span className="font-bold text-sm">Admin Panel</span>
        </div>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}