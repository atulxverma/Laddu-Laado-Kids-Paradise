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

       <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">
  {availableSizes.map((size) => (
    <button
      key={size}
      type="button"
      onClick={() => setSelectedSize(size)}
      className={`h-12 md:h-14 rounded-2xl border-2 text-[13px] md:text-sm font-black transition-all duration-300
      ${
        selectedSize === size
          ? "bg-black text-white border-black shadow-lg scale-105"
          : "bg-white border-gray-200 hover:border-black hover:bg-gray-50"
      }`}
    >
      {size}
    </button>
  ))}
</div>
      </div>


      {/* Actions */}
      <div className="mt-2 flex gap-3 rounded-3xl border border-gray-200 bg-white p-2 shadow-lg">

  <button
    type="button"
    onClick={handleAdd}
    disabled={!selectedSize || isOutOfStock}
    className="flex-1 h-14 rounded-2xl bg-black text-white text-[11px] md:text-xs font-black uppercase tracking-[0.18em] transition-all hover:bg-neutral-800 active:scale-95 disabled:opacity-40"
  >
    {isOutOfStock
      ? "OUT OF STOCK"
      : !selectedSize
      ? "CHOOSE SIZE"
      : added
      ? "ADDED ✓"
      : "ADD TO CART"}
  </button>

  <button
    type="button"
    onClick={() => toggleItem(product)}
    className="h-14 w-14 rounded-2xl border border-gray-200 bg-white flex items-center justify-center hover:bg-black hover:text-white transition-all"
  >
    <Heart
      size={22}
      className={
        isLiked
          ? "fill-red-500 text-red-500"
          : "text-gray-500"
      }
    />
  </button>

</div>
    </div>
  )
}