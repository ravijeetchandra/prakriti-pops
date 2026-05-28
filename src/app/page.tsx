'use client'

import { useLang } from '@/lib/locale'
import { Button } from '@/components/ui/Button'
import ProductGrid from '@/components/shop/ProductGrid'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiTruck, FiShield, FiSun, FiMapPin, FiStar, FiZap } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useCampaigns } from '@/lib/campaigns'
import type { Product } from '@/lib/types'

export default function HomePage() {
  const { t } = useLang()
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const campaigns = useCampaigns()

  useEffect(() => {
    ;(async () => {
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(4)
        if (data) setFeaturedProducts(data.slice(0, 4))
      })()
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-green-800 to-green-900 text-white min-h-[90vh] flex items-center">
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[30rem] h-[30rem] bg-accent/15 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium mb-6 border border-white/10"
              >
                🌾 {t('site.subtitle')}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
              >
                {t('home.hero_title')}
                <span className="block text-primary-light mt-2">{t('home.hero_subtitle')}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 text-lg text-white/80 max-w-lg leading-relaxed"
              >
                100% natural makhana, roasted to perfection. 
                Mithila ki mitti ka superfood ab tere tak!
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <Link href="/shop">
                  <Button size="lg" variant="primary" className="text-base shadow-xl shadow-primary/30">
                    {t('home.hero_cta')} →
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-secondary text-base">
                    {t('nav.about')}
                  </Button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-8 mt-12 pt-8 border-t border-white/10"
              >
                {[
                  { num: '100%', label: 'Natural' },
                  { num: '5K+', label: 'Happy Crunchers' },
                  { num: 'All India', label: 'Delivery' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-extrabold text-primary-light">{s.num}</p>
                    <p className="text-xs text-white/60">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="hidden md:block relative"
            >
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-black/30">
                  <img
                    src="/images/makhana-1.jpg"
                    alt="Prakriti Pops Makhana"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating badges */}
                <div className="absolute -top-4 -left-4 bg-white text-secondary px-4 py-2 rounded-full shadow-lg text-sm font-bold whitespace-nowrap">
                  🔥 BOHOT HARDD
                </div>
                <div className="absolute -bottom-4 -right-4 bg-accent text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold whitespace-nowrap">
                  🧡 Bihar Ka Pride
                </div>
                <div className="absolute top-1/2 -right-6 bg-white text-foreground px-3 py-1.5 rounded-full shadow-lg text-xs font-bold">
                  ⭐ 4.9 (500+ reviews)
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee Tagline Bar */}
      <div className="bg-primary py-3 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <div className="animate-marquee whitespace-nowrap text-sm font-bold text-white tracking-wide relative z-10">
          🧡 Bihar Ka Pride &nbsp;•&nbsp; 🔥 100% Natural &nbsp;•&nbsp; 🚚 All India Delivery &nbsp;•&nbsp; 💪 Protein Rich &nbsp;•&nbsp; 🌾 Mithila Ki Mitti Se &nbsp;•&nbsp; 🧡 Bihar Ka Pride &nbsp;•&nbsp; 🔥 100% Natural &nbsp;•&nbsp; 🚚 All India Delivery &nbsp;•&nbsp; 💪 Protein Rich &nbsp;•&nbsp; 🌾 Mithila Ki Mitti Se &nbsp;•&nbsp; 🧡 Bihar Ka Pride &nbsp;•&nbsp; 🔥 100% Natural &nbsp;•&nbsp; 🚚 All India Delivery &nbsp;•&nbsp; 💪 Protein Rich &nbsp;•&nbsp; 🌾 Mithila Ki Mitti Se
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/images/bihar-fields.jpg"
                  alt="Mithila, Bihar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white font-extrabold text-sm shadow-lg">
                Since<br/>2024
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
                {t('home.story_title')}
              </h2>
              <p className="mt-6 text-lg text-muted leading-relaxed">
                {t('home.story_text')}
              </p>
              <Link href="/about">
                <Button variant="outline" className="mt-6">
                  Read Full Story →
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Campaign banners */}
      {campaigns.length > 0 && (
        <section className="py-6 -mt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-3">
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
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-foreground">
                {t('home.featured_title')}
              </h2>
              <p className="text-muted mt-2">Sabse zyada bikne wale flavors 🔥</p>
            </div>
            <Link href="/shop" className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
              {t('shop.title')} →
            </Link>
          </div>
          <ProductGrid products={featuredProducts} campaigns={campaigns} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-foreground mb-12">
            Log Kya Keh Rahe Hain? 🗣️
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Rajesh K.', from: 'Mumbai', text: 'Bhaiya ye makhana toh next level hai! Mere pura office iska deewana ho gaya. 🔥', rating: 5 },
              { name: 'Priya S.', from: 'Delhi', text: 'Finally a healthy snack that actually tastes good. The peri peri flavor is 💯', rating: 5 },
              { name: 'Ankit M.', from: 'Patna', text: 'Bihar ka product hai toh try karna hi tha. Roasted masala is ❤️ behanchod level ka taste hai!', rating: 5 },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <FiStar key={j} className="fill-accent text-accent" size={16} />
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-4">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted">{testimonial.from}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-16 bg-white border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: FiTruck, title: t('home.trust_cod'), desc: 'Pay when you get it' },
              { icon: FiShield, title: t('home.trust_free_delivery'), desc: 'Orders above ₹499' },
              { icon: FiSun, title: t('home.trust_natural'), desc: 'No preservatives' },
              { icon: FiMapPin, title: t('home.trust_direct'), desc: 'Straight from Mithila' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-gradient-to-r from-secondary to-green-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-4xl mb-4">🌾</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Ready to Crunch?
            </h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
              Mithila ki mitti ka superfood, ab aapke ghar tak. Free delivery on first order!
            </p>
            <Link href="/shop">
              <Button size="lg" variant="primary" className="text-base shadow-xl shadow-black/20">
                Abhi Order Karo → 
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
