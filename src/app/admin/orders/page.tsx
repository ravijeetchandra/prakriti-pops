'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/locale'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { formatPrice, getStatusColor, getStatusLabel } from '@/lib/helpers'
import { useToast } from '@/components/ui/Toaster'
import type { Order } from '@/lib/types'
import Link from 'next/link'
import { FiEye, FiTrash2 } from 'react-icons/fi'

export default function AdminOrdersPage() {
  const { lang, t } = useLang()
  const { addToast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }: { data: Order[] | null }) => {
        if (data) setOrders(data)
        setLoading(false)
      })
  }, [])

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (!error) {
      await supabase.from('order_timeline').insert({
        order_id: id,
        status,
        note: `Status updated to ${status}`,
        updated_by: 'admin',
      })
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: status as any } : o)))
      addToast(`Order ${status}`, 'success')
    }
  }

  const deleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (!error) {
      setOrders((prev) => prev.filter((o) => o.id !== id))
      addToast('Order deleted successfully', 'success')
    } else {
      addToast('Failed to delete order', 'error')
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  if (loading) return <Spinner />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">📦 Orders</h1>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
              filter === s ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-muted hover:bg-gray-50'
            }`}
          >
            {s === 'all' ? 'All' : getStatusLabel(s, lang)} ({s === 'all' ? orders.length : orders.filter((o) => o.status === s).length})
          </button>
        ))}
      </div>

      {/* Orders table */}
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-4 font-semibold">Order ID</th>
              <th className="text-left p-4 font-semibold">Customer</th>
              <th className="text-left p-4 font-semibold">Items</th>
              <th className="text-left p-4 font-semibold">Total</th>
              <th className="text-left p-4 font-semibold">Date</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-semibold">{order.order_id}</td>
                <td className="p-4">{order.customer_name}<br /><span className="text-xs text-muted">{order.email}</span></td>
                <td className="p-4 text-muted">{(order.items as any[]).length} item(s)</td>
                <td className="p-4 font-semibold">{formatPrice(Number(order.total))}</td>
                <td className="p-4 text-muted text-xs">{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-bold border-0 ${getStatusColor(order.status)}`}
                  >
                    {['pending','confirmed','shipped','delivered','cancelled'].map((s) => (
                      <option key={s} value={s}>{getStatusLabel(s, lang)}</option>
                    ))}
                  </select>
                </td>
                 <td className="p-4">
                   <div className="flex items-center gap-2">
                     <Link href={`/admin/orders/${order.order_id}`}>
                       <Button variant="ghost" size="sm">
                         <FiEye size={16} />
                       </Button>
                     </Link>
                     <Button 
                       variant="ghost" 
                       size="sm" 
                       className="text-red-600 hover:bg-red-50 hover:text-red-700"
                       onClick={() => deleteOrder(order.id)}
                     >
                       <FiTrash2 size={16} />
                     </Button>
                   </div>
                 </td>

              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-muted">No orders found</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
