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
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-secondary to-green-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold"
          >
            {t('about.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-white/80 max-w-2xl mx-auto"
          >
            {t('about.vibe')}
          </motion.p>
        </div>
      </section>

      {/* Origin */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold text-foreground">{t('about.origin_title')}</h2>
              <p className="mt-6 text-lg text-muted leading-relaxed">{t('about.origin_text')}</p>
              <p className="mt-4 text-muted leading-relaxed">
                Darbhanga, the heart of Mithila, has been known for its makhana for centuries. The clean water of the region, the fertile soil, and the traditional knowledge passed down through generations — that&apos;s what makes our makhana special.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="aspect-square rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src="/images/bihar-fields.jpg"
                alt="Darbhanga, Mithila"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 md:order-1 aspect-square rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src="/images/makhana-2.jpg"
                alt="Prakriti Pops Flavors"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-extrabold text-foreground">{t('about.mission_title')}</h2>
              <p className="mt-6 text-lg text-muted leading-relaxed">{t('about.mission_text')}</p>
              <p className="mt-4 text-muted leading-relaxed">
                We source directly from farmers in Darbhanga, roast in small batches, and pack with zero preservatives. Every pack is a story of Mithila&apos;s heritage meeting modern taste buds.
              </p>
              <Link href="/shop">
                <Button variant="primary" className="mt-6">
                  Try Our Flavours →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-foreground mb-12">The Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 hidden md:block" />
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} text-center`}>
                    <span className="text-sm font-bold text-primary">{item.year}</span>
                    <h3 className="text-xl font-bold mt-1">{item.title}</h3>
                    <p className="text-muted mt-2">{item.desc}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl flex-shrink-0 z-10">
                    {item.emoji}
                  </div>
                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
