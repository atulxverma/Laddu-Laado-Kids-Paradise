"use client"

import Link from "next/link"
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"

export default function CartPage() {
  const items = useCart((state) => state.items)
  const removeItem = useCart((state) => state.removeItem)
  const increaseQuantity = useCart((state) => state.increaseQuantity)
  const decreaseQuantity = useCart((state) => state.decreaseQuantity)
  const clearCart = useCart((state) => state.clearCart)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const validItems = useMemo(() => {
    return items.filter(
      (item) =>
        item &&
        item.id &&
        item.name &&
        typeof item.price === "number"
    )
  }, [items])

  const subtotal = validItems.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  )

  if (!mounted) return null

  return (
    <main className="bg-white pb-20 min-h-screen pt-28">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6">
          <Link
            href="/"
            className="hover:text-black flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={13} /> Home
          </Link>

          <span>›</span>
          <span>Cart</span>
        </div>

        <h1 className="text-2xl font-bold mb-6">
          My Cart{" "}
          {validItems.length > 0 && (
            <span className="text-gray-400 font-normal text-base">
              ({validItems.length} items)
            </span>
          )}
        </h1>

        {validItems.length === 0 ? (
          <div className="py-32 text-center">
            <ShoppingBag
              size={48}
              className="text-gray-200 mx-auto mb-4"
            />

            <p className="text-gray-400 mb-6 text-sm">
              Your cart is empty
            </p>

            <Link
              href="/shop"
              className="text-sm font-bold bg-black text-white px-6 py-3 rounded-full hover:opacity-80 transition-opacity"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">
                  {validItems.length} Items
                </span>

                <button
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to clear your cart?"
                      )
                    ) {
                      clearCart()
                    }
                  }}
                  className="text-xs text-red-500 font-medium hover:opacity-70 transition-opacity"
                >
                  Clear All
                </button>
              </div>

              <AnimatePresence>
                {validItems.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    className="flex items-center gap-4 py-5 border-b border-gray-100"
                  >
                    <div className="h-24 w-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag
                            size={20}
                            className="text-gray-300"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">
                        {item.name}
                      </h3>

                      <p className="text-sm font-bold mt-1">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                          Size: {item.size}
                        </span>

                        {item.color &&
                          item.color !== "Standard" && (
                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                              {item.color}
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <button
                        onClick={() =>
                          removeItem(item.id, item.size)
                        }
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            decreaseQuantity(
                              item.id,
                              item.size
                            )
                          }
                          className="h-7 w-7 rounded-full border border-gray-200 text-sm flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30"
                        >
                          −
                        </button>

                        <span className="text-sm font-bold w-5 text-center">
                          {item.quantity}
                        </span>

                        <button
                          disabled={item.quantity >= 10}
                          onClick={() =>
                            increaseQuantity(
                              item.id,
                              item.size
                            )
                          }
                          className="h-7 w-7 rounded-full border border-gray-200 text-sm flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="h-fit border border-gray-100 rounded-2xl p-6 space-y-5 sticky top-28">
              <h2 className="font-bold text-lg">
                Order Summary
              </h2>

              <div className="space-y-2">
                {validItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex justify-between text-xs text-gray-500"
                  >
                    <span className="truncate mr-2">
                      {item.name} × {item.quantity}
                    </span>

                    <span className="shrink-0 font-medium">
                      ₹
                      {(item.price * item.quantity).toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between font-bold">
                <span>Subtotal</span>

                <span>
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <Link href="/checkout">
                <button
                  disabled={validItems.length === 0}
                  className="w-full bg-black text-white py-4 rounded-full text-sm font-bold hover:opacity-80 transition-opacity disabled:opacity-40"
                >
                  Checkout
                </button>
              </Link>
            </div>

          </div>
        )}
      </div>
    </main>
  )
}