import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Clock, CreditCard, MapPin, Package, PackageCheck, RotateCcw, ShoppingBag, Truck, XCircle, Eye } from "lucide-react"
import { cancelOrder } from "@/lib/actions"
import CancelOrderButton from "@/components/CancelOrderButton";

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function MyOrdersPage() {
  const user = await currentUser()
  if (!user) redirect("/sign-in")

  const orders = await db.order.findMany({
    where: { clerkId: user.id },
    include: {
      orderItems: {
        include: {
          product: {
            include: {
              images: {
                orderBy: {
                  createdAt: "asc",
                },
              }
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  const getStatusIcon = (status?: string | null) => {
    const s = (status ?? "Pending").toUpperCase()

    switch (s) {
      case "DELIVERED":
        return <CheckCircle2 size={14} className="text-emerald-600" />
      case "SHIPPED":
        return <Truck size={14} className="text-sky-600" />
      case "PROCESSING":
        return <PackageCheck size={14} className="text-sky-600" />
      case "CANCELLED":
        return <XCircle size={14} className="text-rose-600" />
      default:
        return <Clock size={14} className="text-amber-600" />
    }
  }

  const getStatusStyle = (status?: string | null) => {
    const s = (status ?? "Pending").toUpperCase()

    switch (s) {
      case "DELIVERED":
        return "border-emerald-100 bg-emerald-50 text-emerald-700"
      case "SHIPPED":
        return "border-sky-100 bg-sky-50 text-sky-700"
      case "PROCESSING":
        return "border-sky-100 bg-sky-50 text-sky-700"
      case "CANCELLED":
        return "border-rose-100 bg-rose-50 text-rose-700"
      default:
        return "border-amber-100 bg-amber-50 text-amber-700"
    }
  }

  const getTimelineStep = (status?: string | null) => {
    switch ((status ?? "").toUpperCase()) {

      case "PENDING":
        return 1

      case "PROCESSING":
        return 2

      case "SHIPPED":
        return 3

      case "DELIVERED":
        return 4

      case "CANCELLED":
        return 0

      default:
        return 1
    }
  }

  const getDeliveryText = (status?: string | null) => {

    switch ((status ?? "").toUpperCase()) {

      case "PENDING":
        return "Order received"

      case "PROCESSING":
        return "Preparing your order"

      case "SHIPPED":
        return "On the way"

      case "DELIVERED":
        return "Delivered successfully"

      case "CANCELLED":
        return "Order cancelled"

      default:
        return "Order received"
    }

  }

  const getPaymentStatus = (isPaid: boolean) => {
    if (isPaid) {
      return {
        text: "Payment Successful",
        className: "border-emerald-100 bg-emerald-50 text-emerald-700",
        icon: <CheckCircle2 size={13} />,
      }
    }

    return {
      text: "Payment Pending",
      className: "border-amber-100 bg-amber-50 text-amber-700",
      icon: <Clock size={13} />,
    }
  }

  return (
    <main className="min-h-screen bg-[#fafafa] pb-20 pt-20 md:pt-24 lg:pt-28 px-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-0">
        <header className="mb-9 flex flex-col gap-5 sm:mb-11 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-neutral-400">Account</p>
            <h1 className="text-3xl md:text-5xl font-black tracking-[-0.05em] text-neutral-950 sm:text-5xl">My Orders</h1>
            <p className="mt-3 text-sm text-neutral-500 sm:text-base">Track every purchase you&apos;ve made.</p>
          </div>
          <div className="w-fit rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-bold text-neutral-700 shadow-sm">
            {orders.length} {orders.length === 1 ? "Order" : "Orders"}
          </div>
        </header>

        {orders.length === 0 ? (
          <section className="flex min-h-[520px] flex-col items-center justify-center rounded-[36px] border border-neutral-100 bg-white px-6 text-center shadow-sm">
            <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-neutral-50">
              <ShoppingBag size={42} strokeWidth={1.35} className="text-neutral-900" />
            </div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-neutral-400">Your order history</p>
            <h2 className="text-3xl font-black tracking-tight text-neutral-950">No Orders Yet</h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-500">When you place an order, its details and delivery updates will appear here.</p>
            <Link href="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-7 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
              Continue Shopping
              <ArrowRight size={15} />
            </Link>
          </section>
        ) : (
          <div className="space-y-7">
            {orders.map((order) => {
              const timelineStep = getTimelineStep(order.status)
              const status = order.status ?? "Pending"
              const firstProduct = order.orderItems[0]?.product

              return (
                <article key={order.id} className="overflow-hidden rounded-[32px] border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="border-b border-neutral-100 bg-neutral-50/70 px-5 py-5 sm:px-7 sm:py-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="grid grid-cols-2 gap-x-7 gap-y-5 sm:flex sm:flex-wrap sm:gap-x-10">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">Order ID</p>
                          <p className="mt-1.5 text-sm font-bold text-neutral-900">#LL-{order.id.slice(-6).toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">Order Date</p>
                          <p className="mt-1.5 text-sm font-bold text-neutral-900">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">Total Amount</p>
                          <p className="mt-1.5 text-sm font-black tracking-tight text-neutral-950">₹{order.total.toLocaleString("en-IN")}</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="px-6 py-7 md:px-8 md:py-8 sm:px-7 sm:py-8">
                    <div className="mb-8">
                      <div className="mb-5 flex items-center justify-between">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">Delivery Progress</p>
                        <p className="text-xs font-semibold text-neutral-500">{getDeliveryText(order.status)}</p>

                      </div>

                      <div className="grid hidden md:grid grid-cols-4">
                        {[
                          { label: "Ordered", icon: Package },
                          { label: "Packed", icon: PackageCheck },
                          { label: "Shipped", icon: Truck },
                          { label: "Delivered", icon: CheckCircle2 }
                        ].map((step, index) => {
                          const completed = index + 1 <= timelineStep
                          const Icon = step.icon

                          return (
                            <div key={step.label} className="relative flex flex-col items-center text-center">
                              {index !== 3 && <div className={`absolute left-1/2 top-4 h-px w-full ${index + 1 < timelineStep ? "bg-neutral-950" : "bg-neutral-200"}`} />}
                              <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border ${completed ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200 bg-white text-neutral-300"}`}>
                                <Icon size={14} />
                              </div>
                              <p className={`mt-2 text-[10px] font-bold ${completed ? "text-neutral-800" : "text-neutral-400"}`}>{step.label}</p>
                            </div>
                          )
                        })}
                      </div>
                      <div className="md:hidden">

                        <div className="flex items-center justify-between">

                          {[
                            { label: "Ordered", step: 1 },
                            { label: "Packed", step: 2 },
                            { label: "Shipped", step: 3 },
                            { label: "Delivered", step: 4 },
                          ].map((item) => {


                            const active = item.step <= timelineStep

                            return (

                              <div
                                key={item.label}
                                className="flex flex-col items-center flex-1"
                              >

                                <div
                                  className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all
            ${active
                                      ? "bg-black text-white"
                                      : "bg-neutral-200 text-neutral-500"
                                    }`}
                                >
                                  {item.step}
                                </div>

                                <span
                                  className={`mt-2 text-[9px] font-bold ${active ? "text-black" : "text-neutral-400"
                                    }`}
                                >
                                  {item.label}
                                </span>

                              </div>

                            )

                          })}

                        </div>

                        <div className="mb-8 rounded-3xl border border-neutral-200 bg-neutral-50 p-5">

                          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                            Order Summary
                          </p>

                          <div className="space-y-3 text-sm">

                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>₹{order.subtotal}</span>
                            </div>

                            <div className="flex justify-between">
                              <span>Delivery</span>

                              <span>
                                {order.deliveryCharge === 0
                                  ? "FREE"
                                  : `₹${order.deliveryCharge}`}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span>COD Charge</span>

                              <span>
                                {order.codCharge === 0
                                  ? "-"
                                  : `₹${order.codCharge}`}
                              </span>
                            </div>

                            <div className="border-t pt-3 flex justify-between font-black">
                              <span>Total</span>
                              <span>₹{order.total}</span>
                            </div>

                          </div>

                        </div>

                      </div>
                    </div>

                    <div className="border-t border-neutral-100 pt-6">
                      <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">Ordered Products</p>

                      <div className="space-y-5">
                        {order.orderItems.map((item) => (
                          <div key={item.id} className="rounded-[24px] border border-neutral-100 p-4 transition-all duration-300 hover:bg-neutral-50 hover:shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
                              <div className="h-28 w-24 md:h-32 md:w-28 shrink-0 overflow-hidden rounded-[22px] border border-neutral-100 bg-neutral-50 sm:h-28 sm:w-24">
                                {item.product.images[0]?.url ? <img src={item.product.images[0]?.url} alt={item.product.name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center"><ShoppingBag size={20} className="text-neutral-300" /></div>}
                              </div>

                              <div className="min-w-0 flex-1">
                                {item.product.category?.name && <span className="mb-2 inline-flex rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500">{item.product.category.name}</span>}
                                <h3 className="line-clamp-2 text-base font-bold text-neutral-950 sm:text-lg">{item.product.name}</h3>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[10px] font-bold text-neutral-600">Size: {item.size || "N/A"}</span>
                                  <span className="rounded-full border border-neutral-200 bg-white px-2.5 py-1 text-[10px] font-bold text-neutral-600">Qty: {item.quantity}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                              <p className="text-base font-black tracking-tight text-neutral-950">₹{item.product.price.toLocaleString("en-IN")}</p>
                              <Link href={`/product/${item.product.id}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-900 transition-opacity hover:opacity-50">
                                View Item
                                <ArrowRight size={14} />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <footer className="grid grid-cols-1 gap-5 border-t border-neutral-100 bg-neutral-50/50 px-5 py-5 sm:grid-cols-2 sm:px-7 lg:grid-cols-[1.4fr_1fr_auto] lg:items-center">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-neutral-600 shadow-sm">
                        <MapPin size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Shipping Address</p>
                        <p className="mt-1 break-words leading-6 text-xs font-medium text-neutral-600">{order.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-neutral-600 shadow-sm">
                        <CreditCard size={15} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">Payment Method</p>
                        <p className="mt-1 text-xs font-medium text-neutral-600">
                          {order.paymentMethod === "ONLINE"
                            ? " Online Payment (Razorpay)"
                            : " Cash on Delivery"}
                        </p>

                        <span
                          className={`mt-2 inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${order.isPaid
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                            }`}
                        >
                          {order.status?.toUpperCase() === "DELIVERED"
                            ? "Paid"
                            : "Pending"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:flex gap-2 lg:justify-end">
                      {firstProduct && <Link href={`/product/${firstProduct.id}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-xs font-bold text-neutral-800 transition-all duration-300 hover:border-neutral-900 hover:shadow-sm"><Eye size={14} /> View Details</Link>}
                      {order.status?.toUpperCase() === "PENDING" && (
                        <CancelOrderButton orderId={order.id} />
                      )}

                      {order.status?.toUpperCase() === "CONFIRMED" && (
                        <button
                          disabled
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-600 cursor-not-allowed"
                        >
                          <Package size={14} />
                          Preparing
                        </button>
                      )}

                      {order.status?.toUpperCase() === "SHIPPED" && (
                        <button
                          disabled
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2.5 text-xs font-bold text-sky-600 cursor-not-allowed"
                        >
                          <Truck size={14} />
                          On The Way
                        </button>
                      )}

                      {order.status?.toUpperCase() === "CANCELLED" && (
                        <button
                          disabled
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 cursor-not-allowed"
                        >
                          <XCircle size={14} />
                          Cancelled
                        </button>
                      )}
                      <Link href="/shop" className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-4 py-2.5 text-xs font-bold text-white transition-all duration-300 hover:bg-neutral-800 hover:shadow-lg"><RotateCcw size={14} /> Buy Again</Link>
                    </div>
                  </footer>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}