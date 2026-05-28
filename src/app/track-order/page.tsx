'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/locale'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { formatPrice, getStatusColor, getStatusLabel } from '@/lib/helpers'
import type { Order, OrderTimeline } from '@/lib/types'
import { FiSearch, FiClock, FiCheckCircle, FiTruck, FiPackage, FiX, FiMail, FiHash } from 'react-icons/fi'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

const statusIcons: Record<string, React.ReactNode> = {
  pending: <FiClock size={20} />,
  confirmed: <FiCheckCircle size={20} />,
  shipped: <FiTruck size={20} />,
  delivered: <FiPackage size={20} />,
  cancelled: <FiX size={20} />,
}

export default function TrackOrderPage() {
  const { lang, t } = useLang()
  const [query, setQuery] = useState('')
  const [mode, setMode] = useState<'auto' | 'email' | 'order_id'>('auto')
  const [orders, setOrders] = useState<(Order & { timeline?: OrderTimeline[] })[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const sessionId = localStorage.getItem('pp-guest-session')
    if (sessionId) {
      supabase
        .from('orders')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(5)
        .then(({ data }: { data: Order[] | null }) => {
          if (data && data.length > 0) setRecentOrders(data)
        })
    }
  }, [])

  const detectMode = (val: string) => {
    if (val.includes('@')) return 'email'
    if (/^PP-\d+$/i.test(val.trim())) return 'order_id'
    return 'auto'
  }

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    setExpandedId(null)

    const detectedMode = detectMode(query)
    let data: Order[] | null = null

    if (detectedMode === 'email') {
      const { data: result } = await supabase
        .from('orders')
        .select('*')
        .eq('email', query.trim().toLowerCase())
        .order('created_at', { ascending: false })
      data = result
    } else {
      const q = query.trim().toUpperCase()
      const { data: result } = await supabase
        .from('orders')
        .select('*')
        .eq('order_id', q)
      data = result
    }

    if (data) {
      setOrders(data)
    } else {
      setOrders([])
    }
    setLoading(false)
  }

  const loadTimeline = async (orderId: string) => {
    if (expandedId === orderId) {
      setExpandedId(null)
      return
    }
    const { data: tlData } = await supabase
      .from('order_timeline')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: true })
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, timeline: tlData || [] } : o))
    )
    setExpandedId(orderId)
  }

  const renderOrderCard = (order: Order & { timeline?: OrderTimeline[] }) => (
    <motion.div
      key={order.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <Card className="p-6 bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-300 group">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(order.status).replace('text-', 'bg-').replace('bg-', 'bg-opacity-10 text-')}`}>
               {statusIcons[order.status] || <FiClock size={20} />}
             </div>
             <div>
               <p className="text-xs text-muted uppercase tracking-widest">Order ID</p>
               <p className="font-bold text-foreground">{order.order_id}</p>
             </div>
          </div>
          <span className={`px-4 py-1 rounded-full text-xs font-bold shadow-sm ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status, lang)}
          </span>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 text-sm mb-6 py-4 border-y border-gray-50">
          <div>
            <p className="text-muted mb-1">Customer</p>
            <p className="font-semibold text-foreground">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-muted mb-1">Order Value</p>
            <p className="font-bold text-primary">{formatPrice(order.total)}</p>
          </div>
          <div>
            <p className="text-muted mb-1">Date Placed</p>
            <p className="font-semibold text-foreground">{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-xs text-muted uppercase tracking-widest mb-3">Ordered Items</p>
          <div className="space-y-2">
            {order.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-foreground font-medium">{item.name_en} <span className="text-muted font-light">x{item.qty}</span></span>
                <span className="text-muted">{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => loadTimeline(order.id)}
          className="w-full py-3 rounded-xl bg-cream text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
        >
          {expandedId === order.id ? 'Hide Timeline' : 'Track Progress'}
          <span>{expandedId === order.id ? '▲' : '▼'}</span>
        </button>

        <AnimatePresence>
          {expandedId === order.id && order.timeline && order.timeline.length > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-6 relative">
                {/* Timeline Line */}
                <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gray-100" />
                
                {order.timeline?.map((entry, idx) => (
                  <div key={entry.id} className="flex items-start gap-6 relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${idx === (order.timeline?.length || 0) - 1 ? 'bg-primary text-white' : 'bg-white text-primary border border-primary/20'}`}>
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
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )

  return (
    <div className="bg-cream min-h-screen">
      {/* Header */}
      <section className="bg-secondary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-4"
          >
            {t('track.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 font-light"
          >
            {t('track.subtitle')}
          </motion.p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <Card className="p-8 bg-white border-none shadow-xl rounded-[2rem] relative z-10">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder={
                    mode === 'email'
                      ? t('track.placeholder_email')
                      : mode === 'order_id'
                      ? t('track.placeholder_order')
                      : 'Email or Order ID (PP-1032)'
                  }
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setMode(detectMode(e.target.value))
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-12 rounded-xl"
                />
              </div>
              <Button onClick={handleSearch} disabled={loading} size="lg" className="h-12 px-8 rounded-xl shadow-lg shadow-primary/20 btn-premium">
                <FiSearch size={18} className="mr-2" />
                {t('track.search_btn')}
              </Button>
            </div>
            <div className="flex items-center justify-center gap-4 text-xs text-muted font-medium">
              <div className="flex items-center gap-1">
                <FiMail size={14} className="text-primary" />
                {t('track.search_email')}
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1">
                <FiHash size={14} className="text-primary" />
                {t('track.search_order')}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Orders */}
        {!searched && recentOrders.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-foreground">{t('track.recent_title')}</h2>
              <div className="h-px flex-1 bg-gray-200 mx-4" />
            </div>
            <div className="space-y-6">
              {recentOrders.map(renderOrderCard)}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searched && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-20">
                <Spinner text={t('common.loading')} />
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl font-bold text-foreground">Search Results</h2>
                  <div className="h-px flex-1 bg-gray-200 mx-4" />
                </div>
                {orders.map(renderOrderCard)}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 text-center rounded-[2rem] shadow-sm border border-gray-100"
              >
                <p className="text-6xl mb-4">😅</p>
                <p className="text-lg text-muted font-light">{t('track.no_orders')}</p>
                <Button variant="outline" className="mt-6 rounded-full" onClick={() => setSearched(false)}>
                  Try again
                </Button>
              </motion.div>
            )}
          </div>
        )}

        {!searched && recentOrders.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📦</div>
            <h3 className="text-2xl font-serif font-bold mb-4">No recent orders found</h3>
            <Link href="/shop">
              <Button variant="primary" size="lg" className="px-10 py-4 rounded-full shadow-xl shadow-primary/20 btn-premium">
                Start Shopping →
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}