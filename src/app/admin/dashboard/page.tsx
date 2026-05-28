'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/locale'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { formatPrice, cn } from '@/lib/helpers'
import type { Order } from '@/lib/types'
import { FiDollarSign, FiPackage, FiShoppingCart, FiTrendingUp } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useAdminAuth } from '@/hooks/useAdminAuth'

type Range = 'day' | 'week' | 'month' | 'year' | 'custom'

export default function AdminDashboardPage() {
  const { t } = useLang()
  const { isAuthenticated, isLoading: authLoading } = useAdminAuth()
  const [range, setRange] = useState<Range>('month')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [adminName, setAdminName] = useState('Admin')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const getDateRange = () => {
    const now = new Date()
    const start = new Date()
    if (range === 'day') start.setDate(now.getDate() - 1)
    else if (range === 'week') start.setDate(now.getDate() - 7)
    else if (range === 'month') start.setMonth(now.getMonth() - 1)
    else if (range === 'year') start.setFullYear(now.getFullYear() - 1)
    else if (range === 'custom') return { from: customFrom, to: customTo }
    return { from: start.toISOString(), to: now.toISOString() }
  }

  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return
    setLoading(true)
    
    try {
      // Fetch admin name
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        const { data: adminData } = await supabase
          .from('admin_users')
          .select('name')
          .eq('email', user.email)
          .single()
        if (adminData) setAdminName(adminData.name)
      }

      const { from, to } = getDateRange()
      const { data } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', from)
        .lte('created_at', to)
        .order('created_at', { ascending: true })
      if (data) setOrders(data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [range, isAuthenticated])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // KPIs
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0)
  const totalProducts = orders.reduce((sum, o) => 
    sum + (o.items as any[]).reduce((s: number, i: any) => s + i.qty, 0), 0)
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  if (authLoading || loading) return <Spinner text="Crunching numbers..." />
  if (!isAuthenticated) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-muted text-sm font-medium mb-1">Hello {adminName} 👋</p>
          <h1 className="text-2xl font-extrabold">🧠 Dashboard</h1>
        </div>

        {/* Range selector */}
        <div className="flex flex-wrap gap-2">
          {(['day', 'week', 'month', 'year'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                range === r ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-muted hover:bg-gray-50'
              )}
            >
              {r === 'day' ? 'Today' : r === 'week' ? '7 Days' : r === 'month' ? '30 Days' : '1 Year'}
            </button>
          ))}
          <button
            onClick={() => setRange('custom')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              range === 'custom' ? 'bg-primary text-white' : 'bg-white border border-gray-200 text-muted hover:bg-gray-50'
            )}
          >
            Custom
          </button>
        </div>
      </div>

      {/* Custom date range */}
      {range === 'custom' && (
        <div className="flex gap-3 items-center">
          <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <span className="text-muted">to</span>
          <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          <Button onClick={fetchStats} size="sm">Apply</Button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: FiShoppingCart, label: t('admin.total_orders'), value: totalOrders, color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: FiDollarSign, label: t('admin.revenue'), value: formatPrice(totalRevenue), color: 'text-green-600', bg: 'bg-green-50' },
          { icon: FiPackage, label: t('admin.products_sold'), value: totalProducts, color: 'text-purple-600', bg: 'bg-purple-50' },
          { icon: FiTrendingUp, label: t('admin.avg_order'), value: formatPrice(avgOrderValue), color: 'text-primary', bg: 'bg-primary/10' },
        ].map((kpi, i) => (
          <Card key={i} className="p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted">{kpi.label}</p>
                <p className="text-xl font-bold">{kpi.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-semibold mb-4">Revenue Over Time</h3>
          <div className="h-64" style={{ minHeight: 256 }}>
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={chartData}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#D4A853" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status pie */}
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Orders by Status</h3>
          <div className="h-64" style={{ minHeight: 256 }}>
            <ResponsiveContainer width="100%" height={256}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#999'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top products */}
        <Card className="p-5">
          <h3 className="font-semibold mb-4">🏆 Top Products</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-muted w-5">#{i + 1}</span>
                  <span className="truncate">{p.name}</span>
                </div>
                <span className="font-semibold whitespace-nowrap ml-2">{p.qty} sold</span>
              </div>
            ))}
            {topProducts.length === 0 && <p className="text-sm text-muted">No data</p>}
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="p-5">
          <h3 className="font-semibold mb-4">📊 Quick Stats</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted">Avg Delivery</span><span className="font-semibold">{avgDeliveryDays.toFixed(1)} days</span></div>
            <div className="flex justify-between"><span className="text-muted">Repeat Rate</span><span className="font-semibold">{repeatRate}%</span></div>
            <div className="flex justify-between"><span className="text-muted">COD Orders</span><span className="font-semibold">{codPercent}%</span></div>
            <div className="flex justify-between"><span className="text-muted">Unique Customers</span><span className="font-semibold">{repeatCustomers}</span></div>
            <div className="flex justify-between"><span className="text-muted">Cancelled</span><span className="font-semibold">{statusCounts['cancelled'] || 0}</span></div>
          </div>
        </Card>

        {/* Recent orders */}
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-2">
            {orders.slice(-5).reverse().map((o) => (
              <div key={o.id} className="flex justify-between text-xs py-1.5 border-b border-gray-100 last:border-0">
                <div>
                  <span className="font-semibold">{o.order_id}</span>
                  <span className="text-muted ml-2">{o.customer_name?.split(' ')[0]}</span>
                </div>
                <span className="font-semibold">{formatPrice(Number(o.total))}</span>
              </div>
            ))}
            {orders.length === 0 && <p className="text-sm text-muted">No orders yet</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}
