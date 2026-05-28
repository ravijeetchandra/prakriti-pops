'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/locale'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toaster'
import { formatPrice } from '@/lib/helpers'
import type { Coupon } from '@/lib/types'
import { FiPlus, FiX } from 'react-icons/fi'

export default function AdminCouponsPage() {
  const { t } = useLang()
  const { addToast } = useToast()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    code: '', discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: '', min_cart_value: '0', max_uses: '0', expires_at: '', is_active: true,
  })

  useEffect(() => {
    ;(async () => {
      const { data }: any = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
      if (data) setCoupons(data)
      setLoading(false)
    })()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('coupons').insert({
      code: form.code.toUpperCase(),
      discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value),
      min_cart_value: parseFloat(form.min_cart_value),
      max_uses: parseInt(form.max_uses),
      expires_at: form.expires_at || null,
      is_active: form.is_active,
    })
    if (error) { addToast(error.message, 'error'); return }
    addToast('Coupon added!', 'success')
    setShowForm(false)
    setForm({ code: '', discount_type: 'percentage', discount_value: '', min_cart_value: '0', max_uses: '0', expires_at: '', is_active: true })
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
    if (data) setCoupons(data)
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('coupons').update({ is_active: !current }).eq('id', id)
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, is_active: !current } : c)))
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">🏷️ Coupons</h1>
        <Button onClick={() => setShowForm(true)}><FiPlus size={16} className="mr-2" /> {t('admin.add_coupon')}</Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">{t('admin.add_coupon')}</h2>
              <button onClick={() => setShowForm(false)}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="MAKHANA20" required />
              <div>
                <label className="block text-sm font-medium mb-1">Discount Type</label>
                <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value as any })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (₹)</option>
                </select>
              </div>
              <Input label="Discount Value" type="number" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} required />
              <Input label="Min Cart Value (₹)" type="number" value={form.min_cart_value} onChange={(e) => setForm({ ...form, min_cart_value: e.target.value })} />
              <Input label="Max Uses (0 = unlimited)" type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} />
              <Input label="Expiry Date" type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                Active
              </label>
              <div className="flex gap-3">
                <Button type="submit">{t('admin.save')}</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>{t('admin.cancel')}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-4 font-semibold">Code</th>
              <th className="text-left p-4 font-semibold">Discount</th>
              <th className="text-left p-4 font-semibold">Min Cart</th>
              <th className="text-left p-4 font-semibold">Uses</th>
              <th className="text-left p-4 font-semibold">Expires</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Toggle</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-bold">{c.code}</td>
                <td className="p-4">{c.discount_type === 'percentage' ? `${c.discount_value}%` : formatPrice(c.discount_value)}</td>
                <td className="p-4">{formatPrice(c.min_cart_value)}</td>
                <td className="p-4">{c.used_count}/{c.max_uses === 0 ? '∞' : c.max_uses}</td>
                <td className="p-4 text-xs">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => toggleActive(c.id, c.is_active)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${c.is_active ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                  >
                    {c.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
