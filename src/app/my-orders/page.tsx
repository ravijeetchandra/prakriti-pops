'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/locale'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { formatPrice, getStatusColor, getStatusLabel } from '@/lib/helpers'
import type { Order } from '@/lib/types'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { useToast } from '@/components/ui/Toaster'
import { FiArrowLeft } from 'react-icons/fi'

export default function MyOrdersPage() {
  const { lang, t } = useLang()
  const router = useRouter()
  const { addToast } = useToast()
  const addItem = useCartStore((s) => s.addItem)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }: { data: { user: any } }) => {
      if (!user) {
        router.push('/login')
        return
      }
      supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }: { data: Order[] | null }) => {
          if (data) setOrders(data)
          setLoading(false)
        })
    })
  }, [router])

  const handleOrderAgain = (order: Order) => {
    order.items.forEach((item: any) => {
      addItem({
        product_id: item.product_id,
        name_en: item.name_en,
        name_hi: item.name_hi,
        slug: item.slug,
        price: item.price,
        image: item.image,
      }, item.qty)
    })
    addToast('Items added to cart! 🛒', 'success')
    router.push('/cart')
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/my-account" className="text-sm text-muted hover:text-primary mb-6 inline-flex items-center gap-1">
        <FiArrowLeft size={14} /> {t('common.back')}
      </Link>

      <h1 className="text-3xl font-extrabold text-foreground mb-8">{t('my_orders.title')}</h1>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-lg text-muted">{t('my_orders.empty')}</p>
          <Link href="/shop">
            <Button variant="primary" className="mt-6">Start Shopping →</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-lg">{order.order_id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status, lang)}
                </span>
              </div>
              <div className="text-sm text-muted mb-3">
                {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })} &middot; {order.items.length} item(s) &middot; {formatPrice(order.total)}
              </div>
              <div className="flex gap-3">
                <Link href={`/my-orders/${order.order_id}`}>
                  <Button variant="outline" size="sm">{t('my_orders.view_details')}</Button>
                </Link>
                <Button variant="primary" size="sm" onClick={() => handleOrderAgain(order)}>
                  {t('my_orders.order_again')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
