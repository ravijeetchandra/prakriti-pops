'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/locale'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toaster'
import { formatPrice, getStatusColor, getStatusLabel } from '@/lib/helpers'
import type { Order, OrderTimeline } from '@/lib/types'
import Link from 'next/link'
import { FiArrowLeft, FiClock, FiCheckCircle, FiTruck, FiPackage, FiX } from 'react-icons/fi'

const statusIcons: Record<string, React.ReactNode> = {
  pending: <FiClock size={20} />,
  confirmed: <FiCheckCircle size={20} />,
  shipped: <FiTruck size={20} />,
  delivered: <FiPackage size={20} />,
  cancelled: <FiX size={20} />,
}

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { lang } = useLang()
  const { addToast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [timeline, setTimeline] = useState<OrderTimeline[]>([])
  const [loading, setLoading] = useState(true)
  const [trackingNote, setTrackingNote] = useState('')

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

  const updateStatus = async (status: string) => {
    if (!order) return
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', order.id)

    if (!error) {
      await supabase.from('order_timeline').insert({
        order_id: order.id,
        status,
        note: trackingNote || `Status updated to ${status}`,
        updated_by: 'admin',
      })
      setOrder({ ...order, status: status as any })
      setTrackingNote('')
      addToast(`Status → ${status}`, 'success')
      // Refresh timeline
      const { data: tl } = await supabase.from('order_timeline').select('*').eq('order_id', order.id).order('created_at', { ascending: true })
      if (tl) setTimeline(tl)
    }
  }

  if (loading) return <Spinner />
  if (!order) return <div className="text-center py-20">Order not found</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/admin/orders" className="text-sm text-muted hover:text-primary inline-flex items-center gap-1">
        <FiArrowLeft size={14} /> Back to Orders
      </Link>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold">{order.order_id}</h1>
            <p className="text-sm text-muted">{new Date(order.created_at).toLocaleString('en-IN')}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status, lang)}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer */}
          <div>
            <h3 className="font-semibold mb-2">Customer</h3>
            <p className="text-sm">{order.customer_name}</p>
            <p className="text-sm text-muted">{order.customer_phone}</p>
            {order.email && <p className="text-sm text-muted">{order.email}</p>}
            <p className="text-sm text-muted mt-2">{order.customer_address}</p>
            <p className="text-sm text-muted">Pincode: {order.pincode}</p>
          </div>

          {/* Payment */}
          <div>
            <h3 className="font-semibold mb-2">Payment</h3>
            <p className="text-sm">Method: {order.payment_method.toUpperCase()}</p>
            {order.coupon_code && <p className="text-sm">Coupon: {order.coupon_code}</p>}
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between"><span>Discount</span><span className="text-green-600">-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span className="text-primary">{formatPrice(order.total)}</span></div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="border-t mt-6 pt-6">
          <h3 className="font-semibold mb-3">Items</h3>
          <div className="space-y-2 text-sm">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between py-2 border-b border-gray-100">
                <span>{item.name_en} x{item.qty}</span>
                <span className="font-semibold">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Status Update */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Update Status</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {['pending','confirmed','shipped','delivered','cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => updateStatus(s)}
              disabled={order.status === s}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                order.status === s
                  ? 'bg-gray-200 text-muted cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              {getStatusLabel(s, lang)}
            </button>
          ))}
        </div>
        <input
          placeholder="Add note (optional)"
          value={trackingNote}
          onChange={(e) => setTrackingNote(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </Card>

      {/* Timeline */}
      {timeline.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Timeline</h3>
          <div className="space-y-4">
            {timeline.map((entry) => (
              <div key={entry.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    {statusIcons[entry.status] || <FiClock size={18} />}
                  </div>
                  {entry !== timeline[timeline.length - 1] && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
                </div>
                <div>
                  <p className="font-semibold text-sm capitalize">{entry.status}</p>
                  {entry.note && <p className="text-xs text-muted">{entry.note}</p>}
                  <p className="text-xs text-muted mt-0.5">by {entry.updated_by} — {new Date(entry.created_at).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
