'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/locale'
import ProductGrid from '@/components/shop/ProductGrid'
import { Spinner } from '@/components/ui/Spinner'
import { useCampaigns } from '@/lib/campaigns'
import type { Product, Campaign } from '@/lib/types'
import { FiZap } from 'react-icons/fi'

export default function ShopPage() {
  const { t } = useLang()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')
  const [categories, setCategories] = useState<string[]>([])
  const campaigns = useCampaigns()

  const loadProducts = (data: Product[]) => {
    setProducts(data)
    const cats = [...new Set(data.map((p) => p.category).filter(Boolean))] as string[]
    setCategories(cats)
  }

  useEffect(() => {
;(async () => {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
        if (data) loadProducts(data)
        setLoading(false)
      })()
  }, [])

  const filtered = category === 'all' ? products : products.filter((p) => p.category === category)

  if (loading) return <Spinner text={t('common.loading')} />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Campaign banners */}
      {campaigns.length > 0 && (
        <div className="flex flex-col gap-3 mb-8">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl px-5 py-3 shadow-md"
            >
              <FiZap size={22} className="text-yellow-300 flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">{c.title_en} — {c.discount_percent}% OFF</p>
                <p className="text-xs text-green-100">
                  {new Date(c.end_time).toLocaleDateString('en-IN', { dateStyle: 'medium' })} tak
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-foreground">{t('shop.title')}</h1>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-muted hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                category === cat
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-muted hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <ProductGrid products={filtered} campaigns={campaigns} />
    </div>
  )
}
