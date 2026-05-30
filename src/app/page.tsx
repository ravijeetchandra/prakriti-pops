'use client'

import { useLang } from '@/lib/locale'
import { Button } from '@/components/ui/Button'
import ProductGrid from '@/components/shop/ProductGrid'
import Link from 'next/link'
import Image from 'next/image'
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
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary text-white min-h-[95vh] flex items-center">
        {/* Abstract Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-32 -left-32 w-[40rem] h-[40rem] bg-accent/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary-light/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 w-full">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-sm font-medium mb-6 border border-white/20 text-primary-light"
              >
                <span aria-hidden="true">🌾</span> {t('site.subtitle')}
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.1] mb-6 text-balance"
              >
                {t('home.hero_title')}
                <span className="block text-primary-light mt-4 italic">
                  {t('home.hero_subtitle')}
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-white/80 max-w-lg leading-relaxed mb-10 font-light text-pretty"
              >
                100% natural makhana, roasted to perfection. 
                Mithila ki mitti ka superfood, delivered with love to your doorstep.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-5"
              >
                <Link href="/shop">
                  <Button size="lg" variant="primary" className="text-base px-10 py-4 shadow-2xl shadow-primary/30 btn-premium">
                    {t('home.hero_cta')} <span className="ml-1" aria-hidden="true">→</span>
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-secondary text-base px-10 py-4 btn-premium">
                    {t('nav.about')}
                  </Button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex gap-12 mt-16 pt-8 border-t border-white/10"
              >
                {[
                  { num: '100%', label: 'Natural' },
                  { num: '5K+', label: 'Happy Crunchers' },
                  { num: 'All India', label: 'Delivery' },
                ].map((s) => (
                  <div key={s.label} className="group">
                    <p className="text-2xl font-serif font-bold text-primary-light group-hover:scale-110 transition-transform duration-300">{s.num}</p>
                    <p className="text-xs text-white/60 uppercase tracking-widest mt-1">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="hidden md:block relative"
            >
              <div className="relative z-10">
                <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-black/40 border-8 border-white/10">
                  <Image
                    src="/images/makhana-1.jpg"
                    alt="Prakriti Pops Premium Roasted Makhana"
                    className="w-full h-full object-cover"
                    priority
                    width={600}
                    height={600}
                  />
                </div>
                {/* Floating organic badges */}
                <div className="absolute -top-6 -left-6 bg-white text-secondary px-6 py-3 rounded-2xl shadow-xl text-sm font-bold whitespace-nowrap animate-float" role="status">
                  <span aria-hidden="true">🔥</span> BOHOT HARDD
                </div>
                <div className="absolute -bottom-6 -right-6 bg-accent text-white px-6 py-3 rounded-2xl shadow-xl text-sm font-bold whitespace-nowrap animate-float" style={{ animationDelay: '1s' }} role="status">
                  <span aria-hidden="true">🧡</span> Bihar Ka Pride
                </div>
                <div className="absolute top-1/2 -right-10 bg-white text-foreground px-4 py-2 rounded-full shadow-lg text-xs font-bold animate-float" style={{ animationDelay: '2s' }} role="status">
                  <span aria-hidden="true">⭐</span> 4.9 (500+ reviews)
                </div>
              </div>
              {/* Background glow for image */}
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-75 -z-10" aria-hidden="true" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee Tagline Bar */}
      <div className="bg-primary py-3 overflow-hidden relative shadow-inner" role="region" aria-label="Promotion marquee">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden="true" />
        <div className="animate-marquee whitespace-nowrap text-sm font-bold text-white tracking-wide relative z-10 uppercase">
          <span aria-hidden="true">🧡</span> Bihar Ka Pride &nbsp;•&nbsp; <span aria-hidden="true">🔥</span> 100% Natural &nbsp;•&nbsp; <span aria-hidden="true">🚚</span> All India Delivery &nbsp;•&nbsp; <span aria-hidden="true">💪</span> Protein Rich &nbsp;•&nbsp; <span aria-hidden="true">🌾</span> Mithila Ki Mitti Se &nbsp;•&nbsp; <span aria-hidden="true">🧡</span> Bihar Ka Pride &nbsp;•&nbsp; <span aria-hidden="true">🔥</span> 100% Natural &nbsp;•&nbsp; <span aria-hidden="true">🚚</span> All India Delivery &nbsp;•&nbsp; <span aria-hidden="true">💪</span> Protein Rich &nbsp;•&nbsp; <span aria-hidden="true">🌾</span> Mithila Ki Mitti Se &nbsp;•&nbsp; <span aria-hidden="true">🧡</span> Bihar Ka Pride &nbsp;•&nbsp; <span aria-hidden="true">🔥</span> 100% Natural &nbsp;•&nbsp; <span aria-hidden="true">🚚</span> All India Delivery &nbsp;•&nbsp; <span aria-hidden="true">💪</span> Protein Rich &nbsp;•&nbsp; <span aria-hidden="true">🌾</span> Mithila Ki Mitti Se
        </div>
      </div>

      {/* Story Section */}
      <section className="py-24 bg-cream relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-secondary/10 to-transparent" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl group">
                <Image
                  src="/images/bihar-fields.jpg"
                  alt="The fertile makhana fields of Mithila, Bihar"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  width={800}
                  height={1000}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-primary rounded-full flex items-center justify-center text-white font-serif font-bold text-center shadow-xl animate-float">
                Since<br/>2024
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight text-balance">
                {t('home.story_title')}
              </h2>
              <p className="text-lg text-muted leading-relaxed font-light text-pretty">
                {t('home.story_text')}
              </p>
              <Link href="/about">
                <Button variant="outline" className="mt-4 px-8 py-3 rounded-full border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-300">
                  Read Full Story <span className="ml-1" aria-hidden="true">→</span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Campaign banners */}
      {campaigns.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 bg-gradient-to-r from-secondary to-secondary-dark text-white rounded-2xl px-6 py-4 shadow-lg hover:shadow-xl transition-[box-shadow] duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <FiZap size={20} className="text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-bold text-sm uppercase tracking-wide">{c.title_en} — {c.discount_percent}% OFF</p>
                  <p className="text-xs text-white/70">
                    {new Date(c.end_time).toLocaleDateString('en-IN', { dateStyle: 'medium' })} tak
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-4xl font-serif font-bold text-foreground mb-2 text-balance">
                {t('home.featured_title')}
              </h2>
              <p className="text-muted text-lg">Sabse zyada bikne wale flavors <span aria-hidden="true">🔥</span></p>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors uppercase tracking-widest">
              {t('shop.title')} <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
            </Link>
          </div>
          <ProductGrid products={featuredProducts} campaigns={campaigns} />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-cream-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-serif font-bold text-center text-foreground mb-16 text-balance">
            Log Kya Keh Rahe Hain? <span aria-hidden="true">🗣️</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
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
                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 card-hover"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <FiStar key={j} className="fill-accent text-accent" size={16} aria-hidden="true" />
                  ))}
                </div>
                <p className="text-foreground text-base leading-relaxed mb-6 italic font-light text-pretty">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-base">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{testimonial.name}</p>
                    <p className="text-xs text-muted">{testimonial.from}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-20 bg-white border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
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
                <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-primary/10 transition-transform duration-300">
                  <item.icon className="w-8 h-8 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-foreground text-lg text-balance">{item.title}</h3>
                <p className="text-sm text-muted mt-2 leading-relaxed text-pretty">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-5xl mb-6" aria-hidden="true">🌾</p>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-balance">
              Ready to Crunch?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 font-light text-pretty">
              Mithila ki mitti ka superfood, ab aapke ghar tak. <br className="hidden md:block"/>
              Experience the crunchiest makhana in India.
            </p>
            <Link href="/shop">
              <Button size="lg" variant="primary" className="text-lg px-12 py-4 shadow-2xl shadow-black/40 btn-premium">
                Abhi Order Karo <span className="ml-1" aria-hidden="true">→</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}