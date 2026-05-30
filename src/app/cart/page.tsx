'use client'

import { useLang } from '@/lib/locale'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatPrice } from '@/lib/helpers'
import Link from 'next/link'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiZap } from 'react-icons/fi'
import { motion } from 'framer-motion'

export default function CartPage() {
  const { t, lang } = useLang()
  const { items, removeItem, updateQty, subtotal } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="bg-cream min-h-screen flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto text-center space-y-6"
        >
          <div className="text-8xl mb-6 animate-bounce">🛒</div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-2">
            {t('cart.empty')}
          </h1>
          <p className="text-muted text-lg font-light mb-8">
            Your cart is currently empty. Let&apos;s fill it with some premium crunch!
          </p>
          <Link href="/shop">
            <Button variant="primary" size="lg" className="px-10 py-4 rounded-full shadow-xl shadow-primary/20 btn-premium">
              {t('cart.empty_cta')} →
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-12"
        >
          {t('cart.title')}
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, index) => (
              <motion.div
                key={item.product_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="flex gap-6 p-6 bg-white border-none shadow-sm hover:shadow-md transition-shadow duration-300 group">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                    <img
                      src={`/api/placeholder?name=${encodeURIComponent(item.name_en)}`}
                      alt={lang === 'hi' ? item.name_hi : item.name_en}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/shop/${item.slug}`} 
                      className="font-serif text-xl font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {lang === 'hi' ? item.name_hi : item.name_en}
                    </Link>
                    
                    <div className="flex items-center gap-2 mt-1">
                      {item.campaign_id && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase tracking-wider">
                          <FiZap size={10} /> Special Offer
                        </span>
                      )}
                      <p className="text-lg font-bold text-primary">{formatPrice(item.price)}</p>
                      {item.original_price && item.original_price > item.price && (
                        <span className="text-sm text-muted line-through font-light">{formatPrice(item.original_price)}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center bg-cream rounded-xl p-1 border border-gray-200">
                        <button
                          onClick={() => updateQty(item.product_id, item.qty - 1)}
                          className="p-2 hover:bg-white rounded-lg transition-colors text-muted hover:text-primary"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-foreground">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.product_id, item.qty + 1)}
                          className="p-2 hover:bg-white rounded-lg transition-colors text-muted hover:text-primary"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product_id)}
                        className="flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-600 transition-colors group/btn"
                      >
                        <FiTrash2 size={16} className="group-hover/btn:rotate-12 transition-transform" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <Card className="p-8 bg-white border-none shadow-xl rounded-[2rem]">
                <h2 className="font-serif text-2xl font-bold mb-8 text-foreground border-b pb-4">Order Summary</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-muted font-light">{t('cart.subtotal')}</span>
                    <span className="font-semibold text-foreground">{formatPrice(subtotal())}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted font-light">Delivery</span>
                    <span className="font-bold text-green-600 uppercase text-xs tracking-widest">Free</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-medium text-muted">Total Amount</span>
                    <span className="text-3xl font-serif font-bold text-primary">{formatPrice(subtotal())}</span>
                  </div>
                </div>
                
                <Link href="/checkout">
                  <Button variant="primary" size="lg" fullWidth className="py-4 rounded-2xl shadow-xl shadow-primary/20 btn-premium flex items-center justify-center gap-3">
                    <FiShoppingBag size={20} />
                    <span className="text-lg">{t('cart.checkout')}</span>
                  </Button>
                </Link>
                
                <p className="text-center text-xs text-muted mt-6 font-light">
                  Secure checkout powered by Supabase
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}