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
    <Link href={`/shop/${product.slug}`}>
      <Card hover className="group relative">
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {isFeatured && <Badge variant="viral">{t('shop.badge_viral')}</Badge>}
          {!inStock && <Badge variant="soldout">{t('shop.badge_sold_out')}</Badge>}
          {discounted && <Badge variant="sale">{percent}% OFF</Badge>}
        </div>

        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.images[0] || `/api/placeholder?name=${encodeURIComponent(product.name_en)}`}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-4">
          <p className="text-xs text-muted uppercase tracking-wide">{product.flavor}</p>
          <h3 className="font-semibold text-foreground mt-1 line-clamp-1">{name}</h3>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-primary">{formatPrice(displayPrice)}</span>
            {discounted && (
              <span className="text-sm text-muted line-through">{formatPrice(product.price)}</span>
            )}
            {!discounted && product.compare_price && product.compare_price > product.price && (
              <span className="text-sm text-muted line-through">{formatPrice(product.compare_price)}</span>
            )}
          </div>

          {discounted && campaignTitle && (
            <p className="text-xs text-green-600 font-medium mt-0.5">{campaignTitle}</p>
          )}

          <Button
            onClick={handleAdd}
            size="sm"
            variant={inStock ? 'primary' : 'ghost'}
            disabled={!inStock}
            className="mt-3 w-full"
          >
            <FiShoppingCart size={14} className="mr-1.5" />
            {inStock ? t('shop.add_to_cart') : t('shop.out_of_stock')}
          </Button>
        </div>
      </Card>
    </Link>
  )
}
