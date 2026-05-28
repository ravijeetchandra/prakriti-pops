import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const range = searchParams.get('range') || 'month'
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const now = new Date()
  const start = new Date()
  if (range === 'day') start.setDate(now.getDate() - 1)
  else if (range === 'week') start.setDate(now.getDate() - 7)
  else if (range === 'month') start.setMonth(now.getMonth() - 1)
  else if (range === 'year') start.setFullYear(now.getFullYear() - 1)

  const startDate = from || start.toISOString()
  const endDate = to || now.toISOString()

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: true })

  if (error || !orders) return NextResponse.json({ error: error?.message || 'No data' }, { status: 500 })

  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.total), 0)
  const totalProducts = orders.reduce(
    (sum: number, o: any) => sum + (o.items as any[]).reduce((s: number, i: any) => s + i.qty, 0),
    0
  )
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const statusCounts: Record<string, number> = {}
  orders.forEach((o: any) => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1 })

  const revenueByDay: Record<string, number> = {}
  orders.forEach((o: any) => {
    const day = new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
    revenueByDay[day] = (revenueByDay[day] || 0) + Number(o.total)
  })

  const productSales: Record<string, { name: string; qty: number; revenue: number }> = {}
  orders.forEach((o: any) => {
    ;(o.items as any[]).forEach((item: any) => {
      const key = item.product_id || item.name_en
      if (!productSales[key]) productSales[key] = { name: item.name_en, qty: 0, revenue: 0 }
      productSales[key].qty += item.qty
      productSales[key].revenue += item.price * item.qty
    })
  })

  return NextResponse.json({
    totalOrders,
    totalRevenue,
    totalProducts,
    avgOrderValue,
    ordersByStatus: statusCounts,
    revenueByDay,
    topProducts: Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 5),
  })
}
