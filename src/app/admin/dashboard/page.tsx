import { db } from "@/lib/db"
import { 
  TrendingUp, 
  ShoppingBag, 
  AlertTriangle, 
  PackageCheck, 
  ArrowRight, 
  Activity 
} from "lucide-react"
import Link from "next/link"
import SalesChart from "@/components/admin/SalesChart"

export default async function DashboardPage() {
  // 1. Parallel Data Fetching (Fastest way to get multiple things)
  const [lowStockProducts, recentOrders, totalProducts, pendingOrdersCount, revenueData] = await Promise.all([
    db.product.findMany({ where: { stock: { lte: 5 } }, take: 5 }),
    db.order.findMany({
      include: { orderItems: { include: { product: { include: { images: true } } } } },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    db.product.count(),
    db.order.count({ where: { status: "Pending" } }),
    db.order.aggregate({
      _sum: { total: true },
      where: { isPaid: true }
    })
  ])

  const totalRevenue = revenueData._sum.total || 0

  // 2. Prepare Chart Data (Grouping by Date)
  const allPaidOrders = await db.order.findMany({
    where: { 
        isPaid: true,
        createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } // Last 7 days only
    },
    orderBy: { createdAt: "asc" }
  })

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  }).reverse()

  const chartData = last7Days.map(date => {
    const dayTotal = allPaidOrders
      .filter(o => o.createdAt.toISOString().split('T')[0] === date)
      .reduce((sum, o) => sum + o.total, 0)
    
    return {
      name: new Date(date).toLocaleDateString('en-IN', { weekday: 'short' }),
      total: dayTotal
    }
  })

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50", desc: "Lifetime income" },
    { label: "Pending Orders", value: pendingOrdersCount.toString(), icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50", desc: "Wait for dispatch" },
    { label: "Inventory", value: totalProducts.toString(), icon: PackageCheck, color: "text-purple-600", bg: "bg-purple-50", desc: "Active listings" },
    { label: "Low Stock", value: lowStockProducts.length.toString(), icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50", desc: "Immediate action" }
  ]

  return (
    <div className="p-6 md:p-10 space-y-10 bg-[#fafafa] min-h-screen">
      {/* --- HEADER --- */}
      <div className="pt-8 md:pt-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none text-black">Insights</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <Activity size={12} className="text-emerald-500" /> Real-time Store Performance
          </p>
        </div>
        <div className="flex gap-2">
           <Link href="/admin/products" className="bg-white border border-gray-200 text-black px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all">Add Product</Link>
           <Link href="/" className="bg-black text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all">View Store</Link>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500">
            <div className={`${s.bg} w-fit p-3 rounded-2xl mb-6`}><s.icon size={20} className={s.color} /></div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
            <h3 className="text-3xl font-black tracking-tighter text-black">{s.value}</h3>
            <p className="text-[9px] text-gray-300 font-bold uppercase mt-4 italic">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* --- RECHARTS ANALYTICS --- */}
      <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
           <TrendingUp size={150} strokeWidth={4} />
        </div>
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h2 className="text-xl font-black italic uppercase tracking-tighter">Revenue Flow</h2>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Growth analysis over the last week</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
            <TrendingUp size={14} /> Performance: Stable
          </div>
        </div>
        <SalesChart data={chartData} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        
        {/* --- RECENT SALES --- */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-black italic">Recent Sales</h2>
            <Link href="/admin/orders" className="p-2 hover:bg-white rounded-full transition-all group">
               <ArrowRight size={16} className="text-gray-300 group-hover:text-black" />
            </Link>
          </div>
          <div className="flex-1">
            {recentOrders.length === 0 ? (
              <p className="p-20 text-center text-xs text-gray-300 font-bold uppercase">No sales yet</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="p-6 border-b border-gray-50 last:border-0 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-10 bg-gray-100 rounded-xl overflow-hidden shadow-sm shrink-0 border border-gray-200">
                      <img src={order.orderItems[0]?.product?.images[0]?.url} className="h-full w-full object-cover" alt="" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-black">#{order.id.slice(-6).toUpperCase()}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">
                        {order.phone} · {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-black tracking-tight">₹{order.total.toLocaleString()}</p>
                    <span className="text-[8px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">PAID</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- LOW STOCK ALERTS --- */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm flex flex-col overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-rose-50/20">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-rose-600 italic">Inventory Critical</h2>
            <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="flex-1 p-4 space-y-3">
            {lowStockProducts.length === 0 ? (
              <div className="p-16 text-center">
                 <PackageCheck size={40} className="mx-auto text-emerald-100 mb-4" />
                 <p className="text-xs text-gray-300 font-black uppercase">Stock levels perfect</p>
              </div>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p.id} className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl flex items-center justify-between group hover:bg-white hover:border-rose-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-9 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                      <img src={p.images[0]?.url} className="h-full w-full object-cover" alt="" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-black uppercase truncate max-w-[140px]">{p.name}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Stock: {p.stock}</p>
                    </div>
                  </div>
                  <Link href="/admin/products" className="opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest">
                    Manage
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}