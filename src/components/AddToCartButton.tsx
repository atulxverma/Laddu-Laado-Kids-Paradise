"use client"

import { ShoppingBag, Heart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useState, useEffect } from "react"

export default function AddToCartButton({ product }: { product: any }) {
  const cart = useCart()
  const { toggleItem, items: wishlistItems } = useWishlist()

  const [added, setAdded] = useState(false)
  const [selectedSize, setSelectedSize] = useState("")
  const [mounted, setMounted] = useState(false)

  const availableSizes: string[] = product?.size
    ? product.size.split(",").map((s: string) => s.trim().toUpperCase())
    : []

  const allPossibleSizes = ["0-2Y", "2-4Y", "4-6Y", "6-8Y", "8-10Y", "S", "M", "L", "XL"]
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
    <div className="flex flex-col gap-8">
      {/* Size Selector */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Inventory Sizes</p>
          <span className={`text-[10px] font-bold uppercase ${isOutOfStock ? 'text-red-500' : 'text-emerald-500'}`}>
            {isOutOfStock ? 'Sold Out' : `${product.stock} Units Left`}
          </span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {allPossibleSizes.map((size) => {
            const isAvailable = availableSizes.includes(size.toUpperCase()) && !isOutOfStock
            return (
              <button
                key={size}
                disabled={!isAvailable}
                onClick={() => setSelectedSize(size)}
                className={`group relative h-14 min-w-[65px] px-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center ${
                  !isAvailable
                    ? "bg-gray-50 border-gray-100 opacity-30 cursor-not-allowed"
                    : selectedSize === size
                      ? "bg-black text-white border-black shadow-xl scale-105"
                      : "bg-white border-gray-100 text-black hover:border-black"
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
      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          disabled={!selectedSize || isOutOfStock}
          className="flex-1 flex items-center justify-center gap-3 bg-black text-white py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] hover:opacity-90 active:scale-95 transition-all disabled:opacity-30"
        >
          {isOutOfStock ? "OUT OF STOCK" : !selectedSize ? "CHOOSE SIZE" : added ? "ADDED TO BAG ✓" : "ADD TO BAG"}
        </button>

        <button
          onClick={() => toggleItem(product)}
          className="h-16 w-16 rounded-[1.5rem] border-2 border-gray-100 bg-white flex items-center justify-center active:scale-75 transition-all hover:bg-gray-50"
        >
          <Heart size={24} className={`transition-all duration-500 ${isLiked ? "fill-red-500 text-red-500 scale-110" : "text-gray-200"}`} />
        </button>
      </div>
    </div>
  )
}