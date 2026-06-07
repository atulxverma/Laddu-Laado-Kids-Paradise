import { db } from "@/lib/db"
import { TrendingUp, ShoppingCart, Package, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const [productCount, orderCount, orders] = await Promise.all([
    db.product.count(),
    db.order.count(),
    db.order.findMany({
      include: {
        orderItems: {
          include: { product: { include: { images: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ])

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)

  const stats = [
    {
      name: "Revenue",
      value: `₹${(totalRevenue / 1000).toFixed(1)}K`,
      icon: TrendingUp,
      trend: "Live",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      name: "Orders",
      value: orderCount.toString(),
      icon: ShoppingCart,
      trend: "Total",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      name: "Products",
      value: productCount.toString(),
      icon: Package,
      trend: "Active",
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      name: "Users",
      value: "—",
      icon: Users,
      trend: "Clerk",
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ]

  const statusColor: Record<string, string> = {
    Pending: "text-amber-500",
    Confirmed: "text-blue-500",
    Shipped: "text-purple-500",
    Delivered: "text-emerald-500",
    Cancelled: "text-red-500",
  }

  return (
    <div className="p-6 md:p-10 space-y-8 bg-white min-h-screen">
      {/* Header */}
      <div className="pt-8 md:pt-0">
        <h1 className="text-3xl md:text-4xl font-bold text-black tracking-tight">
          Overview
        </h1>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-medium">
          Real-time dashboard
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="border border-gray-100 rounded-2xl p-5 hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-5">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon size={18} className={stat.color} />
              </div>
              <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full uppercase">
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {stat.name}
            </p>
            <p className="text-3xl font-black text-black mt-1 tracking-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-black">Recent Orders</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
              Latest {orders.length} orders
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 text-xs font-bold text-black hover:opacity-60 transition-opacity"
          >
            View All <ArrowRight size={13} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">
            No orders yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-9 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                    {order.orderItems[0]?.product.images[0]?.url && (
                      <img
                        src={order.orderItems[0].product.images[0].url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-black truncate max-w-[160px]">
                      {order.orderItems[0]?.product.name ?? "Order"}
                      {order.orderItems.length > 1 &&
                        ` +${order.orderItems.length - 1} more`}
                    </p>
                    <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-black">
                    ₹{order.total.toLocaleString("en-IN")}
                  </p>
                  <p className={`text-[10px] font-bold uppercase mt-0.5 ${statusColor[order.status] ?? "text-gray-400"}`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Manage Products", href: "/admin/products", desc: `${productCount} products` },
          { label: "View Orders", href: "/admin/orders", desc: `${orderCount} total orders` },
          { label: "Categories", href: "/admin/categories", desc: "Manage categories" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="border border-gray-100 rounded-2xl p-5 hover:border-gray-300 hover:shadow-sm transition-all group"
          >
            <p className="font-bold text-sm text-black group-hover:opacity-70 transition-opacity">
              {item.label}
            </p>
            <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
            <ArrowRight size={14} className="mt-3 text-gray-300 group-hover:text-black transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  )
}