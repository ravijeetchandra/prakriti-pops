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
import { getProductImage } from '@/lib/productImages'
import { motion } from 'framer-motion'

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
  if (!order) return (
    <div className="bg-cream min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-6xl mb-4">😅</p>
        <h1 className="text-2xl font-serif font-bold">Order not found</h1>
        <Link href="/shop" className="mt-6 inline-block">
          <Button variant="primary">Back to Shop</Button>
        </Link>
      </div>
    </div>
  )

  const statusIcons: Record<string, React.ReactNode> = {
    pending: <FiClock size={20} />,
    confirmed: <FiCheckCircle size={20} />,
    shipped: <FiTruck size={20} />,
    delivered: <FiPackage size={20} />,
    cancelled: <FiX size={20} />,
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4">
            {t('checkout.confirm_title')}
          </h1>
          <p className="text-lg text-muted font-light max-w-xl mx-auto">
            {t('checkout.confirm_msg')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 text-left bg-white border-none shadow-xl rounded-[2rem]">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
              <div>
                <p className="text-xs text-muted uppercase tracking-widest mb-1">{t('checkout.order_id')}</p>
                <p className="font-serif text-xl font-bold text-foreground">{order.order_id}</p>
              </div>
              <span className={`px-4 py-1 rounded-full text-xs font-bold shadow-sm ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status, lang)}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-4 mb-8">
              <p className="text-xs text-muted uppercase tracking-widest mb-3">Order Summary</p>
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                    <img
                      src={getProductImage(item.name_en)}
                      alt={item.name_en}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="flex-1 font-medium text-foreground">{item.name_en} <span className="text-muted font-light">x{item.qty}</span></span>
                  <span className="font-bold text-foreground">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            <div className="bg-cream rounded-2xl p-6 space-y-2">
              <div className="flex justify-between items-center text-lg font-serif font-bold">
                <span>Total Amount</span>
                <span className="text-primary text-2xl">{formatPrice(order.total)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted font-light">
                <span>{t('checkout.expected_delivery')}</span>
                <span className="font-medium text-foreground italic">Coming soon to your door!</span>
              </div>
            </div>

            {/* Timeline */}
            {timeline.length > 0 && (
              <div className="mt-10">
                <h3 className="font-serif text-xl font-bold mb-6 text-foreground">Journey of your order</h3>
                <div className="space-y-6 relative">
                  <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-gray-100" />
                  {timeline.map((entry, idx) => (
                    <div key={entry.id} className="flex items-start gap-6 relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${idx === timeline.length - 1 ? 'bg-primary text-white' : 'bg-white text-primary border border-primary/20'}`}>
                        {statusIcons[entry.status] || <FiClock size={16} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-foreground text-sm">{getStatusLabel(entry.status, lang)}</p>
                          <span className="text-xs text-muted font-light">
                            {new Date(entry.created_at).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        {entry.note && <p className="text-xs text-muted mt-1 font-light">{entry.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <Link href={`/track-order`}>
            <Button variant="outline" size="lg" className="px-8 py-3 rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-all">
              {t('checkout.track_btn')}
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="primary" size="lg" className="px-10 py-3 rounded-full shadow-xl shadow-primary/20 btn-premium">
              Shop More →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}