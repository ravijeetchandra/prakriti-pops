'use client'

import Link from 'next/link'
import { useLang } from '@/lib/locale'
import { useCartStore } from '@/store/cartStore'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toaster'
import { formatPrice } from '@/lib/helpers'
import type { Product } from '@/lib/types'
import type { ActiveCampaign } from '@/lib/campaigns'
import { getProductCampaign, getCampaignPrice } from '@/lib/campaigns'
import { FiShoppingCart } from 'react-icons/fi'

interface ProductCardProps {
  product: Product
  campaigns?: ActiveCampaign[]
}

export default function ProductCard({ product, campaigns = [] }: ProductCardProps) {
  const { lang, t } = useLang()
  const addItem = useCartStore((s) => s.addItem)
  const { addToast } = useToast()

  const name = lang === 'hi' ? product.name_hi : product.name_en
  const inStock = product.stock_qty > 0
  const isFeatured = product.is_featured
  const campaign = getProductCampaign(product.id, campaigns)
  const { price: displayPrice, discounted, percent, title: campaignTitle } = getCampaignPrice(product, campaign)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!inStock) return
    addItem({
      product_id: product.id,
      name_en: product.name_en,
      name_hi: product.name_hi,
      slug: product.slug,
      price: discounted ? displayPrice : product.price,
      image: product.images[0] || `/api/placeholder?name=${encodeURIComponent(product.name_en)}`,
      original_price: discounted ? product.price : undefined,
      campaign_id: campaign?.id ?? null,
    })
    addToast(`${name} — ${t('shop.add_to_cart')}! 🛒`, 'success')
  }

  return (
    <Link href={`/shop/${product.slug}`} className="block group">
      <Card hover className="relative flex flex-col h-full">
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {isFeatured && <Badge variant="viral" className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">{t('shop.badge_viral')}</Badge>}
          {!inStock && <Badge variant="soldout" className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">{t('shop.badge_sold_out')}</Badge>}
          {discounted && <Badge variant="sale" className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">{percent}% OFF</Badge>}
        </div>

        <div className="relative aspect-square overflow-hidden bg-cream-dark">
          <img
            src={product.images[0] || `/api/placeholder?name=${encodeURIComponent(product.name_en)}`}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-5 flex flex-col flex-1">
          <p className="text-[10px] text-muted uppercase tracking-widest mb-1 font-semibold">{product.flavor}</p>
          <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
            {name}
          </h3>

          <div className="flex items-baseline gap-2 mt-2 mb-4">
            <span className="text-xl font-extrabold text-primary">{formatPrice(displayPrice)}</span>
            {(discounted || (product.compare_price && product.compare_price > product.price)) && (
              <span className="text-sm text-muted line-through font-medium">
                {formatPrice(discounted ? product.price : product.compare_price)}
              </span>
            )}
          </div>

          {discounted && campaignTitle && (
            <p className="text-[11px] text-secondary-light font-bold uppercase tracking-tight mb-4 italic">
              {campaignTitle}
            </p>
          )}

          <div className="mt-auto">
            <Button
              onClick={handleAdd}
              size="sm"
              variant={inStock ? 'primary' : 'ghost'}
              disabled={!inStock}
              className="w-full py-2.5 rounded-full"
            >
              <FiShoppingCart size={14} className="mr-2" />
              {inStock ? t('shop.add_to_cart') : t('shop.out_of_stock')}
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  )
}