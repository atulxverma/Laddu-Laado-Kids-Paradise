"use client"

import { Heart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AddToCartButton({ product }: { product: any }) {
  const cart = useCart()
  const { toggleItem, items: wishlistItems } = useWishlist()

  const [added, setAdded] = useState(false)
  const [selectedSize, setSelectedSize] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !product) return null

  const variants = product.variants || []



  const selectedVariant = variants.find(
    (v: any) => v.size === selectedSize
  )

  const stock = selectedVariant?.stock ?? 0

  const isOutOfStock = variants.every(
    (v: any) => v.stock === 0
  )

  const isLowStock = stock > 0 && stock <= 5

  const currentItem = cart.items.find(
    (item: any) =>
      item.id === product.id &&
      item.size === selectedSize
  )

  const currentQty = currentItem?.quantity ?? 0

  const isLiked = wishlistItems.some(
    (item: any) => item.id === product.id
  )

  const handleAdd = () => {
    if (added) return
    if (!selectedSize) {
      alert("Please select a size.")
      return
    }

    if (isOutOfStock) {
      alert("This product is currently out of stock.")
      return
    }

    if (currentQty >= stock) {
      alert(`Only ${stock} item(s) available.`)
      return
    }

    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || "",
      size: selectedSize,
      color: product.color || "",
      category: product.category?.name || "",
      stock: selectedVariant?.stock ?? 0,
    })

    setAdded(true)

    setTimeout(() => {
      setAdded(false)
    }, 2000)
  }

  const handleBuyNow = () => {
    if (!selectedSize) {
      alert("Please select a size.")
      return
    }

    if (isOutOfStock) {
      alert("This product is currently out of stock.")
      return
    }

    const alreadyInCart = cart.items.some(
      (item: any) =>
        item.id === product.id &&
        item.size === selectedSize
    )

    if (!alreadyInCart) {
      cart.addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.url || "",
        size: selectedSize,
        color: product.color || "",
        category: product.category?.name || "",
        stock: selectedVariant?.stock ?? 0,
      })
    }

    router.push("/checkout")
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Size */}
      <div>
        <div className="flex items-center justify-between mb-4">

          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Select Size
          </p>

          {isOutOfStock ? (
            <span className="text-[10px] font-bold uppercase text-red-500">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="text-[10px] font-bold uppercase text-amber-600">
              Only {stock} Left
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase text-emerald-600">
              In Stock
            </span>
          )}
        </div>

        <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-3">

          {variants.map((variant: any) => (
            <button
              key={variant.size}
              type="button"
              disabled={variant.stock === 0}
              onClick={() => setSelectedSize(variant.size)}
              className={`h-12 md:h-14 rounded-2xl border-2 text-[13px] md:text-sm font-black transition-all
              ${selectedSize === variant.size
                  ? "bg-black text-white border-black"
                  : "bg-white border-gray-200 hover:border-black"
                }
              ${variant.stock === 0
                  ? "opacity-40 cursor-not-allowed"
                  : ""
                }
              `}
            >
              {variant.size}
            </button>
          ))}

        </div>

        {isLowStock && (
          <p className="mt-3 text-xs text-amber-600 font-semibold">
            Hurry! Only {stock} piece{stock > 1 ? "s" : ""} left.
          </p>
        )}
      </div>

      {/* Buttons */}

      <div className="flex flex-col gap-4">

        {/* Buttons */}

        <div className="flex flex-col gap-4">

          <div className="grid grid-cols-[1fr_1fr_48px]
sm:grid-cols-[1fr_1fr_56px]
md:grid-cols-[1fr_1fr_60px] gap-3">

            {/* Add To Cart */}

            <button
              type="button"
              onClick={handleAdd}
              disabled={!selectedSize || isOutOfStock || added}
              className="
      h-14
      rounded-full
      border
      border-neutral-900
      bg-white
      text-neutral-900
      text-[11px]
sm:text-[13px]
md:text-sm
font-semibold
tracking-[0.12em]
uppercase
      transition-all
      duration-300
      hover:-translate-y-0.5
      hover:shadow-lg
      active:translate-y-0
      disabled:border-neutral-300
      disabled:bg-neutral-100
      disabled:text-neutral-400
      disabled:shadow-none
      disabled:cursor-not-allowed
      "
            >
              {isOutOfStock
                ? "OUT OF STOCK"
                : !selectedSize
                  ? "SELECT SIZE"
                  : added
                    ? "✓ ADDED"
                    : "ADD TO CART"}
            </button>

            {/* Buy Now */}

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!selectedSize || isOutOfStock}
              className="
      h-14
      rounded-full
      bg-neutral-900
      text-white
      text-[11px]
sm:text-[13px]
md:text-sm
font-semibold
tracking-[0.12em]
uppercase
      transition-all
      duration-300
      hover:-translate-y-0.5
      hover:bg-neutral-800
      hover:shadow-xl
      active:translate-y-0
      disabled:bg-neutral-300
      disabled:text-neutral-100
      disabled:shadow-none
      disabled:cursor-not-allowed
      "
            >
              BUY NOW
            </button>

            {/* Wishlist */}

            <button
              type="button"
              onClick={() => toggleItem(product)}
              className={`
      h-12
      w-12
      sm:h-14 sm:w-14
      rounded-full
      border
      flex
      items-center
      justify-center
      transition-all
      duration-300
      hover:-translate-y-0.5
      hover:shadow-lg
      ${isLiked
                  ? "border-red-200 bg-red-50"
                  : "border-neutral-300 bg-white"
                }
      `}
            >
              <Heart
                size={20}
                className={
                  isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-neutral-700"
                }
              />
            </button>

          </div>

        </div>

      </div>
    </div>
  )
}