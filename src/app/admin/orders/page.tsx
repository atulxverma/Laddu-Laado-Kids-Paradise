import { db } from "@/lib/db"
import OrderStatusButton from "./OrderStatusButton"
import { ShoppingBag } from "lucide-react"

const statusConfig: Record<string, { color: string; dot: string; bg: string }> = {
  PENDING:   { color: "text-amber-600",  dot: "bg-amber-400",  bg: "bg-amber-50"  },
  CONFIRMED: { color: "text-blue-600",   dot: "bg-blue-400",   bg: "bg-blue-50"   },
  DELIVERED: { color: "text-emerald-600",dot: "bg-emerald-400",bg: "bg-emerald-50" },
  CANCELLED: { color: "text-red-500",    dot: "bg-red-400",    bg: "bg-red-50"    },
}

export default async function OrdersPage() {
  const orders = await db.order.findMany({
    include: {
      orderItems: {
        include: { product: { include: { images: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-6 md:p-10 bg-[#fafafa] min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6 pt-8 md:pt-0">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight">Orders</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-medium">
            {orders.length} orders received
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 py-24 text-center bg-white">
            <ShoppingBag size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const s = statusConfig[order.status] ?? statusConfig.PENDING
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  {/* Top Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                    <div className="flex flex-wrap items-center gap-5">
                      {/* Order ID */}
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Order</p>
                        <p className="font-mono font-black text-sm text-black mt-0.5">
                          #{order.id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      {/* Date */}
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Date</p>
                        <p className="text-sm font-medium text-black mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                      </div>
                      {/* Total */}
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Total</p>
                        <p className="font-black text-sm text-black mt-0.5">
                          ₹{order.total.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <OrderStatusButton
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </div>

                  {/* Customer Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-5 py-3 border-t border-gray-50 bg-gray-50/50">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 w-14">Phone</span>
                      <span className="text-sm font-semibold text-black">{order.phone || "—"}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 w-14 pt-0.5">Address</span>
                      <span className="text-sm font-semibold text-black">{order.address || "—"}</span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="px-5 py-4 border-t border-gray-50 flex flex-wrap gap-2">
                    {order.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 hover:bg-gray-100 transition-colors"
                      >
                        <div className="h-10 w-9 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                          {item.product.images[0]?.url && (
                            <img
                              src={item.product.images[0].url}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-black leading-tight">
                            {item.product.name}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            Qty {item.quantity} · ₹{item.product.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}