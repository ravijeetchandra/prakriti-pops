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
import type { Product } from '@/lib/types'
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi'

export default function AdminProductsPage() {
  const { t } = useLang()
  const { addToast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name_en: '', name_hi: '', slug: '', description_en: '', description_hi: '',
    price: '', compare_price: '', category: 'classic', flavor: 'original',
    stock_qty: '0', is_active: true, is_featured: false,
  })

  useEffect(() => {
    ;(async () => {
      const { data }: any = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (data) setProducts(data)
      setLoading(false)
    })()
  }, [])

  const resetForm = () => {
    setForm({ name_en: '', name_hi: '', slug: '', description_en: '', description_hi: '', price: '', compare_price: '', category: 'classic', flavor: 'original', stock_qty: '0', is_active: true, is_featured: false })
    setEditingId(null)
    setShowForm(false)
  }

  const editProduct = (p: Product) => {
    setForm({
      name_en: p.name_en, name_hi: p.name_hi, slug: p.slug,
      description_en: p.description_en, description_hi: p.description_hi,
      price: p.price.toString(), compare_price: p.compare_price?.toString() || '',
      category: p.category, flavor: p.flavor, stock_qty: p.stock_qty.toString(),
      is_active: p.is_active, is_featured: p.is_featured,
    })
    setEditingId(p.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      ...form,
      price: parseFloat(form.price),
      compare_price: form.compare_price ? parseFloat(form.compare_price) : null,
      stock_qty: parseInt(form.stock_qty),
      slug: form.slug || form.name_en.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
    }

    if (editingId) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingId)
      if (error) { addToast(error.message, 'error'); return }
      addToast('Product updated!', 'success')
    } else {
      const { error } = await supabase.from('products').insert(payload)
      if (error) { addToast(error.message, 'error'); return }
      addToast('Product added!', 'success')
    }
    resetForm()
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
    addToast('Product deleted', 'info')
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">🛍️ Products ({products.length})</h1>
        <Button onClick={() => { resetForm(); setShowForm(true) }}>
          <FiPlus size={16} className="mr-2" /> {t('admin.add_product')}
        </Button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">{editingId ? t('admin.edit_product') : t('admin.add_product')}</h2>
              <button onClick={resetForm}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Name (English)" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value, slug: editingId ? form.slug : e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') })} required />
                <Input label="Name (हिन्दी)" value={form.name_hi} onChange={(e) => setForm({ ...form, name_hi: e.target.value })} required />
                <div className="sm:col-span-2">
                  <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description (English)</label>
                  <textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" rows={3} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description (हिन्दी)</label>
                  <textarea value={form.description_hi} onChange={(e) => setForm({ ...form, description_hi: e.target.value })} className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" rows={3} />
                </div>
                <Input label="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                <Input label="Compare Price (₹)" type="number" value={form.compare_price} onChange={(e) => setForm({ ...form, compare_price: e.target.value })} />
                <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                <Input label="Flavor" value={form.flavor} onChange={(e) => setForm({ ...form, flavor: e.target.value })} />
                <Input label="Stock Quantity" type="number" value={form.stock_qty} onChange={(e) => setForm({ ...form, stock_qty: e.target.value })} />
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
                    Featured (Viral)
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit">{t('admin.save')}</Button>
                <Button type="button" variant="ghost" onClick={resetForm}>{t('admin.cancel')}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Products table */}
      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left p-4 font-semibold">Name</th>
              <th className="text-left p-4 font-semibold">Slug</th>
              <th className="text-left p-4 font-semibold">Price</th>
              <th className="text-left p-4 font-semibold">Stock</th>
              <th className="text-left p-4 font-semibold">Category</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4">
                  <span className="font-semibold">{p.name_en}</span>
                  <span className="text-xs text-muted block">{p.name_hi}</span>
                </td>
                <td className="p-4 text-xs text-muted">{p.slug}</td>
                <td className="p-4 font-semibold">{formatPrice(p.price)}</td>
                <td className="p-4">{p.stock_qty}</td>
                <td className="p-4 text-xs capitalize">{p.category}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => editProduct(p)}><FiEdit2 size={14} /></Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteProduct(p.id)} className="text-red-500"><FiTrash2 size={14} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
