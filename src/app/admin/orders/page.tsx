import { db } from "@/lib/db"
import OrderStatusButton from "./OrderStatusButton"
import { Smartphone, MapPin } from "lucide-react"

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function OrdersPage() {
  let orders = [];

  try {
    orders = await db.order.findMany({
      include: {
        orderItems: {
          include: {
            product: { include: { images: {
  orderBy: {
    createdAt: "asc",
  },
} } }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    }) || [];
  } catch (error) {
    console.error("Prisma compilation safety caught error during build time deployment evaluation: ", error);
    orders = [];
  }

  return (
    <div className="p-6 md:p-10 space-y-10 bg-neutral-50 min-h-screen">
      <div className="pt-8 md:pt-0">
        <h1 className="text-3xl font-black tracking-tighter uppercase">Order Management</h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
          Processing {orders?.length || 0} total shipments
        </p>
      </div>

      <div className="space-y-6">
        {orders?.map((order) => (
          <div key={order.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
            <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4 bg-gray-50/30">
              <div className="flex flex-wrap gap-8">

                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Revenue
                  </p>

                  <p className="text-xs font-black">
                    ₹{order.total.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Payment
                  </p>

                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${order.paymentMethod === "ONLINE"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-orange-100 text-orange-700"
                      }`}
                  >
                    {order.paymentMethod}
                  </span>
                </div>

                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Status
                  </p>

                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${order.isPaid
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {order.isPaid ? "PAID" : "UNPAID"}
                  </span>
                </div>

                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Date
                  </p>

                  <p className="text-xs font-bold">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

              </div>
              <OrderStatusButton orderId={order.id} currentStatus={order.status} />
            </div>

            <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Customer Details</p>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-black">
                    {order.customerName || "Guest User"}
                  </p>
                  <p className="flex items-center gap-2 text-sm font-bold text-black">
                    <Smartphone size={14} className="text-gray-400" /> {order?.phone || "N/A"}
                  </p>
                  <p className="flex items-start gap-2 text-sm text-gray-500 font-medium leading-relaxed">
                    <MapPin size={14} className="text-gray-400 mt-1 shrink-0" /> {order?.address || "No Address"}
                  </p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-neutral-200 p-4">

                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  Order Summary
                </p>

                <div className="mt-3 space-y-2 text-sm">

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

                  <div className="border-t pt-2 flex justify-between font-black">

                    <span>Total</span>

                    <span>

                      ₹{order.total}

                    </span>

                  </div>

                </div>

              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Line Items</p>
                <div className="space-y-3">

                  {order?.orderItems?.length ? (

                    order.orderItems.map((item) => (

                      <div
                        key={item.id}
                        className="flex items-center gap-3 bg-neutral-50 p-3 rounded-2xl border border-neutral-100 transition hover:bg-white"
                      >

                        <div className="h-10 w-8 rounded-lg overflow-hidden bg-gray-200 shrink-0">

                          <img
                            src={
                              item?.product?.images?.[0]?.url ||
                              "/placeholder.png"
                            }
                            className="h-full w-full object-cover"
                            alt={item?.product?.name || "Product"}
                          />

                        </div>

                        <div>
                          <p className="text-[11px] font-bold text-black uppercase">
                            {item?.product?.name || "Product"}
                          </p>

                          <p className="text-[9px] text-gray-400 font-black uppercase">
                            Size: {item?.size || "N/A"} · Qty: {item?.quantity || 0}
                          </p>
                        </div>

                      </div>

                    ))

                  ) : (

                    <p className="text-xs text-gray-400">
                      No products found in this order
                    </p>

                  )}

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}