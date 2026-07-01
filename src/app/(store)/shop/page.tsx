import { db } from "@/lib/db"
import ProductCard from "@/components/ProductCard"
import { Search, SlidersHorizontal } from "lucide-react"
import Link from "next/link"

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; gender?: string; age?: string; sort?: string }>
}) {
  const { category, q, gender, age, sort } = await searchParams

  const products = await db.product.findMany({
    where: {
      ...(category && { category: { name: { equals: category, mode: "insensitive" } } }),
      ...(q && { name: { contains: q, mode: "insensitive" } }),
      ...(gender && { gender: { equals: gender, mode: "insensitive" } }),
      ...(age && { ageGroup: { equals: age, mode: "insensitive" } }),
    },
    orderBy: 
      sort === "price-asc" ? { price: "asc" } :
      sort === "price-desc" ? { price: "desc" } :
      { createdAt: "desc" },
    include: { category: true, images: true },
  })

  return (
    <main className="bg-white min-h-screen pb-20 pt-28">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* --- HEADER & SORTING --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-black">
  {gender === "Boy"
    ? "Boys Collection"
    : gender === "Girl"
    ? "Girls Collection"
    : gender === "Newborn"
    ? "Newborn Collection"
    : category
    ? category
    : "All Collections"}
</h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-4 flex items-center gap-2">
              <SlidersHorizontal size={12} /> {products.length} Premium Articles Found
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Sorting Links */}
            <div className="flex flex-wrap bg-gray-50 p-1 rounded-full border border-gray-100">
               <Link href={`/shop?sort=newest${gender ? `&gender=${gender}` : ''}`} className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${!sort || sort === 'newest' ? 'bg-black text-white' : 'text-gray-400'}`}>Newest</Link>
               <Link href={`/shop?sort=price-asc${gender ? `&gender=${gender}` : ''}`} className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${sort === 'price-asc' ? 'bg-black text-white' : 'text-gray-400'}`}>Price: Low</Link>
               <Link href={`/shop?sort=price-desc${gender ? `&gender=${gender}` : ''}`} className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${sort === 'price-desc' ? 'bg-black text-white' : 'text-gray-400'}`}>Price: High</Link>
            </div>
            
            {(category || gender || age || q) && (
              <Link href="/shop" className="text-[10px] font-black border-b-2 border-black pb-0.5 uppercase tracking-widest text-black">Clear</Link>
            )}
          </div>
        </div>
<div className="flex flex-wrap gap-3 mb-10">
  <Link
    href="/shop?gender=Newborn"
    className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
      gender === "Newborn"
        ? "bg-black text-white"
        : "bg-gray-100 text-gray-500"
    }`}
  >
    Newborn
  </Link>

  <Link
    href="/shop?gender=Boy"
    className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
      gender === "Boy"
        ? "bg-black text-white"
        : "bg-gray-100 text-gray-500"
    }`}
  >
    Boys
  </Link>

  <Link
    href="/shop?gender=Girl"
    className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
      gender === "Girl"
        ? "bg-black text-white"
        : "bg-gray-100 text-gray-500"
    }`}
  >
    Girls
  </Link>
</div>
        {/* --- PRODUCT GRID --- */}
        {products.length === 0 ? (
          <div className="py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <Search size={40} className="mx-auto text-gray-200 mb-4" />
            <h2 className="text-xl font-black uppercase text-gray-400">No Collection Matches</h2>
            <Link href="/shop" className="mt-4 inline-block text-[10px] font-black border-b-2 border-black pb-1 uppercase tracking-widest">Back to Store</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </main>
  )
}