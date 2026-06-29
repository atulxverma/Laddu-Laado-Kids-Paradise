"use client"

import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"

export default function ProductCard({ product }: { product: any }) {
  const { toggleItem, items } = useWishlist()
  const isLiked = items.some(i => i.id === product.id)

  return (
    <div className="group relative">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag size={32} className="text-gray-300" />
            </div>
          )}

          {(product?.stock ?? 0) <= 0 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                Sold Out
              </span>
            </div>
          )}

          <button
            onClick={(e) => { e.preventDefault(); toggleItem(product) }}
            className="absolute top-3 right-3 h-9 w-9 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
          >
            <Heart size={16} className={isLiked ? "fill-red-500 text-red-500" : "text-gray-400"} />
          </button>
        </div>

        <div className="mt-3 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 truncate">{product.category?.name}</p>
          <h3 className="text-sm font-bold text-black leading-tight truncate">{product.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-black text-black">₹{product.price.toLocaleString("en-IN")}</span>
            <div className="flex items-center gap-0.5">
              <span className="text-yellow-400 text-[10px]">★</span>
              <span className="text-[10px] font-bold text-gray-400">4.5</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}