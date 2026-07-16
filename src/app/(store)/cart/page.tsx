"use client"

import Link from "next/link"
import { ArrowLeft, Check, ChevronRight, CreditCard, LockKeyhole, Minus, PackageCheck, Plus, ShoppingBag, Trash2, Truck } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { useCart } from "@/hooks/use-cart"

export default function CartPage() {
  const items = useCart((state) => state.items)
  const removeItem = useCart((state) => state.removeItem)
  const increaseQuantity = useCart((state) => state.increaseQuantity)
  const decreaseQuantity = useCart((state) => state.decreaseQuantity)
  const clearCart = useCart((state) => state.clearCart)

  const [mounted, setMounted] = useState(false)
  const freeDeliveryThreshold = 999

  useEffect(() => {
    setMounted(true)
  }, [])

  const validItems = useMemo(() => {
    return items.filter((item) => item && item.id && item.name && typeof item.price === "number")
  }, [items])

  const subtotal = validItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = validItems.reduce((sum, item) => sum + item.quantity, 0)
  const amountAway = Math.max(freeDeliveryThreshold - subtotal, 0)
  const shippingProgress = Math.min((subtotal / freeDeliveryThreshold) * 100, 100)
  const deliveryCharge = subtotal >= 999 ? 0 : 79
  const total = subtotal + deliveryCharge

  if (!mounted) return null

  if (validItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#fafafa] px-4 pb-10 pt-24 sm:px-6 lg:pt-32">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-black">
            <ArrowLeft size={16} />
            Continue shopping
          </Link>

          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-[560px] flex-col items-center justify-center rounded-[32px] bg-white px-6 text-center shadow-[0_12px_50px_rgba(0,0,0,0.04)]">
            <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-50">
              <ShoppingBag size={40} strokeWidth={1.35} className="text-zinc-900" />
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">Your bag is waiting</p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Your cart is empty</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-zinc-500">Find something special and it will appear here, ready whenever you are.</p>
            <Link href="/shop" className="mt-9 inline-flex items-center gap-2 rounded-full bg-black px-7 py-4 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-zinc-800">
              Continue Shopping
              <ChevronRight size={16} />
            </Link>
          </motion.section>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fafafa] pb-28 pt-16 md:pt-20 lg:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-0">
        <Link href="/shop" className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-black transition-colors">
          <ArrowLeft size={16} />
          Continue shopping
        </Link>

        <header className="mb-8 md:mb-10">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="mt-1 text-2xl md:text-5xl font-black tracking-tight leading-none">
                My Cart
              </h1>

            </div>

            <div className="rounded-full bg-black px-4 py-2 text-[11px] font-bold text-white shadow-sm">
              {itemCount} {itemCount === 1 ? "Item" : "Items"}
            </div>

          </div>

          <p className="mt-3 text-[12px] md:text-[15px] text-neutral-500">
            Review your selected items before checkout.
          </p>

        </header>

        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
          <section>
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-zinc-950">Your bag <span className="font-normal text-zinc-400">({itemCount})</span></p>
              <button onClick={() => { if (confirm("Are you sure you want to clear your cart?")) clearCart() }} className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400 transition-colors hover:text-red-500">
                Clear all
              </button>
            </div>

            <div className="mb-7 rounded-[30px] border border-neutral-200 bg-gradient-to-r from-neutral-50 to-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] uppercase tracking-[0.22em] font-black text-neutral-400">
                    Free Delivery
                  </p>

                  <h3 className="mt-1 text-lg font-black">
                    {subtotal >= freeDeliveryThreshold
                      ? "Unlocked 🎉"
                      : `₹${amountAway.toLocaleString("en-IN")} Away`}
                  </h3>

                </div>

                <Truck size={28} />

              </div>

              <div className="mt-5 h-2 rounded-full bg-neutral-200 overflow-hidden">

                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${shippingProgress}%` }}
                  transition={{ duration: .8 }}
                  className="h-full rounded-full bg-black"
                />

              </div>

            </div>

            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {validItems.map((item, index) => {
                  const category = "category" in item && typeof item.category === "string" ? item.category : "Selected item"

                  return (
                    <motion.article
                      key={`${item.id}-${item.size}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -40 }}
                      transition={{ duration: 0.25 }}
                      className="rounded-[26px] border border-neutral-200 bg-white p-4 md:p-5 shadow-sm hover:shadow-xl transition-all"
                    >
                      <div className="flex gap-4">

                        <Link
                          href={`/product/${item.id}`}
                          className="h-24 w-20 md:h-32 md:w-24 overflow-hidden rounded-2xl bg-neutral-100 shrink-0"
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ShoppingBag size={26} className="text-neutral-300" />
                            </div>
                          )}
                        </Link>

                        <div className="flex flex-1 flex-col justify-between">

                          <div>

                            <p className="text-[10px] uppercase tracking-[0.22em] font-black text-neutral-400">
                              {item.category}
                            </p>

                            <h3 className="mt-1 text-[15px] md:text-lg font-bold leading-snug">
                              {item.name}
                            </h3>

                            <div className="mt-3 flex flex-wrap gap-2">

                              <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-bold">
                                Size {item.size}
                              </span>

                              {item.color && item.color !== "Standard" && (
                                <span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-bold">
                                  {item.color}
                                </span>
                              )}

                            </div>

                          </div>

                          <div className="mt-5 flex items-end justify-between">

                            <div>

                              <p className="text-xl md:text-2xl font-black">
                                ₹{item.price.toLocaleString("en-IN")}
                              </p>

                              <p className="mt-1 text-[11px] text-neutral-400">
                                Delivery in 2–5 Days
                              </p>

                            </div>

                            <button
                              onClick={() => removeItem(item.id, item.size)}
                              className="rounded-full p-3 text-neutral-400 hover:bg-red-50 hover:text-red-500 transition"
                            >
                              <Trash2 size={18} />
                            </button>

                          </div>

                        </div>

                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-5">

                        <div className="flex items-center rounded-full border border-neutral-200">

                          <button
                            disabled={item.quantity <= 1}
                            onClick={() => decreaseQuantity(item.id, item.size)}
                            className="h-9 w-9 rounded-full hover:bg-neutral-100 transition disabled:opacity-40"
                          >
                            −
                          </button>

                          <span className="w-8 text-center font-bold">
                            {item.quantity}
                          </span>

                          <button
                            disabled={item.quantity >= 10}
                            onClick={() => increaseQuantity(item.id, item.size)}
                            className="h-9 w-9 rounded-full hover:bg-neutral-100 transition disabled:opacity-40"
                          >
                            +
                          </button>

                        </div>

                        <p className="text-lg font-black">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>

                      </div>

                    </motion.article>
                  )
                })}
              </AnimatePresence>
            </div>

            <section className="mt-6 rounded-[24px] bg-white p-5 shadow-[0_12px_50px_rgba(0,0,0,0.04)] sm:p-6">
              <p className="text-sm font-semibold text-zinc-950">Have a promo code?</p>
              <div className="mt-4 flex gap-2">
                <input type="text" placeholder="Enter coupon code" className="min-w-0 flex-1 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-900 focus:bg-white" />
                <button type="button" className="rounded-2xl bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200">Apply</button>
              </div>
            </section>
          </section>

          <aside className="h-fit lg:sticky lg:top-24">

            <div className="rounded-[30px] border border-neutral-200 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,.05)]">

              <div>

  <div className="flex items-center justify-between">

    <div>

      <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400 font-black">
        ORDER SUMMARY
      </p>

      <h2 className="mt-1 text-2xl font-black">
        Summary
      </h2>

    </div>

    <div className="h-12 w-12 rounded-2xl bg-neutral-100 flex items-center justify-center">
      <CreditCard size={20} />
    </div>

  </div>

  <div className="my-6 h-px bg-neutral-200" />

  <div className="space-y-4">

    <div className="flex justify-between text-sm">
      <span className="text-neutral-500">Subtotal</span>
      <span className="font-semibold">
        ₹{total.toLocaleString("en-IN")}
      </span>
    </div>

    <div className="flex justify-between text-sm">
      <span className="text-neutral-500">Delivery</span>

      {deliveryCharge === 0 ? (
        <span className="font-bold text-emerald-600">
          FREE
        </span>
      ) : (
        <span className="font-semibold">
          ₹79
        </span>
      )}

    </div>

    {deliveryCharge !== 0 && (

      <p className="text-[11px] text-neutral-500">

        Add{" "}

        <span className="font-bold">

          ₹{amountAway.toLocaleString("en-IN")}

        </span>

        {" "}more for Free Delivery.

      </p>

    )}

  </div>

  <div className="my-6 h-px bg-neutral-200" />

  <div className="flex items-end justify-between">

    <div>

      <p className="text-sm text-neutral-500">
        Grand Total
      </p>

      <p className="text-[11px] text-neutral-400">
        Inclusive of all taxes
      </p>

    </div>

    <h3 className="text-3xl font-black">
      ₹{total.toLocaleString("en-IN")}
    </h3>

  </div>

