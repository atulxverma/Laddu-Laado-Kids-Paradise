import { db } from "@/lib/db"
import OrderStatusButton from "./OrderStatusButton"
import { Package, Smartphone, MapPin } from "lucide-react"

export default async function OrdersPage() {
  const orders = await db.order.findMany({
    include: { orderItems: { include: { product: true } } },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="p-6 md:p-10 space-y-10 bg-[#fafafa] min-h-screen">
      <div className="pt-8 md:pt-0">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">Order Management</h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Processing {orders.length} total shipments</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
            {/* Header */}
            <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4 bg-gray-50/30">
              <div className="flex gap-8">
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                  <p className="text-xs font-bold font-mono uppercase">#{order.id.slice(-8)}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Revenue</p>
                  <p className="text-xs font-black">₹{order.total.toLocaleString()}</p>
                </div>
              </div>
              {/* Button to change status */}
              <OrderStatusButton orderId={order.id} currentStatus={order.status} />
            </div>

            {/* Content */}
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
               <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Customer Details</p>
                  <div className="space-y-2">
                    <p className="flex items-center gap-2 text-sm font-bold text-black"><Smartphone size={14} className="text-gray-400" /> {order.phone}</p>
                    <p className="flex items-start gap-2 text-sm text-gray-500 font-medium leading-relaxed"><MapPin size={14} className="text-gray-400 mt-1 shrink-0" /> {order.address}</p>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Line Items</p>
                  <div className="space-y-3">
                    {order.orderItems.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <img src={item.product.images[0]?.url} className="h-10 w-8 object-cover rounded-md" alt="" />
                        <div>
                          <p className="text-[11px] font-bold text-black uppercase">{item.product.name}</p>
                          <p className="text-[9px] text-gray-400 font-black uppercase">Size: {item.size} · Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}