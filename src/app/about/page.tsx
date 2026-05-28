'use client'

import { useLang } from '@/lib/locale'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AboutPage() {
  const { t } = useLang()

  const timeline = [
    { year: 'Ancient', title: 'Mithila ki Kheti', desc: 'Makhana cultivation in the fertile fields of Darbhanga for thousands of years.', emoji: '🌾' },
    { year: '2024', title: 'The Idea', desc: 'Bringing grandma recipes and Bihar superfood to the modern world with GenZ energy.', emoji: '💡' },
    { year: '2024', title: 'Prakriti Pops Born', desc: 'First batch of roasted makhana — no preservatives, 100% natural, 200% love.', emoji: '🚀' },
    { year: 'Today', title: 'All India Delivery', desc: 'From Mithila to Mumbai, Darbhanga to Delhi — crunch reaching every corner of India.', emoji: '🇮🇳' },
  ]

  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary text-white py-24 md:py-32">
        <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/40 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute -bottom-32 -left-32 w-[40rem] h-[40rem] bg-accent/20 rounded-full blur-3xl animate-float" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-sm font-medium mb-6 border border-white/20 text-primary-light"
          >
            ✨ Our Story
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold leading-tight mb-6"
          >
            {t('about.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed"
          >
            {t('about.vibe')}
          </motion.p>
        </div>
      </section>

      {/* Origin Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                {t('about.origin_title')}
              </h2>
              <div className="space-y-4 text-lg text-muted leading-relaxed font-light">
                <p>{t('about.origin_text')}</p>
                <p>
                  Darbhanga, the heart of Mithila, has been known for its makhana for centuries. The clean water of the region, the fertile soil, and the traditional knowledge passed down through generations — that&apos;s what makes our makhana special.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="/images/bihar-fields.jpg"
                  alt="Darbhanga, Mithila"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white font-serif font-bold text-center shadow-xl animate-float">
                Pure<br/>Origin
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-secondary-light/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-2 md:order-1"
            >
              <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="/images/makhana-2.jpg"
                  alt="Prakriti Pops Flavors"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -top-6 -right-6 bg-white text-secondary px-6 py-3 rounded-2xl shadow-xl text-sm font-bold animate-float">
                🚀 100% Natural
              </div>
            </motion.div>
            <div className="order-1 md:order-2 space-y-6">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight">
                {t('about.mission_title')}
              </h2>
              <div className="space-y-4 text-lg text-muted leading-relaxed font-light">
                <p>{t('about.mission_text')}</p>
                <p>
                  We source directly from farmers in Darbhanga, roast in small batches, and pack with zero preservatives. Every pack is a story of Mithila&apos;s heritage meeting modern taste buds.
                </p>
              </div>
              <Link href="/shop">
                <Button variant="primary" size="lg" className="px-8 py-4 rounded-full shadow-xl shadow-primary/20 btn-premium">
                  Try Our Flavours →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              The Journey
            </h2>
            <p className="text-muted text-lg font-light">From the fields of Mithila to your doorstep.</p>
          </div>
          
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 hidden md:block -translate-x-1/2" />
            
            <div className="space-y-16">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center`}>
                    <span className="text-sm font-bold text-primary uppercase tracking-widest">{item.year}</span>
                    <h3 className="text-2xl font-serif font-bold mt-2 text-foreground">{item.title}</h3>
                    <p className="text-muted mt-3 text-lg font-light leading-relaxed">{item.desc}</p>
                  </div>
                  
                  <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-2xl shadow-lg z-10 ring-4 ring-cream">
                    {item.emoji}
                  </div>
                  
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-secondary text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.08\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8">
            Join the Crunch Revolution
          </h2>
          <Link href="/shop">
            <Button size="lg" variant="primary" className="text-lg px-12 py-4 shadow-2xl shadow-black/40 btn-premium">
              Explore Our Collection →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}