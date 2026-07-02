"use client"

import Link from "next/link"
import { Heart, ArrowLeft } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"
import ProductCard from "@/components/ProductCard"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useMemo, useState } from "react"

export default function WishlistPage() {
  const { items, toggleItem } = useWishlist()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Remove broken/deleted products
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
    <main className="bg-white min-h-screen pb-20 pt-28">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link
              href="/"
              className="hover:text-black flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={13} />
              Home
            </Link>

            <span>›</span>

            <span>Wishlist</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">
            My Favorites

            <span className="ml-3 text-sm font-bold text-gray-300 uppercase tracking-widest">
              {validItems.length} Items
            </span>
          </h1>
        </div>

        {validItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-32 text-center"
          >
            <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-gray-200" />
            </div>

            <h2 className="text-xl font-bold text-black mb-2">
              Your wishlist is empty
            </h2>

            <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto">
              Save your favourite products here and shop later.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-all"
            >
              Start Shopping

              <span className="h-6 w-6 bg-white text-black rounded-full flex items-center justify-center text-[10px]">
                →
              </span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            <AnimatePresence>
              {validItems.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="relative group"
                >
                  <ProductCard product={product} />

                  <button
                    onClick={() => toggleItem(product)}
                    className="absolute top-2 left-2 bg-black/70 text-white text-[8px] font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                  >
                    REMOVE
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {validItems.length > 0 &&
          validItems.length < 4 && (
            <div className="mt-24 border-t border-gray-100 pt-16">
              <h3 className="text-xl font-bold mb-8">
                You might also like
              </h3>

              <p className="text-sm text-gray-400 italic">
                Explore our latest arrivals and trending collections.
              </p>
            </div>
          )}
      </div>
    </main>
  )
}