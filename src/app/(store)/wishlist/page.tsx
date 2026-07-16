"use client"

import Link from "next/link"
import { ArrowRight, Heart, ShoppingBag } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"
import ProductCard from "@/components/ProductCard"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"

export default function WishlistPage() {
  const { items, toggleItem } = useWishlist()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const validItems = useMemo(() => {
    return items.filter(
      (item) =>
        item &&
        item.id &&
        item.name &&
        item.price &&
        item.images
    )
  }, [items])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-[#fafafa] pb-20 pt-16 md:pt-20 lg:pb-12">
      <div className="mx-auto max-w-7xl px-4">
        <header className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-neutral-400">Saved for Later</p>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
  Wishlist
</h1>

<p className="mt-3 text-sm text-neutral-500 sm:text-base">
  Save products you love and purchase them anytime.
</p>
          </div>

          <div className="inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-5 py-3 text-sm font-bold text-neutral-700 shadow-sm">
            <Heart size={16} className="fill-rose-500 text-rose-500" />
            {validItems.length} Saved {validItems.length === 1 ? "Item" : "Items"}
          </div>
        </header>

        {validItems.length === 0 ? (
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[540px] flex-col items-center justify-center rounded-[28px] border border-neutral-100 bg-white px-6 text-center shadow-sm">
            <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-rose-50">
              <Heart size={42} strokeWidth={1.4} className="text-rose-500" />
            </div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-neutral-400">Nothing saved yet</p>
            <h2 className="text-3xl font-black tracking-tight text-neutral-950">Your Wishlist is Empty</h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-500">Save your favourite products to purchase them later.</p>
            <Link href="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-7 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              Explore Collection
              <ArrowRight size={15} />
            </Link>
          </motion.section>
        ) : (
          <>
            <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-7 flex flex-col gap-5 rounded-[32px] border border-neutral-100 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,.04)] sm:mb-9 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-50">
                  <Heart size={24} className="fill-rose-500 text-rose-500" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-400">Wishlist</p>
                  <h2 className="mt-1 text-xl font-black tracking-tight text-neutral-950">{validItems.length} Products Saved</h2>
                </div>
              </div>
              <p className="max-w-xs text-sm leading-6 text-neutral-500 sm:text-right">Curated pieces you've saved for later.</p>
            </motion.section>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4 lg:gap-7">
              <AnimatePresence initial={false}>
                {validItems.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25, delay: index * 0.03 }}
                    className="group relative min-w-0 rounded-[24px] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <ProductCard product={product} />

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <section className="mt-14 rounded-[32px] border border-neutral-100 bg-white px-6 py-10 text-center shadow-sm sm:mt-20 sm:px-10 sm:py-14">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                <ShoppingBag size={23} strokeWidth={1.5} className="text-neutral-900" />
              </div>
              <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Keep exploring</p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl">Discover New Arrivals</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-neutral-500">Explore newly curated pieces and find your next favourite.</p>
              <Link href="/shop" className="mt-7 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-black px-7 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-xl">
                Shop Collection
                <ArrowRight size={15} />
              </Link>
            </section>
          </>
        )}
      </div>
    </main>
  )
}