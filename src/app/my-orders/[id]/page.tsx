'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/locale'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toaster'
import { formatPrice, getStatusColor, getStatusLabel } from '@/lib/helpers'
import type { Order, OrderTimeline } from '@/lib/types'
import Link from 'next/link'
import { FiClock, FiCheckCircle, FiTruck, FiPackage, FiX, FiArrowLeft } from 'react-icons/fi'

const statusIcons: Record<string, React.ReactNode> = {
  pending: <FiClock size={20} />,
  confirmed: <FiCheckCircle size={20} />,
  shipped: <FiTruck size={20} />,
  delivered: <FiPackage size={20} />,
  cancelled: <FiX size={20} />,
}

export default function MyOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { lang, t } = useLang()
  const { addToast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [timeline, setTimeline] = useState<OrderTimeline[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('orders').select('*').eq('order_id', id).single().then(({ data }: { data: Order | null }) => {
      if (data) {
        setOrder(data)
        supabase.from('order_timeline').select('*').eq('order_id', data.id).order('created_at', { ascending: true }).then(({ data: tl }: { data: OrderTimeline[] | null }) => {
          if (tl) setTimeline(tl)
        })
      }
      setLoading(false)
    })
  }, [id])

  const handleCancel = async () => {
    if (!order || order.status !== 'pending') return
    const confirm = window.confirm(t('my_orders.cancel_confirm'))
    if (!confirm) return

    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', order.id)

    if (!error) {
      await supabase.from('order_timeline').insert({
        order_id: order.id,
        status: 'cancelled',
        note: 'Cancelled by customer',
        updated_by: 'user',
      })
      addToast('Order cancelled', 'info')
      setOrder({ ...order, status: 'cancelled' })
    }
  }

  if (loading) return <Spinner />
  if (!order) return <div className="text-center py-20">Order not found</div>

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/my-orders" className="text-sm text-muted hover:text-primary mb-6 inline-flex items-center gap-1">
        <FiArrowLeft size={14} /> {t('common.back')}
      </Link>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">{order.order_id}</h1>
            <p className="text-sm text-muted mt-1">
              Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status, lang)}
          </span>
        </div>

        {/* Timeline */}
        {timeline.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Status Timeline</h3>
            <div className="space-y-4">
              {timeline.map((entry) => (
                <div key={entry.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {statusIcons[entry.status] || <FiClock size={18} />}
                    </div>
                    {entry !== timeline[timeline.length - 1] && (
                      <div className="w-0.5 flex-1 bg-gray-200 my-1" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{getStatusLabel(entry.status, lang)}</p>
                    {entry.note && <p className="text-xs text-muted">{entry.note}</p>}
                    <p className="text-xs text-muted mt-0.5">
                      {new Date(entry.created_at).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items */}
        <h3 className="font-semibold mb-3">Items</h3>
        <div className="space-y-2 text-sm">
          {order.items.map((item: any, i: number) => (
            <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
              <span>{item.name_en} x{item.qty}</span>
              <span className="font-semibold">{formatPrice(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted">Discount</span>
              <span className="text-green-600">-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="border-t mt-6 pt-6">
          <h3 className="font-semibold mb-2">Delivery Details</h3>
          <p className="text-sm text-muted">{order.customer_name}</p>
          <p className="text-sm text-muted">{order.customer_phone}</p>
          {order.email && <p className="text-sm text-muted">{order.email}</p>}
          <p className="text-sm text-muted mt-1">{order.customer_address}</p>
          <p className="text-sm text-muted">Pincode: {order.pincode}</p>
        </div>

        {/* Actions */}
        {order.status === 'pending' && (
          <div className="border-t mt-6 pt-6">
            <Button variant="danger" onClick={handleCancel}>
              {t('my_orders.cancel')}
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
