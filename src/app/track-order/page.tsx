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

  // Show recent orders from this device
  useEffect(() => {
    const lastOrder = localStorage.getItem('pp-last-order')
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
    <Card key={order.id} className="p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-muted">
          {t('checkout.order_id')}: <strong className="text-foreground">{order.order_id}</strong>
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
          {getStatusLabel(order.status, lang)}
        </span>
      </div>

      <div className="grid sm:grid-cols-2 gap-2 text-sm mb-3">
        <div><span className="text-muted">Name:</span> {order.customer_name}</div>
        <div><span className="text-muted">Phone:</span> {order.customer_phone}</div>
        <div><span className="text-muted">Total:</span> <span className="font-bold text-primary">{formatPrice(order.total)}</span></div>
        <div><span className="text-muted">Date:</span> {new Date(order.created_at).toLocaleDateString('en-IN')}</div>
      </div>

      <div className="text-sm mb-3">
        <span className="text-muted">Items:</span>
        <ul className="mt-1 space-y-1">
          {order.items.map((item: any, i: number) => (
            <li key={i} className="flex justify-between">
              <span>{item.name_en} x{item.qty}</span>
              <span>{formatPrice(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => loadTimeline(order.id)}
        className="text-sm text-primary font-semibold hover:text-primary-dark"
      >
        {expandedId === order.id ? 'Hide Timeline ▲' : 'Show Timeline ▼'}
      </button>

      {/* Timeline */}
      {expandedId === order.id && order.timeline && order.timeline.length > 0 && (
        <div className="mt-4 border-t pt-4 space-y-3">
          {order.timeline.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3 text-sm">
              <span className="text-primary">{statusIcons[entry.status] || <FiClock size={16} />}</span>
              <span className="flex-1">{getStatusLabel(entry.status, lang)}</span>
              {entry.note && <span className="text-xs text-muted">— {entry.note}</span>}
              <span className="text-xs text-muted">
                {new Date(entry.created_at).toLocaleDateString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">{t('track.title')}</h1>
        <p className="text-muted mt-2">{t('track.subtitle')}</p>
      </div>

      {/* Search */}
      <Card className="p-6 mb-8">
        <div className="flex gap-2 mb-4">
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
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            <FiSearch size={18} className="mr-1.5" />
            {t('track.search_btn')}
          </Button>
        </div>
        <p className="text-xs text-muted">
          <FiMail size={12} className="inline mr-1" />
          {t('track.search_email')} &nbsp;|&nbsp; <FiHash size={12} className="inline mr-1" />
          {t('track.search_order')}
        </p>
      </Card>

      {/* Recent orders */}
      {!searched && recentOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-4">{t('track.recent_title')}</h2>
          <div className="space-y-4">
            {recentOrders.map(renderOrderCard)}
          </div>
        </div>
      )}

      {/* Search results */}
      {searched && (
        <div>
          {loading ? (
            <p className="text-center text-muted">{t('common.loading')}</p>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map(renderOrderCard)}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-4xl mb-3">😅</p>
              <p className="text-muted">{t('track.no_orders')}</p>
            </Card>
          )}
        </div>
      )}

      {!searched && recentOrders.length === 0 && (
        <div className="text-center py-10">
          <Link href="/shop">
            <Button variant="primary">Start Shopping →</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
