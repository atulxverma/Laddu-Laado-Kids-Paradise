"use client"

import Link from "next/link"
import { Heart, ArrowLeft, ShoppingBag } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"
import ProductCard from "@/components/ProductCard"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export default function WishlistPage() {
  const { items, toggleItem } = useWishlist()
  const [mounted, setMounted] = useState(false)

  // Hydration fix for Persist
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Breadcrumb & Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <Link href="/" className="hover:text-black flex items-center gap-1 transition-colors">
              <ArrowLeft size={13} /> Home
            </Link>
            <span>›</span>
            <span>Wishlist</span>
          </div>
          
          <h1 className="text-3xl font-black text-black tracking-tighter">
            My Favorites
            <span className="ml-3 text-sm font-bold text-gray-300 uppercase tracking-widest">
              {items.length} Items
            </span>
          </h1>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-32 text-center"
          >
            <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-gray-200" />
            </div>
            <h2 className="text-xl font-bold text-black mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-gray-400 mb-8 max-w-xs mx-auto">
              Save your favorite items here to keep an eye on them and buy them later.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-all shadow-lg shadow-gray-200"
            >
              Start Shopping
              <span className="h-6 w-6 bg-white text-black rounded-full flex items-center justify-center text-[10px]">→</span>
            </Link>
          </motion.div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            <AnimatePresence>
              {items.map((product) => (
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
                  
                  {/* Remove Button Overlay (Optional, but good for UX) */}
                  <button
                    onClick={() => toggleItem(product)}
                    className="absolute top-2 left-2 bg-black/10 backdrop-blur-md text-white text-[8px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    REMOVE
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Suggested Products (If wishlist is small) */}
        {items.length > 0 && items.length < 4 && (
          <div className="mt-24 border-t border-gray-100 pt-16">
            <h3 className="text-xl font-bold mb-8">You might also like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
               {/* Yahan par random products fetch karke dikha sakte ho */}
               <p className="text-xs text-gray-400 italic">Check out our new arrivals...</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}