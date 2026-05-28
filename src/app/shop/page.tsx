'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/locale'
import ProductGrid from '@/components/shop/ProductGrid'
import { Spinner } from '@/components/ui/Spinner'
import { useCampaigns } from '@/lib/campaigns'
import type { Product } from '@/lib/types'
import { FiZap } from 'react-icons/fi'
import { motion } from 'framer-motion'

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
    <div className="bg-cream min-h-screen">
      {/* Shop Header */}
      <section className="bg-secondary text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif font-bold mb-4"
          >
            {t('shop.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 max-w-2xl mx-auto font-light"
          >
            Discover our premium collection of hand-roasted makhana. 
            Pure, healthy, and absolutely delicious.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Campaign banners */}
        {campaigns.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3 mb-12"
          >
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 bg-gradient-to-r from-secondary to-secondary-dark text-white rounded-2xl px-6 py-4 shadow-lg"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <FiZap size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm uppercase tracking-wide">{c.title_en} — {c.discount_percent}% OFF</p>
                  <p className="text-xs text-white/70">
                    {new Date(c.end_time).toLocaleDateString('en-IN', { dateStyle: 'medium' })} tak
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Category Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-muted uppercase tracking-widest">Filter by:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategory('all')}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  category === 'all'
                    ? 'bg-primary text-white shadow-md scale-105'
                    : 'bg-white text-muted border border-gray-200 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
                    category === cat
                      ? 'bg-primary text-white shadow-md scale-105'
                      : 'bg-white text-muted border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-muted font-light">
            Showing <span className="font-bold text-foreground">{filtered.length}</span> products
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ProductGrid products={filtered} campaigns={campaigns} />
        </motion.div>
      </div>
    </div>
  )
}