import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Clock, CreditCard, MapPin, Package, PackageCheck, RotateCcw, ShoppingBag, Truck, XCircle, Eye, ExternalLink } from "lucide-react"
import CancelOrderButton from "@/components/CancelOrderButton";
import PreparingShipmentButton from "@/components/PreparingShipmentButton";

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
                  position: "asc",
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

  // const getPaymentStatus = (isPaid: boolean) => {
  //   if (isPaid) {
  //     return {
  //       text: "Payment Successful",
  //       className: "border-emerald-100 bg-emerald-50 text-emerald-700",
  //       icon: <CheckCircle2 size={13} />,
  //     }
  //   }

  //   return {
  //     text: "Payment Pending",
  //     className: "border-amber-100 bg-amber-50 text-amber-700",
  //     icon: <Clock size={13} />,
  //   }
  // }

  return (
    <main className="min-h-screen bg-[#fafafa] pb-20 pt-20 md:pt-24 lg:pt-28 px-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-0">
        <header className="mb-10">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-xs font-black uppercase tracking-[0.35em] text-neutral-400">
                Laddoo Laado
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] text-black md:text-5xl">
                My Orders
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
                Track every purchase, monitor delivery progress and manage your
                orders from one place.
              </p>

            </div>

            

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
          <div className="space-y-8 pb-8">
            {orders.map((order) => {
              const timelineStep = getTimelineStep(order.status)
              const status = order.status ?? "Pending"
              const firstProduct = order.orderItems[0]?.product

              return (
                <article key={order.id} className="overflow-hidden rounded-[32px] border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="border-b border-neutral-200 bg-gradient-to-r from-white via-neutral-50 to-white px-6 py-5 md:px-8">

                    <div className="space-y-4">

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-xl font-black tracking-tight text-black">
                          #{order.id.slice(-8).toUpperCase()}
                        </h2>

                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wider ${order.isPaid
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                            }`}
                        >
                          {order.isPaid ? (
                            <>
                              <CheckCircle2 size={13} />
                              Paid
                            </>
                          ) : (
                            <>
                              <Clock size={13} />
                              Payment Pending
                            </>
                          )}
                        </span>

                      </div>

                      <div className="grid grid-cols-3 gap-3 sm:flex sm:flex-wrap sm:gap-x-8 sm:gap-y-3">

                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400">
                            Ordered On
                          </p>

                          <p className="mt-1 text-xs sm:text-sm font-bold text-neutral-900 whitespace-nowrap">
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400">
                            Payment
                          </p>

                          <p className="mt-1 text-xs sm:text-sm font-bold text-neutral-900 whitespace-nowrap">
                            {order.paymentMethod === "ONLINE"
                              ? "Online"
                              : "COD"}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-400">
                            Items
                          </p>

                          <p className="mt-1 text-xs sm:text-sm font-bold text-neutral-900">
                            {order.orderItems.length}
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>

                  <div className="px-6 py-7 md:px-8 md:py-8 sm:px-7 sm:py-8">
                    <div className="mb-6">

                      <div className="mb-5">

                        <div>

                          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-neutral-400">
                            Order Progress
                          </p>

                          <h3 className="mt-1 text-base font-bold text-black">
                            {getDeliveryText(order.status)}
                          </h3>

                        </div>



                      </div>

                      <div className="relative">

                        <div className="absolute left-0 right-0 top-4 h-[2px] rounded-full bg-neutral-200" />

                        <div
                          className="absolute left-0 top-4 h-[2px] rounded-full bg-black transition-all duration-700"
                          style={{
                            width: `${((timelineStep - 1) / 3) * 100}%`,
                          }}
                        />

                        <div className="relative grid grid-cols-4">

                          {[
                            {
                              title: "Ordered",
                              icon: Package,
                            },
                            {
                              title: "Packed",
                              icon: PackageCheck,
                            },
                            {
                              title: "Shipped",
                              icon: Truck,
                            },
                            {
                              title: "Delivered",
                              icon: CheckCircle2,
                            },
                          ].map((step, index) => {

                            const completed = timelineStep > index

                            const Icon = step.icon

                            return (

                              <div
                                key={step.title}
                                className="flex flex-col items-center"
                              >

                                <div
                                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-500 ${completed
                                    ? "border-black bg-black text-white shadow-lg"
                                    : "border-neutral-300 bg-white text-neutral-400"
                                    }`}
                                >

                                  <Icon size={14} />

                                </div>

                                <p
                                  className={`mt-4 text-xs font-black ${completed
                                    ? "text-black"
                                    : "text-neutral-400"
                                    }`}
                                >
                                  {step.title}
                                </p>

                              </div>

                            )

                          })}

                        </div>

                      </div>

                    </div>

                    <div className="border-t border-neutral-100 pt-5">
                      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">
                        Ordered Products
                      </p>

                      <div className="space-y-3">
                        {order.orderItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 rounded-2xl border border-neutral-100 p-3 transition-all duration-300 hover:bg-neutral-50 hover:shadow-sm"
                          >
                            {/* Product Image */}
                            <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 sm:h-24 sm:w-20">
                              {item.product.images[0]?.url ? (
                                <img
                                  src={item.product.images[0].url}
                                  alt={item.product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <ShoppingBag size={18} className="text-neutral-300" />
                                </div>
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="min-w-0 flex-1">
                              {item.product.category?.name && (
                                <span className="mb-1 inline-flex rounded-full bg-neutral-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-neutral-500">
                                  {item.product.category.name}
                                </span>
                              )}

                              <h3 className="line-clamp-2 text-sm font-bold text-neutral-950 sm:text-base">
                                {item.product.name}
                              </h3>

                              <div className="mt-2 flex flex-wrap gap-2">
                                <span className="rounded-full border border-neutral-200 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                                  Size: {item.size || "N/A"}
                                </span>

                                <span className="rounded-full border border-neutral-200 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
                                  Qty: {item.quantity}
                                </span>
                              </div>
                            </div>

                            {/* Right Side */}
                            <div className="flex flex-col items-end gap-2">
                              <p className="text-sm font-black text-neutral-950">
                                ₹{item.product.price.toLocaleString("en-IN")}
                              </p>

                              <Link
                                href={`/product/${item.product.id}`}
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-900 hover:opacity-60"
                              >
                                View
                                <ArrowRight size={12} />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 px-6 pb-8 md:px-8">

                    <div className="grid gap-5 lg:grid-cols-[1fr_380px]">

                      {/* Shipping Address */}

                      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">

                        <div className="mb-4 flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-neutral-200">
                            <MapPin size={17} className="text-neutral-700" />
                          </div>

                          <h3 className="text-sm font-black tracking-wide text-neutral-900">
                            Shipping Address
                          </h3>

                        </div>

                        <div className="space-y-3 text-sm">

                          <div className="flex gap-3">
                            <span className="w-20 shrink-0 font-semibold text-neutral-500">
                              Name
                            </span>

                            <span className="font-medium text-neutral-900">
                              {order.customerName}
                            </span>
                          </div>

                          <div className="flex gap-3 items-start">
                            <span className="w-20 shrink-0 font-semibold text-neutral-500">
                              Address
                            </span>

                            <span className="leading-6 text-neutral-900">
                              {order.address}
                            </span>
                          </div>

                          <div className="flex gap-3">
                            <span className="w-20 shrink-0 font-semibold text-neutral-500">
                              City
                            </span>

                            <span className="text-neutral-900">
                              {order.city}
                            </span>
                          </div>

                          <div className="flex gap-3">
                            <span className="w-20 shrink-0 font-semibold text-neutral-500">
                              State
                            </span>

                            <span className="text-neutral-900">
                              {order.state}
                            </span>
                          </div>

                          <div className="flex gap-3">
                            <span className="w-20 shrink-0 font-semibold text-neutral-500">
                              PIN
                            </span>

                            <span className="text-neutral-900">
                              {order.pincode}
                            </span>
                          </div>

                          <div className="flex gap-3">
                            <span className="w-20 shrink-0 font-semibold text-neutral-500">
                              Phone
                            </span>

                            <span className="text-neutral-900">
                              {order.phone}
                            </span>
                          </div>

                        </div>

                      </div>

                      {/* Order Summary */}

                      <div className="rounded-2xl border border-neutral-200 bg-white p-5">

                        <h3 className="text-sm font-black tracking-wide text-neutral-900">
                          Order Summary
                        </h3>

                        <div className="mt-5 space-y-3">

                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">
                              Subtotal
                            </span>

                            <span className="font-semibold">
                              ₹{order.subtotal.toLocaleString("en-IN")}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">
                              Delivery Charges
                            </span>

                            <span className="font-semibold">
                              ₹{order.deliveryCharge.toLocaleString("en-IN")}
                            </span>
                          </div>

                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-500">
                              COD Charges
                            </span>

                            <span className="font-semibold">
                              ₹{order.codCharge.toLocaleString("en-IN")}
                            </span>
                          </div>

                          <div className="border-t border-dashed pt-4 flex items-center justify-between">

                            <span className="text-base font-bold">
                              Total
                            </span>

                            <span className="text-xl font-black">
                              ₹{order.total.toLocaleString("en-IN")}
                            </span>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                  <footer className="border-t border-neutral-200 bg-neutral-50 px-5 py-6 sm:px-7">

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                      {/* LEFT */}

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white">
                          {getStatusIcon(order.status)}
                        </div>

                        <div>

                          <p className="text-[11px] font-black uppercase tracking-[0.20em] text-neutral-400">
                            Current Status
                          </p>

                          <p className="mt-1 text-sm font-semibold text-neutral-900">
                            {status}
                          </p>

                        </div>

                      </div>

                      {/* MOBILE */}

                      <div className="grid w-full grid-cols-2 gap-2 xl:hidden">

                        {/* Track / Preparing */}

                        {order.status?.toUpperCase() === "CANCELLED" ? (

                          <Link
                            href="/shop"
                            className="inline-flex h-10 w-full items-center justify-center rounded-full bg-black px-2 text-[11px] font-semibold text-white"
                          >
                            <RotateCcw size={14} className="mr-1" />
                            Buy Again
                          </Link>

                        ) : order.isShipmentCreated ? (

                          <a
                            href={order.trackingUrl!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-full border border-sky-200 bg-sky-50 px-2 text-[11px] font-semibold text-sky-700 transition hover:bg-sky-100"
                          >
                            <Truck size={14} className="mr-1 shrink-0" />
                            Track Order
                          </a>

                        ) : (

                          <PreparingShipmentButton />

                        )}


                        {/* View */}

                        {firstProduct ? (

                          <Link
                            href={`/product/${firstProduct.id}`}
                            className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-full border border-neutral-300 bg-white px-2 text-[11px] font-semibold text-neutral-900 transition hover:bg-neutral-100"
                          >
                            <Eye size={14} className="mr-1 shrink-0" />
                            View Details
                          </Link>

                        ) : (

                          <div />

                        )}

                        {/* Cancel / Empty */}

                        {order.status?.toUpperCase() === "PENDING" ? (

                          <CancelOrderButton orderId={order.id} />

                        ) : (

                          <div />
                        )}

                        {/* Buy Again */}

                        {order.status?.toUpperCase() !== "CANCELLED" && (
                          <Link
                            href="/shop"
                            className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-full bg-black px-2 text-[11px] font-semibold text-white transition hover:bg-neutral-800"
                          >
                            <RotateCcw size={14} className="mr-1 shrink-0" />
                            Buy Again
                          </Link>
                        )}

                      </div>

                      {/* DESKTOP */}

                      <div className="hidden xl:flex items-center gap-3">

                        {order.status?.toUpperCase() === "CANCELLED" ? (

                          <Link
                            href="/shop"
                            className="inline-flex h-11 items-center justify-center rounded-full bg-black px-7 whitespace-nowrap text-sm font-bold text-white transition hover:bg-neutral-800"
                          >
                            <RotateCcw size={16} className="mr-2" />
                            Buy Again
                          </Link>

                        ) : order.isShipmentCreated ? (

                          <a
                            href={order.trackingUrl!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-11 items-center justify-center rounded-full border border-sky-200 bg-sky-50 px-7 whitespace-nowrap text-sm font-bold text-sky-700 transition hover:bg-sky-100"
                          >
                            <Truck size={16} className="mr-2" />
                            Track Order
                          </a>

                        ) : (

                          <PreparingShipmentButton />

                        )}
                        {firstProduct && (

                          <Link
                            href={`/product/${firstProduct.id}`}
                            className="inline-flex h-11 items-center justify-center rounded-full border border-neutral-300 bg-white px-7 whitespace-nowrap text-sm font-bold text-neutral-900 transition hover:bg-neutral-100"
                          >
                            <Eye size={16} className="mr-2" />
                            View Details
                          </Link>

                        )}

                        {order.status?.toUpperCase() === "PENDING" && (
                          <CancelOrderButton orderId={order.id} />
                        )}
                        {order.status?.toUpperCase() !== "CANCELLED" && (
                          <Link
                            href="/shop"
                            className="inline-flex h-11 items-center justify-center rounded-full bg-black px-7 whitespace-nowrap text-sm font-bold text-white transition hover:bg-neutral-800"
                          >
                            <RotateCcw size={16} className="mr-2" />
                            Buy Again
                          </Link>
                        )}

                      </div>

                    </div>

                  </footer>
                </article>
              )
            })}
          </div>
        )
        }
      </div >
    </main >
  )
}