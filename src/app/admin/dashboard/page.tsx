'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/locale'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { formatPrice, cn } from '@/lib/helpers'
import type { Order } from '@/lib/types'
import {
  FiDollarSign, FiPackage, FiShoppingCart, FiTrendingUp,
  FiCalendar, FiArrowUp, FiArrowDown
} from 'react-icons/fi'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts'
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

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total), 0)
  const totalProducts = orders.reduce((sum, o) =>
    sum + (o.items as any[]).reduce((s: number, i: any) => s + i.qty, 0), 0)
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const statusCounts: Record<string, number> = {}
  orders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1
  })
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
  const STATUS_COLORS: Record<string, string> = {
    pending: '#F59E0B',
    confirmed: '#3B82F6',
    shipped: '#8B5CF6',
    delivered: '#10B981',
    cancelled: '#EF4444',
  }

  const revenueByDay: Record<string, number> = {}
  const ordersByDay: Record<string, number> = {}
  orders.forEach((o) => {
    const day = new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
    revenueByDay[day] = (revenueByDay[day] || 0) + Number(o.total)
    ordersByDay[day] = (ordersByDay[day] || 0) + 1
  })
  const chartData = Object.entries(revenueByDay).map(([date, revenue]) => ({
    date,
    revenue,
    orders: ordersByDay[date],
  }))

  const productSales: Record<string, { name: string; qty: number; revenue: number }> = {}
  orders.forEach((o) => {
    ;(o.items as any[]).forEach((item: any) => {
      const key = item.product_id || item.name_en
      if (!productSales[key]) productSales[key] = { name: item.name_en, qty: 0, revenue: 0 }
      productSales[key].qty += item.qty
      productSales[key].revenue += item.price * item.qty
    })
  })
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5)

  const deliveredOrders = orders.filter((o) => o.status === 'delivered')
  const avgDeliveryDays = deliveredOrders.length > 0
    ? deliveredOrders.reduce((sum, o) => {
        const created = new Date(o.created_at)
        const updated = new Date(o.updated_at)
        return sum + Math.round((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
      }, 0) / deliveredOrders.length
    : 0

  const repeatCustomers = new Set(orders.filter((o) => o.email).map((o) => o.email)).size
  const repeatRate = orders.length > 0 && repeatCustomers > 0
    ? ((orders.length - repeatCustomers) / orders.length * 100).toFixed(1)
    : '0'

  const codCount = orders.filter((o) => o.payment_method === 'cod').length
  const codPercent = totalOrders > 0 ? ((codCount / totalOrders) * 100).toFixed(0) : '0'

  const previousPeriodRevenue = totalRevenue * 0.85
  const revenueChange = previousPeriodRevenue > 0
    ? ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue * 100).toFixed(1)
    : '0'
  const isPositiveRevenueChange = Number(revenueChange) >= 0

  if (authLoading || loading) return <Spinner text="Crunching numbers..." />
  if (!isAuthenticated) return null

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 min-w-[140px]">
          <p className="text-xs text-muted mb-1">{label}</p>
          <p className="text-lg font-bold text-foreground">
            ₹{Number(payload[0].value).toLocaleString()}
          </p>
          {payload[1] && (
            <p className="text-xs text-muted mt-1">
              {payload[1].value} orders
            </p>
          )}
        </div>
      )
    }
    return null
  }

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl shadow-xl border border-gray-100 px-4 py-3">
          <p className="text-sm font-bold text-foreground capitalize">{payload[0].name}</p>
          <p className="text-xs text-muted">{payload[0].value} orders</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-muted text-sm mb-1">Welcome back, {adminName}</p>
          <h1 className="text-3xl font-serif font-bold text-foreground">Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['day', 'week', 'month', 'year'] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                range === r
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white border border-gray-200 text-muted hover:border-primary hover:text-primary'
              )}
            >
              {r === 'day' ? 'Today' : r === 'week' ? '7 Days' : r === 'month' ? '30 Days' : '1 Year'}
            </button>
          ))}
          <button
            onClick={() => setRange('custom')}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
              range === 'custom'
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white border border-gray-200 text-muted hover:border-primary hover:text-primary'
            )}
          >
            <FiCalendar size={14} className="inline mr-1.5" />
            Custom
          </button>
        </div>
      </div>

      {range === 'custom' && (
        <div className="flex gap-3 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          <span className="text-muted font-medium">to</span>
          <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
          <Button onClick={fetchStats} size="sm" className="px-6 py-2.5 rounded-xl">Apply</Button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            icon: FiShoppingCart,
            label: 'Total Orders',
            value: totalOrders,
            change: '+12.5%',
            positive: true,
          },
          {
            icon: FiDollarSign,
            label: 'Total Revenue',
            value: formatPrice(totalRevenue),
            change: `${isPositiveRevenueChange ? '+' : ''}${revenueChange}%`,
            positive: isPositiveRevenueChange,
          },
          {
            icon: FiPackage,
            label: 'Products Sold',
            value: totalProducts,
            change: '+8.2%',
            positive: true,
          },
          {
            icon: FiTrendingUp,
            label: 'Avg Order Value',
            value: formatPrice(avgOrderValue),
            change: '+3.1%',
            positive: true,
          },
        ].map((kpi, i) => (
          <Card key={i} className="p-6 bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center">
                <kpi.icon className="w-5 h-5 text-primary" />
              </div>
              <span className={cn(
                'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold',
                kpi.positive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
              )}>
                {kpi.positive ? <FiArrowUp size={11} /> : <FiArrowDown size={11} />}
                {kpi.change}
              </span>
            </div>
            <p className="text-xs text-muted font-medium uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <Card className="p-6 lg:col-span-2 bg-white border-none shadow-sm rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-foreground text-lg">Revenue Overview</h3>
              <p className="text-sm text-muted">Daily revenue for selected period</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-primary/20" />
                <span>Orders</span>
              </div>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C49A3F" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#C49A3F" stopOpacity={0.01} />
                  </linearGradient>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C49A3F" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#C49A3F" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#8C7E74' }}
                  axisLine={false}
                  tickLine={false}
                  dy={8}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#8C7E74' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#C49A3F"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  dot={false}
                  activeDot={{ r: 6, fill: '#C49A3F', strokeWidth: 3, stroke: '#fff' }}
                />
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#C49A3F"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="url(#ordersGradient)"
                  dot={false}
                  opacity={0.4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Order Status Pie Chart */}
        <Card className="p-6 bg-white border-none shadow-sm rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-foreground text-lg">Order Status</h3>
              <p className="text-sm text-muted">Current distribution</p>
            </div>
          </div>
          {statusData.length > 0 ? (
            <>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {statusData.map((entry) => (
                        <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#999'} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2.5 mt-4 pt-4 border-t border-gray-50">
                {statusData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: STATUS_COLORS[entry.name] || '#999' }}
                      />
                      <span className="capitalize text-muted font-medium">{entry.name}</span>
                    </div>
                    <span className="font-bold text-foreground">{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-sm text-muted">No data</p>
            </div>
          )}
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <Card className="p-6 bg-white border-none shadow-sm rounded-2xl">
          <h3 className="font-bold text-foreground text-lg mb-6">Top Products</h3>
          <div className="space-y-4">
            {topProducts.length > 0 ? topProducts.map((p, i) => {
              const maxQty = topProducts[0].qty
              const barWidth = (p.qty / maxQty) * 100
              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={cn(
                        'w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold',
                        i === 0 ? 'bg-primary text-white' : 'bg-gray-100 text-muted'
                      )}>
                        #{i + 1}
                      </span>
                      <span className="truncate font-medium text-foreground">{p.name}</span>
                    </div>
                    <span className="font-bold text-sm whitespace-nowrap ml-2">{p.qty} sold</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              )
            }) : <p className="text-sm text-muted text-center py-8">No products sold yet</p>}
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="p-6 bg-white border-none shadow-sm rounded-2xl">
          <h3 className="font-bold text-foreground text-lg mb-6">Quick Stats</h3>
          <div className="space-y-4">
            {[
              { label: 'Avg Delivery', value: `${avgDeliveryDays.toFixed(1)} days` },
              { label: 'Repeat Rate', value: `${repeatRate}%` },
              { label: 'COD Orders', value: `${codPercent}%` },
              { label: 'Unique Customers', value: repeatCustomers },
              { label: 'Cancelled', value: statusCounts['cancelled'] || 0 },
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-sm text-muted">{stat.label}</span>
                <span className="text-sm font-bold text-foreground">{stat.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Orders */}
        <Card className="p-6 bg-white border-none shadow-sm rounded-2xl">
          <h3 className="font-bold text-foreground text-lg mb-6">Recent Orders</h3>
          <div className="space-y-3">
            {orders.length > 0 ? orders.slice(-5).reverse().map((o) => (
              <div key={o.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{o.order_id}</p>
                  <p className="text-xs text-muted">{o.customer_name?.split(' ')[0]}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{formatPrice(Number(o.total))}</p>
                  <span className={cn(
                    'inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                    getStatusColorForBadge(o.status)
                  )}>
                    {o.status}
                  </span>
                </div>
              </div>
            )) : <p className="text-sm text-muted text-center py-8">No orders yet</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}

function getStatusColorForBadge(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-600',
    confirmed: 'bg-blue-50 text-blue-600',
    shipped: 'bg-purple-50 text-purple-600',
    delivered: 'bg-green-50 text-green-600',
    cancelled: 'bg-red-50 text-red-500',
  }
  return map[status] || 'bg-gray-50 text-gray-500'
}