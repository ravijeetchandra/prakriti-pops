'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/locale'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toaster'
import type { Campaign } from '@/lib/types'
import { FiPlus, FiX, FiZap } from 'react-icons/fi'

export default function AdminCampaignsPage() {
  const { t } = useLang()
  const { addToast } = useToast()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title_en: '', title_hi: '', type: 'flash_sale' as 'flash_sale' | 'bundle',
    discount_percent: '10', start_time: '', end_time: '', is_active: true,
  })

  useEffect(() => {
    ;(async () => {
      const { data }: any = await supabase.from('campaigns').select('*').order('created_at', { ascending: false })
      if (data) setCampaigns(data)
      setLoading(false)
    })()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('campaigns').insert({
      ...form,
      discount_percent: parseInt(form.discount_percent),
      product_ids: [],
      start_time: new Date(form.start_time).toISOString(),
      end_time: new Date(form.end_time).toISOString(),
    })
    if (error) { addToast(error.message, 'error'); return }
    addToast('Campaign created! ⚡', 'success')
    setShowForm(false)
    setForm({ title_en: '', title_hi: '', type: 'flash_sale', discount_percent: '10', start_time: '', end_time: '', is_active: true })
    const { data: reloadData } = await supabase.from('campaigns').select('*').order('created_at', { ascending: false })
    if (reloadData) setCampaigns(reloadData)
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('campaigns').update({ is_active: !current }).eq('id', id)
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, is_active: !current } : c)))
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">⚡ Campaigns</h1>
        <Button onClick={() => setShowForm(true)}><FiPlus size={16} className="mr-2" /> {t('admin.add_campaign')}</Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">{t('admin.add_campaign')}</h2>
              <button onClick={() => setShowForm(false)}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Title (English)" value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} required />
              <Input label="Title (हिन्दी)" value={form.title_hi} onChange={(e) => setForm({ ...form, title_hi: e.target.value })} required />
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none">
                  <option value="flash_sale">Flash Sale</option>
                  <option value="bundle">Bundle Offer</option>
                </select>
              </div>
              <Input label="Discount %" type="number" value={form.discount_percent} onChange={(e) => setForm({ ...form, discount_percent: e.target.value })} required />
              <Input label="Start Time" type="datetime-local" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} required />
              <Input label="End Time" type="datetime-local" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} required />
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

      <div className="grid gap-4">
        {campaigns.map((c) => {
          const active = c.is_active && new Date(c.start_time) <= new Date() && new Date(c.end_time) >= new Date()
          return (
            <Card key={c.id} className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FiZap className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{c.title_en} — {c.discount_percent}% OFF</h3>
                    <p className="text-xs text-muted">{new Date(c.start_time).toLocaleDateString()} → {new Date(c.end_time).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-muted'}`}>
                    {active ? 'Live' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => toggleActive(c.id, c.is_active)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium ${c.is_active ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                  >
                    {c.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </Card>
          )
        })}
        {campaigns.length === 0 && <p className="text-muted text-center py-8">No campaigns yet</p>}
      </div>
    </div>
  )
}
