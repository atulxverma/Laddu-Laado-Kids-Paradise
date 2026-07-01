"use client"

import { Heart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useState, useEffect } from "react"

const allPossibleSizes = ["0-2Y", "2-4Y", "4-6Y", "6-8Y", "8-10Y", "S", "M", "L", "XL"]

export default function AddToCartButton({ product }: { product: any }) {
  const cart = useCart()
  const { toggleItem, items: wishlistItems } = useWishlist()

  const [added, setAdded] = useState(false)
  const [selectedSize, setSelectedSize] = useState("")
  const [mounted, setMounted] = useState(false)

  const availableSizes: string[] = product?.size
    ? product.size.split(",").map((s: string) => s.trim().toUpperCase())
    : []

  const isOutOfStock = (product?.stock ?? 0) <= 0

  const currentItemInCart = cart.items.find(
    (i: any) => i.id === product?.id && i.size === selectedSize
  )
  const currentQty = currentItemInCart?.quantity || 0

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!product) return null
  if (!mounted) return null

  const isLiked = wishlistItems.some((i: any) => i.id === product.id)

  const handleAdd = () => {
    if (!selectedSize) return alert("Please select a size first")

    if (currentQty + 1 > product.stock) {
      return alert(`Apologies! Only ${product.stock} units are currently available in stock.`)
    }

    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || "",
      size: selectedSize,
      color: product.color || "Standard",
      category: product.category?.name || "",
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Size Selector */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Inventory Sizes</p>
          <span className={`text-[10px] font-bold uppercase ${isOutOfStock ? 'text-red-500' : 'text-emerald-500'}`}>
            {isOutOfStock ? 'Sold Out' : `${product.stock} Units Left`}
          </span>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
          {allPossibleSizes.map((size) => {
            const isAvailable = availableSizes.includes(size.toUpperCase()) && !isOutOfStock
            return (
              <button
                key={size}
                disabled={!isAvailable}
                onClick={() => setSelectedSize(size)}
                className={`h-11 md:h-14 rounded-xl md:rounded-2xl border-2 transition-all duration-300 flex items-center justify-center font-black text-xs md:text-sm ${!isAvailable
                  ? "bg-gray-50 border-gray-100 opacity-30 cursor-not-allowed"
                  : selectedSize === size
                    ? "bg-black text-white border-black shadow-xl scale-105"
                    : "bg-white border-gray-200 hover:border-black hover:shadow-md"
                  }`}
              >
                <span className={`text-sm font-black ${!isAvailable ? "line-through" : ""}`}>{size}</span>
                {!isAvailable && <span className="text-[6px] font-bold text-red-500">SOLD OUT</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">

        <button
          onClick={handleAdd}
          disabled={!selectedSize || isOutOfStock}
          className="flex-1 h-16 rounded-[1.5rem] bg-black text-white font-black uppercase tracking-[0.2em] text-xs transition-all hover:opacity-90 active:scale-95 disabled:opacity-30 shadow-xl"
        >
          {isOutOfStock
            ? "OUT OF STOCK"
            : !selectedSize
              ? "SELECT SIZE"
              : added
                ? "ADDED ✓"
                : "ADD TO BAG"}
        </button>

        <button
          onClick={() => toggleItem(product)}
          className="h-16 w-16 rounded-[1.5rem] border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-all"
        >
          <Heart
            size={24}
            className={
              isLiked
                ? "fill-red-500 text-red-500"
                : "text-gray-400"
            }
          />
        </button>

      </div>
    </div>
  )
}