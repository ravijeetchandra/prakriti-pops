'use client'

import { useLang } from '@/lib/locale'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatPrice } from '@/lib/helpers'
import Link from 'next/link'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiZap } from 'react-icons/fi'

export default function CartPage() {
  const { t, lang } = useLang()
  const { items, removeItem, updateQty, subtotal } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-6">🥲</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">{t('cart.empty')}</h1>
        <Link href="/shop">
          <Button variant="primary" className="mt-6">
            {t('cart.empty_cta')} →
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-foreground mb-8">{t('cart.title')}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.product_id} className="flex gap-4 p-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                <img
                  src={item.image || `/api/placeholder?name=${encodeURIComponent(item.name_en)}`}
                  alt={lang === 'hi' ? item.name_hi : item.name_en}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/shop/${item.slug}`} className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                  {lang === 'hi' ? item.name_hi : item.name_en}
                </Link>
                <div className="flex items-center gap-1.5 mt-1">
                  {item.campaign_id && (
                    <FiZap size={13} className="text-yellow-500" />
                  )}
                  <p className="text-sm font-bold text-primary">{formatPrice(item.price)}</p>
                  {item.original_price && item.original_price > item.price && (
                    <span className="text-xs text-muted line-through">{formatPrice(item.original_price)}</span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQty(item.product_id, item.qty - 1)}
                      className="p-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.product_id, item.qty + 1)}
                      className="p-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">{t('cart.subtotal')}</span>
                <span className="font-semibold">{formatPrice(subtotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Delivery</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>{t('cart.total')}</span>
                <span className="text-primary">{formatPrice(subtotal())}</span>
              </div>
            </div>
            <Link href="/checkout">
              <Button variant="primary" size="lg" fullWidth className="mt-6">
                <FiShoppingBag size={18} className="mr-2" />
                {t('cart.checkout')}
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
