'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useLang } from '@/lib/locale'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toaster'
import { formatPrice } from '@/lib/helpers'
import { useCampaigns, getProductCampaign, getCampaignPrice } from '@/lib/campaigns'
import type { Product } from '@/lib/types'
import { FiShoppingCart, FiMinus, FiPlus, FiZap } from 'react-icons/fi'
import Link from 'next/link'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { lang, t } = useLang()
  const { addToast } = useToast()
  const addItem = useCartStore((s) => s.addItem)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const campaigns = useCampaigns()

  useEffect(() => {
;(async () => {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single()
        if (data) setProduct(data)
        setLoading(false)
      })()
  }, [slug])

  if (loading) return <Spinner text={t('common.loading')} />
  if (!product) return <div className="text-center py-20">Product not found</div>

  const name = lang === 'hi' ? product.name_hi : product.name_en
  const desc = lang === 'hi' ? product.description_hi : product.description_en
  const inStock = product.stock_qty > 0
  const campaign = getProductCampaign(product.id, campaigns)
  const { price: displayPrice, discounted, percent, savings, title: campaignTitle } = getCampaignPrice(product, campaign)

  const handleAdd = () => {
    addItem({
      product_id: product.id,
      name_en: product.name_en,
      name_hi: product.name_hi,
      slug: product.slug,
      price: discounted ? displayPrice : product.price,
      image: `/api/placeholder?name=${encodeURIComponent(product.name_en)}`,
      original_price: discounted ? product.price : undefined,
      campaign_id: campaign?.id ?? null,
    }, qty)
    addToast(`${name} (x${qty}) — ${t('shop.add_to_cart')}! 🛒`, 'success')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/shop" className="text-sm text-muted hover:text-primary mb-6 inline-block">
        ← {t('common.back')} to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
          <img
            src={`/api/placeholder?name=${encodeURIComponent(product.name_en)}`}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex gap-2 mb-4">
            {product.is_featured && <Badge variant="viral">{t('shop.badge_viral')}</Badge>}
            {!inStock && <Badge variant="soldout">{t('shop.badge_sold_out')}</Badge>}
            {discounted && <Badge variant="sale">{`${percent}% OFF`}</Badge>}
          </div>

          <p className="text-sm text-muted uppercase tracking-wide mb-1">{product.flavor}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">{name}</h1>
          <p className="text-muted mt-4 leading-relaxed">{desc}</p>

          <div className="flex items-center gap-3 mt-6">
            <span className="text-3xl font-bold text-primary">{formatPrice(displayPrice)}</span>
            {discounted && (
              <>
                <span className="text-xl text-muted line-through">{formatPrice(product.price)}</span>
                <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  Save {formatPrice(savings)}
                </span>
              </>
            )}
            {!discounted && product.compare_price && product.compare_price > product.price && (
              <>
                <span className="text-xl text-muted line-through">{formatPrice(product.compare_price)}</span>
                <span className="text-sm font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  {Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {discounted && campaignTitle && (
            <div className="flex items-center gap-2 mt-2 text-green-700 bg-green-50 rounded-lg px-3 py-2 text-sm font-medium">
              <FiZap size={16} className="text-yellow-500" />
              {campaignTitle} — {percent}% off
            </div>
          )}

          <div className="flex items-center gap-4 mt-8">
            <span className="text-sm font-medium">{t('cart.qty')}:</span>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-2.5 hover:bg-gray-100 transition-colors"
              >
                <FiMinus size={16} />
              </button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="p-2.5 hover:bg-gray-100 transition-colors"
              >
                <FiPlus size={16} />
              </button>
            </div>
            <span className="text-sm text-muted">{product.stock_qty} in stock</span>
          </div>

          <Button onClick={handleAdd} size="lg" disabled={!inStock} className="mt-6">
            <FiShoppingCart size={18} className="mr-2" />
            {inStock ? t('shop.add_to_cart') : t('shop.out_of_stock')}
          </Button>
        </div>
      </div>
    </div>
  )
}
