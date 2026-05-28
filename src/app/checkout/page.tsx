'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLang } from '@/lib/locale'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toaster'
import { formatPrice, generateOrderId } from '@/lib/helpers'
import { supabase } from '@/lib/supabase'
import { useCampaigns } from '@/lib/campaigns'
import Link from 'next/link'
import { FiLock, FiTag, FiZap } from 'react-icons/fi'
import { v4 as uuidv4 } from 'uuid'

export default function CheckoutPage() {
  const { t, lang } = useLang()
  const router = useRouter()
  const { items, subtotal, clearCart } = useCartStore()
  const { addToast } = useToast()
  const campaigns = useCampaigns()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
    notes: '',
  })
  const [couponCode, setCouponCode] = useState('')
  const [couponMsg, setCouponMsg] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-6">🥲</p>
        <h1 className="text-2xl font-bold mb-2">{t('cart.empty')}</h1>
        <Link href="/shop"><Button className="mt-6">{t('cart.empty_cta')} →</Button></Link>
      </div>
    )
  }

  const total = subtotal() - couponDiscount

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.phone.trim()) errs.phone = 'Required'
    else if (!/^[0-9]{10,15}$/.test(form.phone.replace(/[\s\-+]/g, '')))
      errs.phone = 'Invalid phone number'
    if (!form.email.trim()) errs.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Invalid email'
    if (!form.address.trim()) errs.address = 'Required'
    if (!form.pincode.trim()) errs.pincode = 'Required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.trim().toUpperCase())
      .eq('is_active', true)
      .single()

    if (!data) {
      setCouponMsg(t('checkout.coupon_invalid'))
      setCouponDiscount(0)
      return
    }

    if (subtotal() < data.min_cart_value) {
      setCouponMsg(`Min cart value: ${formatPrice(data.min_cart_value)}`)
      return
    }

    const discount =
      data.discount_type === 'percentage'
        ? (subtotal() * data.discount_value) / 100
        : data.discount_value

    setCouponDiscount(Math.min(discount, subtotal()))
    setCouponMsg(t('checkout.coupon_applied'))
    addToast(t('checkout.coupon_applied'), 'success')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)

    try {
      const sessionId = localStorage.getItem('pp-guest-session') || uuidv4()
      localStorage.setItem('pp-guest-session', sessionId)

      const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true })
      const orderId = generateOrderId((count ?? 0) + 1)

      const orderItems = items.map((item) => {
        const campaign = campaigns.find((c) => c.id === item.campaign_id)
        const campaignDiscount = campaign && item.original_price
          ? (item.original_price - item.price) * item.qty
          : 0
        return {
          ...item,
          original_price: item.original_price ?? item.price,
          campaign_id: item.campaign_id ?? null,
          campaign_discount: campaignDiscount,
        }
      })

      const campaignDiscountTotal = orderItems.reduce((sum, i) => sum + (i.campaign_discount || 0), 0)
      const effectiveDiscount = Math.max(couponDiscount, campaignDiscountTotal)
      const campaignId = campaignDiscountTotal > 0
        ? (items.find((i) => i.campaign_id)?.campaign_id ?? null)
        : null

      const { data, error } = await supabase.from('orders').insert({
        order_id: orderId,
        session_id: sessionId,
        customer_name: form.name.trim(),
        customer_phone: form.phone.trim(),
        email: form.email.trim(),
        customer_address: form.address.trim(),
        pincode: form.pincode.trim(),
        notes: form.notes.trim() || null,
        items: orderItems,
        subtotal: subtotal(),
        discount: effectiveDiscount,
        campaign_discount: campaignDiscountTotal,
        campaign_id: campaignId,
        total: subtotal() - effectiveDiscount,
        payment_method: 'cod',
        status: 'pending',
        coupon_code: couponMsg === t('checkout.coupon_applied') ? couponCode.trim().toUpperCase() : null,
      }).select().single()

      if (error) throw error

      localStorage.setItem('pp-last-order', JSON.stringify({
        order_id: orderId,
        email: form.email.trim(),
        name: form.name.trim(),
      }))

      await supabase.from('order_timeline').insert({
        order_id: data.id,
        status: 'pending',
        note: 'Order placed',
        updated_by: 'system',
      })

      clearCart()
      router.push(`/order-confirmation/${orderId}`)
    } catch (err) {
      addToast(t('common.error'), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-foreground mb-8">{t('checkout.title')}</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="font-bold text-lg mb-4">{t('checkout.guest_info')}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label={t('checkout.name')}
                  placeholder="Rajesh Kumar"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  error={errors.name}
                />
                <Input
                  label={t('checkout.phone')}
                  placeholder="9876543210"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  error={errors.phone}
                />
                <div className="sm:col-span-2">
                  <Input
                    label={t('checkout.email')}
                    type="email"
                    placeholder="rajesh@email.com"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    error={errors.email}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label={t('checkout.address')}
                    placeholder="123, MG Road, Patna"
                    value={form.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    error={errors.address}
                  />
                </div>
                <Input
                  label={t('checkout.pincode')}
                  placeholder="800001"
                  value={form.pincode}
                  onChange={(e) => updateField('pincode', e.target.value)}
                  error={errors.pincode}
                />
                <Input
                  label={t('checkout.notes')}
                  placeholder="Gate code, landmark..."
                  value={form.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                />
              </div>
            </Card>

            {campaigns.length > 0 && items.some((i) => i.campaign_id) && (
              <Card className="p-4 bg-green-50 border border-green-200">
                <div className="flex items-start gap-3">
                  <FiZap size={20} className="text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-green-800">Campaign Discount Applied</p>
                    <p className="text-xs text-green-600 mt-1">
                      Selected items are priced with active campaign discounts.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 space-y-6">
              <h2 className="font-bold text-lg">Summary</h2>

              <div>
                <label className="text-sm font-medium mb-1 block">{t('checkout.apply_coupon')}</label>
                <div className="flex gap-2">
                  <input
                    placeholder={t('checkout.coupon_placeholder')}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <button type="button" onClick={applyCoupon} className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                    <FiTag size={18} />
                  </button>
                </div>
                {couponMsg && (
                  <p className={`text-xs mt-1 ${couponMsg.includes('🤑') ? 'text-green-600' : 'text-red-500'}`}>
                    {couponMsg}
                  </p>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted">{t('cart.subtotal')}</span><span>{formatPrice(subtotal())}</span></div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between"><span className="text-muted">{t('cart.discount')}</span><span className="text-green-600">-{formatPrice(couponDiscount)}</span></div>
                )}
                <div className="flex justify-between"><span className="text-muted">Delivery</span><span className="text-green-600">Free</span></div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t('cart.total')}</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <Button type="submit" size="lg" fullWidth disabled={submitting}>
                <FiLock size={16} className="mr-2" />
                {submitting ? t('common.loading') : t('checkout.place_order')}
              </Button>

              <p className="text-xs text-muted text-center">Secure. No login required.</p>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
