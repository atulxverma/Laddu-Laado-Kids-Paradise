"use client"

import { motion } from "framer-motion"
import { Heart, Leaf, Star, Users } from "lucide-react"
import Link from "next/link"

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const values = [
  {
    icon: Heart,
    title: "Crafted with Love",
    desc: "Every piece is handpicked and curated with care for our customers.",
    color: "bg-rose-50 text-rose-500",
  },
  {
    icon: Leaf,
    title: "Sustainable Fashion",
    desc: "We believe in responsible fashion that respects our planet.",
    color: "bg-emerald-50 text-emerald-500",
  },
  {
    icon: Star,
    title: "Premium Quality",
    desc: "Only the finest fabrics and craftsmanship make it to our shelves.",
    color: "bg-amber-50 text-amber-500",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "Built around a community of fashion lovers who inspire each other.",
    color: "bg-blue-50 text-blue-500",
  },
]

const stats = [
  { value: "2K+", label: "Happy Customers" },
  { value: "500+", label: "Products" },
  { value: "50+", label: "Brands" },
  { value: "4.9★", label: "Average Rating" },
]

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32 text-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="flex flex-col items-center gap-6"
          >
            <motion.span
              variants={fadeUp}
              className="text-xs font-bold uppercase tracking-widest text-gray-400 border border-gray-200 px-4 py-1.5 rounded-full"
            >
              Our Story
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-black leading-tight max-w-3xl"
            >
              Fashion that tells{" "}
              <span className="italic font-serif">your story</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed"
            >
              laddoo Laado is more than a clothing brand — it&apos;s a celebration
              of individuality, culture, and modern elegance.
            </motion.p>

            <motion.div variants={fadeUp}>
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full text-sm font-bold hover:opacity-80 transition-opacity"
              >
                Explore Collection
                <span className="h-6 w-6 bg-white text-black rounded-full flex items-center justify-center text-xs">
                  →
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 h-64 w-64 bg-amber-50 rounded-full blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 h-64 w-64 bg-rose-50 rounded-full blur-3xl opacity-60 translate-x-1/2 translate-y-1/2 pointer-events-none" />
      </section>

      {/* STATS */}
      <section className="border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-black text-black">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-1">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STORY */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Who We Are
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-black leading-tight">
              Born from a passion for{" "}
              <span className="italic font-serif">timeless style</span>
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Founded in 2024, laddoo Laado started as a small dream — to bring
              premium, culturally-inspired fashion to everyday people. We blend
              traditional craftsmanship with modern design to create pieces that
              are both beautiful and meaningful.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Today, we serve thousands of happy customers across India, with a
              curated collection that celebrates diversity, quality, and
              self-expression.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-3"
          >
            {[
              "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=600",
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600",
              "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600",
              "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=600",
            ].map((src, i) => (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden bg-gray-100 ${
                  i === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square"
                }`}
              >
                <img
                  src={src}
                  alt="About"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-gray-50/50 border-t border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.span
              variants={fadeUp}
              className="text-xs font-bold uppercase tracking-widest text-gray-400"
            >
              What We Stand For
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="text-3xl font-bold text-black mt-3"
            >
              Our Core Values
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-md transition-all"
              >
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${v.color}`}>
                  <v.icon size={22} />
                </div>
                <h3 className="font-bold text-sm text-black mb-2">{v.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-black rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
              Join Us
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              Ready to find your{" "}
              <span className="italic font-serif">perfect look?</span>
            </h2>
            <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
              Explore our latest collection and discover fashion that speaks to who you are.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Shop Now
              <span className="h-6 w-6 bg-black text-white rounded-full flex items-center justify-center text-xs">
                →
              </span>
            </Link>
          </div>
        </motion.div>
      </section>

    </main>
  )
}