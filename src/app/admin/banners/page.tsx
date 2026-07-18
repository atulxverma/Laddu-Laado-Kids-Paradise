import { db } from "@/lib/db"
import BannerForm from "./BannerForm"

export default async function BannersPage() {
  const banners = await db.banner.findMany()

  return (
    <div className="p-6 md:p-10 space-y-10 bg-neutral-50 min-h-screen">
      <div className="pt-8 md:pt-0">
        <h1 className="text-3xl font-black tracking-tighter uppercase">Store Banners</h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Manage homepage visuals</p>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        {/* HERO BANNER SECTION */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
            <h2 className="text-sm font-black uppercase tracking-widest text-emerald-500 mb-6 ">Main Hero Banner</h2>
            <BannerForm 
              type="HERO" 
              initialData={banners.find(b => b.type === "HERO")} 
            />
          </div>
        </div>

        {/* SIDE BANNERS */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
            <h2 className="text-sm font-black uppercase tracking-widest text-blue-500 mb-6 ">Promo Card 1 (Left)</h2>
            <BannerForm 
              type="SIDE_1" 
              initialData={banners.find(b => b.type === "SIDE_1")} 
            />
          </div>
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
            <h2 className="text-sm font-black uppercase tracking-widest text-purple-500 mb-6 ">Promo Card 2 (Right)</h2>
            <BannerForm 
              type="SIDE_2" 
              initialData={banners.find(b => b.type === "SIDE_2")} 
            />
          </div>
        </div>
      </div>
    </div>
  )
}