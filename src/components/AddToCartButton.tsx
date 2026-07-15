"use client"

import { Heart } from "lucide-react"
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
      stock: product.stock,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Size Selector */}
      <div>
        <div className="flex items-center justify-between mb-4">
  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
    Select Size
  </p>

  <span
    className={`text-[10px] font-bold uppercase ${
      isOutOfStock ? "text-red-500" : "text-emerald-500"
    }`}
  >
    {isOutOfStock ? "Sold Out" : "Ready to Ship"}
  </span>
</div>

        <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
  {availableSizes.map((size) => (
    <button
      key={size}
      type="button"
      onClick={() => setSelectedSize(size)}
      className={`h-[58px] rounded-[22px] border-2 font-black text-sm tracking-wide transition-all duration-300
      ${
        selectedSize === size
          ? "bg-black text-white border-black shadow-[0_15px_40px_rgba(0,0,0,.18)] scale-[1.04]"
          : "bg-white border-gray-200 hover:bg-gray-50 hover:border-black hover:-translate-y-1 hover:shadow-xl"
      }`}
    >
      {size}
    </button>
  ))}
</div>
      </div>


      {/* Actions */}
      <div className="lg:sticky lg:bottom-5 z-20 rounded-[30px] border border-gray-200 bg-white/95 backdrop-blur-xl p-3 shadow-2xl flex gap-3">

        <button
  type="button"
  onClick={handleAdd}
  disabled={!selectedSize || isOutOfStock}
  className="flex-1 h-[64px] rounded-[24px] bg-black text-white font-black uppercase tracking-[0.22em] text-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
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
  type="button"
  onClick={() => toggleItem(product)}
  className="group h-[64px] w-[64px] rounded-[24px] border border-gray-200 bg-white flex items-center justify-center transition-all duration-300 hover:bg-black hover:-translate-y-1 hover:shadow-xl"
>
  <Heart
    size={26}
    strokeWidth={2}
    className={`transition-all duration-300 ${
      isLiked
        ? "fill-red-500 text-red-500"
        : "text-gray-500 group-hover:text-white"
    }`}
  />
</button>

      </div>
    </div>
  )
}