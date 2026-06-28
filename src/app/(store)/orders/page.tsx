import { db } from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle } from "lucide-react"

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"

export default async function MyOrdersPage() {
  const user = await currentUser()
  if (!user) redirect("/sign-in")       

  const orders = await db.order.findMany({
    where: { clerkId: user.id },
    include: {
      orderItems: {
        include: { product: { include: { images: true } } }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  // Change both helper functions:

  const getStatusIcon = (status?: string | null) => {
    const s = (status ?? "Pending").toUpperCase()
    switch (s) {
      case 'DELIVERED': return <CheckCircle2 size={14} className="text-emerald-500" />
      case 'SHIPPED': return <Truck size={14} className="text-blue-500" />
      case 'CANCELLED': return <XCircle size={14} className="text-rose-500" />
      default: return <Clock size={14} className="text-amber-500" />
    }
  }

  const getStatusBg = (status?: string | null) => {
    const s = (status ?? "Pending").toUpperCase()
    switch (s) {
      case 'DELIVERED': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'SHIPPED': return 'bg-blue-50 text-blue-700 border-blue-100'
      case 'CANCELLED': return 'bg-rose-50 text-rose-700 border-rose-100'
      default: return 'bg-amber-50 text-amber-700 border-amber-100'
    }
  }

  return (
    <main className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-baseline gap-4 mb-10">
          <h1 className="text-4xl font-black italic tracking-tighter">MY ORDERS</h1>
          <span className="text-gray-300 font-bold text-lg">{orders.length}</span>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-gray-100 rounded-[3rem] bg-gray-50/30">
            <Package size={60} className="mx-auto text-gray-200 mb-6" />
            <h2 className="text-xl font-bold text-black">No orders found</h2>
            <p className="text-gray-400 text-sm mt-2">Looks like you haven&apos;t treated yourself yet.</p>
            <Link href="/shop" className="inline-block mt-8 bg-black text-white px-10 py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="group border border-gray-100 rounded-[2.5rem] overflow-hidden bg-white hover:shadow-2xl hover:shadow-gray-100 transition-all duration-700">
                {/* Header */}
                <div className="bg-gray-50/50 px-8 py-6 flex flex-wrap justify-between items-center gap-6 border-b border-gray-100">
                  <div className="flex gap-10">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Order Date</p>
                      <p className="text-sm font-bold text-black">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Amount Paid</p>
                      <p className="text-sm font-black text-black tracking-tight">₹{order.total.toLocaleString("en-IN")}</p>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusBg(order.status)} shadow-sm`}>
                    {getStatusIcon(order.status)}
                    {order.status ?? "Pending"}
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-8 group/item">
                      <div className="h-28 w-24 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shrink-0 shadow-sm group-hover/item:scale-105 transition-transform duration-500">
                        <img src={item.product.images[0]?.url} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{item.product.category?.name}</span>
                        </div>
                        <h4 className="font-bold text-black text-lg truncate mb-1">{item.product.name}</h4>

                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Size: {item.size || 'N/A'} <span className="mx-2">·</span> Qty: {item.quantity}
                        </p>

                        <div className="flex items-center justify-between mt-4">
                          <p className="font-black text-black">₹{item.product.price.toLocaleString("en-IN")}</p>
                          <Link href={`/product/${item.product.id}`} className="text-[10px] font-black uppercase border-b-2 border-black pb-0.5 hover:opacity-50 transition-opacity">View Item</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer / Address */}
                <div className="px-8 py-4 bg-gray-50/30 border-t border-gray-50 text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <Truck size={10} /> Shipping to: <span className="text-gray-600 truncate">{order.address}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