</div>

              <div className="my-6 h-px bg-neutral-200" />



              <div className="my-6 h-px bg-neutral-200" />

              <div className="flex items-end justify-between">

                <div>

                  <p className="text-sm text-neutral-500">
                    Grand Total
                  </p>

                  <p className="text-[11px] text-neutral-400 mt-1">
                    Inclusive of all taxes
                  </p>

                </div>

                <h3 className="text-3xl font-black tracking-tight">
                  ₹{total.toLocaleString("en-IN")}
                </h3>

              </div>

              {deliveryCharge === 0 && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-center">
                  <p className="text-xs font-bold text-emerald-700">
                    🎉 Congratulations! You unlocked FREE Delivery.
                  </p>
                </div>
              )}

              <Link
                href="/checkout"
                className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-black text-white font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Proceed to Checkout
                <ChevronRight size={18} />
              </Link>

              <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">

                <div className="flex items-center gap-3">

                  <LockKeyhole
                    size={18}
                    className="text-emerald-600"
                  />

                  <div>

                    <p className="text-sm font-bold">
                      Secure Checkout
                    </p>

                    <p className="text-[11px] text-neutral-500">
                      SSL encrypted payment
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">

              <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-sm">

                <PackageCheck
                  size={18}
                  className="mx-auto"
                />

                <p className="mt-2 text-[10px] font-bold">
                  Easy Returns
                </p>

              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-sm">

                <Truck
                  size={18}
                  className="mx-auto"
                />

                <p className="mt-2 text-[10px] font-bold">
                  Fast Delivery
                </p>

              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-center shadow-sm">

                <LockKeyhole
                  size={18}
                  className="mx-auto"
                />

                <p className="mt-2 text-[10px] font-bold">
                  Safe Payment
                </p>

              </div>

            </div>

            <div className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4">

              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-400 mb-3">
                We Accept
              </p>

              <div className="flex flex-wrap gap-2">

                {["VISA", "MASTERCARD", "UPI", "COD"].map((item) => (

                  <span
                    key={item}
                    className="rounded-full bg-neutral-100 px-3 py-2 text-[10px] font-bold"
                  >
                    {item}
                  </span>

                ))}

              </div>

            </div>

          </aside>
        </div>
      </div>

      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} transition={{ delay: 0.2 }} className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-4">
          <div className="min-w-0 flex-1"><p className="text-xs text-zinc-500">Grand total</p><p className="text-lg font-semibold tracking-tight text-zinc-950">₹{total.toLocaleString("en-IN")}</p></div>
          <Link href="/checkout" className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800">
            Checkout
            <ChevronRight size={16} />
          </Link>
        </div>
      </motion.div>
    </main>
  )
}