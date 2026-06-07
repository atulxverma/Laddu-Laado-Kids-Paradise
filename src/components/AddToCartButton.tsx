"use client"

import { ShoppingBag, Heart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useState, useEffect } from "react"

export default function AddToCartButton({ product }: { product: any }) {
  const addItem = useCart((state) => state.addItem)
  const { toggleItem, items } = useWishlist()
  
  const [added, setAdded] = useState(false)
  const [selectedSize, setSelectedSize] = useState("")
  const [mounted, setMounted] = useState(false)

  // 1. Parse Available Sizes from Admin
  // Admin ne agar "S, M" dala hai toh ye array ban jayega ["S", "M"]
  const availableSizes = product.size 
    ? product.size.split(",").map((s: string) => s.trim().toUpperCase()) 
    : []

  // 2. Master list of all possible sizes (Indian Kids Store Standard)
  const allPossibleSizes = ["0-2Y", "2-4Y", "4-6Y", "6-8Y", "8-10Y", "S", "M", "L", "XL"]

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLiked = items.some((i) => i.id === product.id)

  const handleAdd = () => {
    if (!selectedSize) return alert("Please select a size first")
    addItem({
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

  if (!mounted) return null

  return (
    <div className="flex flex-col gap-8">
      {/* Size Selector with Sold Out Logic */}
      <div>
        <div className="flex items-center justify-between mb-4">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Select Available Size</p>
           <span className="text-[10px] font-bold text-emerald-500 uppercase">In Stock</span>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {allPossibleSizes.map((size) => {
            const isAvailable = availableSizes.includes(size.toUpperCase());
            
            return (
              <button
                key={size}
                disabled={!isAvailable}
                onClick={() => setSelectedSize(size)}
                className={`group relative h-14 min-w-[60px] px-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center ${
                  !isAvailable 
                    ? "bg-gray-50 border-gray-100 opacity-40 cursor-not-allowed" 
                    : selectedSize === size
                      ? "bg-black text-white border-black shadow-xl shadow-gray-200"
                      : "bg-white border-gray-100 text-black hover:border-black"
                }`}
              >
                <span className={`text-sm font-black ${!isAvailable ? "line-through" : ""}`}>
                  {size}
                </span>
                {!isAvailable && (
                  <span className="text-[7px] font-bold text-red-500 mt-0.5">SOLD OUT</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          disabled={!selectedSize}
          className="flex-1 flex items-center justify-center gap-3 bg-black text-white py-5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] hover:shadow-2xl active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ShoppingBag size={18} />
          {!selectedSize ? "PICK A SIZE" : added ? "ADDED TO BAG ✓" : "ADD TO BAG"}
        </button>

        <button
          onClick={() => toggleItem(product)}
          className="h-16 w-16 rounded-[1.5rem] border-2 border-gray-100 bg-white flex items-center justify-center active:scale-75 transition-all hover:bg-gray-50"
        >
          <Heart
            size={24}
            className={`transition-all duration-500 ${
              isLiked ? "fill-red-500 text-red-500 scale-110" : "text-gray-200"
            }`}
          />
        </button>
      </div>
    </div>
  )
}