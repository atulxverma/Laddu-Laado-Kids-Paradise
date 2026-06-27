import { db } from "@/lib/db"
import { Mail } from "lucide-react"

export default async function SubscribersPage() {
  const subs = await db.newsletter.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <div className="p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-10 text-black">Email Subscribers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subs.map((s) => (
          <div key={s.id} className="flex items-center gap-4 p-5 border border-gray-100 rounded-2xl bg-gray-50/50">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm"><Mail size={16} /></div>
            <div>
              <p className="text-sm font-bold text-black">{s.email}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">{new Date(s.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}