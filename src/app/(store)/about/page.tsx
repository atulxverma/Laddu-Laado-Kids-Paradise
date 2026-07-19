"use client"

import { motion } from "framer-motion"
import { Heart, Leaf, Star, Users } from "lucide-react"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"

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
    desc: "Soft fabrics designed to keep your little one comfortable all day.",
    color: "bg-rose-50 text-rose-500",
  },
  {
    icon: Leaf,
    title: "Skin Friendly",
    desc: "Gentle materials that are safe, breathable and perfect for kids.",
    color: "bg-emerald-50 text-emerald-500",
  },
  {
    icon: Star,
    title: "Premium Craftsmanship",
    desc: "Carefully stitched outfits with attention to every detail. and craftsmanship make it to our shelves.",
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
  {
    value: "100%",
    label: "Premium Quality",
  },
  {
    value: "Soft",
    label: "Comfort Fabric",
  },
  {
    value: "Fast",
    label: "Shipping",
  },
  {
    value: "Easy",
    label: "Returns",
  },
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
              Premium Fashion
              for {" "}
              <span className="  font-serif">Every Little Star</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-gray-500 text-base md:text-lg max-w-xl leading-relaxed"
            >
              At Laddoo Laado, we believe every child deserves clothing that is soft, comfortable and beautifully designed. Our collections are thoughtfully crafted to bring together quality, style and everyday comfort for your little ones.
            </motion.p>

            <motion.div variants={fadeUp}>
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full text-sm font-bold hover:opacity-80 transition-opacity"
              >
                Shop Collection
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
      <section className="max-w-7xl mx-auto px-4 py-5">
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
              Designed with Love,{" "}
              <span className="  font-serif">Made for Comfort</span>
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Laddoo Laado was created with one simple vision — to make premium kidswear that combines comfort, quality and timeless style.
              Every outfit is thoughtfully selected using soft fabrics, modern designs and kid-friendly fits, ensuring your little one feels as good as they look.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Whether it's everyday wear or a special occasion, our collections are designed to make childhood even more colorful.
            </p>
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
              Dress Your Little One{" "}
              <span className="  font-serif">in Style</span>
            </h2>
            <p className="text-white/60 text-sm mb-8 max-w-md mx-auto">
              Discover premium outfits designed with comfort, quality and love for every little star.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Explore Collection
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