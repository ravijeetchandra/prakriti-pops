'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/locale'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toaster'
import type { Announcement } from '@/lib/types'
import { FiPlus, FiX } from 'react-icons/fi'

export default function AdminAnnouncementsPage() {
  const { t } = useLang()
  const { addToast } = useToast()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    text_en: '', text_hi: '', bg_color: '#1B5E20', text_color: '#ffffff', is_active: true, expires_at: '',
  })

  useEffect(() => {
    ;(async () => {
      const { data }: any = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
      if (data) setAnnouncements(data)
      setLoading(false)
    })()
  }, [])

  const resetForm = () => {
    setForm({ text_en: '', text_hi: '', bg_color: '#1B5E20', text_color: '#ffffff', is_active: true, expires_at: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const editItem = (a: Announcement) => {
    setForm({ text_en: a.text_en, text_hi: a.text_hi, bg_color: a.bg_color, text_color: a.text_color, is_active: a.is_active, expires_at: a.expires_at?.split('T')[0] || '' })
    setEditingId(a.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...form, expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null }
    if (editingId) {
      await supabase.from('announcements').update(payload).eq('id', editingId)
      addToast('Announcement updated!', 'success')
    } else {
      await supabase.from('announcements').insert(payload)
      addToast('Announcement added!', 'success')
    }
    resetForm()
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
    if (data) setAnnouncements(data)
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete?')) return
    await supabase.from('announcements').delete().eq('id', id)
    setAnnouncements((prev) => prev.filter((a) => a.id !== id))
    addToast('Deleted', 'info')
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">🔔 Announcements</h1>
        <Button onClick={() => { resetForm(); setShowForm(true) }}><FiPlus size={16} className="mr-2" /> {t('admin.add_announcement')}</Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">{editingId ? 'Edit' : 'Add'} Announcement</h2>
              <button onClick={resetForm}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Text (English)" value={form.text_en} onChange={(e) => setForm({ ...form, text_en: e.target.value })} required />
              <Input label="Text (हिन्दी)" value={form.text_hi} onChange={(e) => setForm({ ...form, text_hi: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="BG Color" type="color" value={form.bg_color} onChange={(e) => setForm({ ...form, bg_color: e.target.value })} />
                <Input label="Text Color" type="color" value={form.text_color} onChange={(e) => setForm({ ...form, text_color: e.target.value })} />
              </div>
              <Input label="Expires At (optional)" type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                Active
              </label>
              {/* Preview */}
              <div className="rounded-lg p-3 text-sm font-medium text-center" style={{ backgroundColor: form.bg_color, color: form.text_color }}>
                {form.text_en || 'Preview'}
              </div>
              <div className="flex gap-3">
                <Button type="submit">{t('admin.save')}</Button>
                <Button type="button" variant="ghost" onClick={resetForm}>{t('admin.cancel')}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        {announcements.map((a) => (
          <Card key={a.id} className="p-5">
            <div
              className="rounded-lg p-4 text-sm font-medium text-center mb-4"
              style={{ backgroundColor: a.bg_color, color: a.text_color }}
            >
              {a.text_en}
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${a.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {a.is_active ? 'Active' : 'Inactive'}
                </span>
                {a.expires_at && <span className="text-xs text-muted">Expires: {new Date(a.expires_at).toLocaleDateString()}</span>}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => editItem(a)}>Edit</Button>
                <Button variant="ghost" size="sm" onClick={() => deleteItem(a.id)} className="text-red-500">Delete</Button>
              </div>
            </div>
          </Card>
        ))}
        {announcements.length === 0 && <p className="text-muted text-center py-8">No announcements yet</p>}
      </div>
    </div>
  )
}
