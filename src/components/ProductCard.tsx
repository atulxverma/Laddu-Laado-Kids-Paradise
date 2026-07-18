"use client"

import Link from "next/link"
import { Heart, ShoppingBag, Pencil } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"

export default function ProductCard({ product }: { product: any }) {
  const { toggleItem, items } = useWishlist()
  const isLiked = items.some(i => i.id === product.id)
  const reviews = product.reviews || [];

  const totalReviews = reviews.length;

  const avgRating =
    totalReviews > 0
      ? (
        reviews.reduce(
          (acc: number, r: any) => acc + r.rating,
          0
        ) / totalReviews
      ).toFixed(1)
      : "0.0";
      

  return (
    <div className="group relative flex flex-col">
      <Link href={`/product/${product.id}`} className="flex flex-col h-full">

        {/* Image Container — Amazon/Flipkart style: taller on mobile */}
        <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-lg transition-all duration-300">
          {product.images?.[0]?.url ? (
            <img
              loading="eager"
              src={product.images[0].url}
              onError={(e) => {
                e.currentTarget.src = "/placeholder.png";
              }}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag size={28} className="text-gray-300" />
            </div>
          )}

          {/* Sold Out overlay */}
          {(product?.stock ?? 0) <= 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 bg-white px-2.5 py-1 rounded-full border border-gray-200">
                Sold Out
              </span>
            </div>
          )}

          {/* Wishlist button — always visible on mobile, hover on desktop */}
          <button
            onClick={(e) => { e.preventDefault(); toggleItem(product) }}
            className={`absolute top-2.5 right-2.5 h-9 w-9 rounded-full backdrop-blur-md flex items-center justify-center shadow-lg transition-all md:opacity-0 md:group-hover:opacity-100 ${isLiked
              ? "bg-red-50 border border-red-200"
              : "bg-white/90"
              }`}
          >
            <Heart size={16} className={isLiked ? "fill-red-500 text-red-500" : "text-gray-400"} />
          </button>
        </div>

        {/* Product Info */}
        <div className="mt-2 md:mt-3 flex flex-col gap-0.5 flex-1">
          {/* Category */}
          <p className="text-[10px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 truncate">
            {product.category?.name}
          </p>

          {/* Name */}
          <h3 className="text-[13px] md:text-[15px] font-bold text-black leading-tight line-clamp-2">
            {product.name}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="mt-1 text-[11px] md:text-[12px] text-gray-500 leading-5 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Price + Rating row */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-[15px] md:text-lg font-black text-black">
              ₹{(product.price ?? 0).toLocaleString("en-IN")}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-[10px]">★</span>

              <span className="text-[9px] md:text-[10px] font-bold text-gray-500">
                {avgRating}
              </span>

              <span className="text-[8px] text-gray-400">
                ({totalReviews})
              </span>
            </div>
          </div>

          {/* Size tag if available */}
          {product.size && (
            <p className="text-[9px] text-gray-400 font-medium mt-0.5 truncate">
              Sizes: {product.size}
            </p>
          )}
        </div>
      </Link>
    </div>
  )
}