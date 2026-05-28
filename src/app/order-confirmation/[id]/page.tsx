'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/locale'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { formatPrice, getStatusColor, getStatusLabel } from '@/lib/helpers'
import type { Order, OrderTimeline } from '@/lib/types'
import Link from 'next/link'
import { FiCheckCircle, FiTruck, FiPackage, FiClock, FiX } from 'react-icons/fi'

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>()
  const { lang, t } = useLang()
  const [order, setOrder] = useState<Order | null>(null)
  const [timeline, setTimeline] = useState<OrderTimeline[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('orders')
      .select('*')
      .eq('order_id', id)
      .single()
      .then(({ data }: { data: Order | null }) => {
        if (data) {
          setOrder(data)
          supabase
            .from('order_timeline')
            .select('*')
            .eq('order_id', data.id)
            .order('created_at', { ascending: true })
            .then(({ data: tl }: { data: OrderTimeline[] | null }) => {
              if (tl) setTimeline(tl)
            })
        }
        setLoading(false)
      })
  }, [id])

  if (loading) return <Spinner text={t('common.loading')} />
  if (!order) return <div className="text-center py-20">Order not found</div>

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <FiClock size={20} />,
    confirmed: <FiCheckCircle size={20} />,
    shipped: <FiTruck size={20} />,
    delivered: <FiPackage size={20} />,
    cancelled: <FiX size={20} />,
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="text-3xl font-extrabold text-foreground">{t('checkout.confirm_title')}</h1>
      <p className="text-muted mt-2">{t('checkout.confirm_msg')}</p>

      <Card className="p-6 mt-8 text-left">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted">{t('checkout.order_id')}: <strong className="text-foreground">{order.order_id}</strong></span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status, lang)}
          </span>
        </div>

        {/* Items */}
        <div className="space-y-3 text-sm">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={item.image || `/api/placeholder?name=${encodeURIComponent(item.name_en)}`}
                  alt={item.name_en}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="flex-1">{item.name_en} x{item.qty}</span>
              <span className="font-semibold">{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 space-y-1 text-sm">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary">{formatPrice(order.total)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>{t('checkout.expected_delivery')}</span>
          </div>
        </div>

        {/* Timeline */}
        {timeline.length > 0 && (
          <div className="border-t mt-6 pt-6">
            <h3 className="font-semibold mb-3">Timeline</h3>
            <div className="space-y-3">
              {timeline.map((entry) => (
                <div key={entry.id} className="flex items-center gap-3 text-sm">
                  <span className="text-primary">{statusIcons[entry.status] || <FiClock size={16} />}</span>
                  <span className="flex-1">{getStatusLabel(entry.status, lang)}</span>
                  <span className="text-xs text-muted">
                    {new Date(entry.created_at).toLocaleDateString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href={`/track-order`}>
          <Button variant="outline">{t('checkout.track_btn')}</Button>
        </Link>
        <Link href="/shop">
          <Button variant="primary">Shop More →</Button>
        </Link>
      </div>
    </div>
  )
}
