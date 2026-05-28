'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/locale'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toaster'
import Link from 'next/link'
import type { Order } from '@/lib/types'
import { FiPackage, FiHeart, FiMapPin, FiSettings, FiLogOut } from 'react-icons/fi'

export default function AccountPage() {
  const { t } = useLang()
  const router = useRouter()
  const { addToast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: { data: { user: any } }) => {
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      supabase.from('user_profiles').select('*').eq('id', user.id).single().then(({ data }: { data: any }) => {
        if (data) setProfile(data)
      })
      supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }: { data: Order[] | null }) => {
        if (data) setOrders(data)
      })
      setLoading(false)
    })
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    addToast('Logged out', 'info')
    router.push('/')
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">{t('nav.account')}</h1>
          <p className="text-muted text-sm mt-1">{user?.email}</p>
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          <FiLogOut size={16} className="mr-2" /> {t('nav.logout')}
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {[
            { icon: FiPackage, label: t('my_orders.title'), href: '/my-orders' },
            { icon: FiHeart, label: 'Wishlist', href: '#' },
            { icon: FiMapPin, label: 'Saved Addresses', href: '#' },
            { icon: FiSettings, label: 'Settings', href: '#' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-primary/10 transition-colors"
            >
              <item.icon size={18} className="text-primary" />
              {item.label}
            </Link>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="font-bold text-lg">{t('my_orders.title')}</h2>
          {orders.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-4xl mb-3">📦</p>
              <p className="text-muted">{t('my_orders.empty')}</p>
              <Link href="/shop">
                <Button variant="primary" className="mt-4">Start Shopping →</Button>
              </Link>
            </Card>
          ) : (
            orders.slice(0, 5).map((order) => (
              <Card key={order.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold">{order.order_id}</span>
                    <p className="text-sm text-muted">{order.items.length} item(s) — ₹{order.total}</p>
                  </div>
                  <Link href={`/my-orders/${order.order_id}`}>
                    <Button variant="outline" size="sm">{t('my_orders.view_details')}</Button>
                  </Link>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
