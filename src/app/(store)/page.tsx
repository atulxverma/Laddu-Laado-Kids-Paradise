import { db } from "@/lib/db"
import Link from "next/link"
import ProductCard from "@/components/ProductCard"
import NewsletterForm from "@/components/NewsletterForm"

export default async function HomePage() {
  // 1. Parallel Data Fetching
  const [products, categories, banners, reviews] = await Promise.all([
    db.product.findMany({ 
      include: { category: true, images: true }, 
      take: 8, 
      orderBy: { createdAt: "desc" } 
    }),
    db.category.findMany({ take: 4 }),
    db.banner.findMany({ where: { active: true } }),
    db.review.findMany({ take: 6, orderBy: { createdAt: "desc" } })
  ])

  // Fallback data agar DB khali ho
  const heroBanner = banners.find(b => b.type === "HERO") || {
    imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2148",
    title: "Summer Arrival of Outfit",
    label: "New Collection"
  }

  const promo1 = banners.find(b => b.type === "SIDE_1") || {
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=960",
    title: "Where dreams meet couture"
  }

  const promo2 = banners.find(b => b.type === "SIDE_2") || {
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=960",
    title: "Enchanting styles for girls"
  }

  return (
    <div className="bg-white">
      {/* ── DYNAMIC HERO ── */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="relative rounded-[2.5rem] overflow-hidden h-[400px] md:h-[550px] bg-gray-100 shadow-2xl">
          <img src={heroBanner.imageUrl} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white text-center p-6">
            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-white/20">
              {heroBanner.label}
            </span>
            <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none max-w-4xl drop-shadow-2xl">
              {heroBanner.title}
            </h1>
            <Link href="/shop" className="mt-10 bg-white text-black px-10 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
              Explore Collection →
            </Link>
          </div>
        </div>
      </section>

      {/* ── DYNAMIC PROMO BANNERS ── */}
      <section className="max-w-7xl mx-auto px-4 pb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative rounded-[2rem] overflow-hidden h-56 bg-[#EDE8DF] group">
          <img src={promo1.imageUrl} alt="Promo" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 p-10 flex flex-col justify-between items-start">
            <h3 className="text-2xl font-black italic tracking-tighter uppercase max-w-[200px] leading-none text-black">
              {promo1.title}
            </h3>
            <Link href="/shop" className="bg-black text-white text-[10px] font-black px-6 py-3 rounded-full uppercase tracking-widest hover:opacity-80 transition-all">
              Shop Now
            </Link>
          </div>
        </div>

        <div className="relative rounded-[2rem] overflow-hidden h-56 bg-[#EAE4DA] group">
          <img src={promo2.imageUrl} alt="Promo" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-80 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 p-10 flex flex-col justify-between items-start">
            <h3 className="text-2xl font-black italic tracking-tighter uppercase max-w-[200px] leading-none text-black">
              {promo2.title}
            </h3>
            <Link href="/shop" className="bg-black text-white text-[10px] font-black px-6 py-3 rounded-full uppercase tracking-widest hover:opacity-80 transition-all">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* ── BROWSE BY CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">Browse Categories</h2>
          <Link href="/shop" className="text-[10px] font-black border-b-2 border-black pb-1 tracking-widest">VIEW ALL</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/shop?category=${cat.name.toLowerCase()}`}>
              <div className="relative rounded-3xl overflow-hidden h-52 bg-gray-100 group">
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-all duration-500" />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-white text-black text-[10px] font-black uppercase px-4 py-2 rounded-xl shadow-lg">
                    {cat.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── POPULAR PRODUCTS ── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-10 text-center">New Drops</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── DYNAMIC REVIEWS SECTION ── */}
      <section className="max-w-7xl mx-auto px-4 py-24 bg-gray-50/50 rounded-[3rem] my-10">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">The Community</h2>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-[0.2em]">Verified stories from our customers</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {reviews.length > 0 ? (
            <div className="flex justify-center -space-x-4 mb-10">
              {reviews.map((r, i) => (
                <img key={i} src={r.userImage || "https://avatar.vercel.sh/user"} className="w-16 h-16 rounded-full border-4 border-white shadow-xl bg-gray-200 object-cover" alt="User" />
              ))}
              <div className="w-16 h-16 rounded-full border-4 border-white shadow-xl bg-black flex items-center justify-center text-white text-[10px] font-black">
                {reviews.length}+
              </div>
            </div>
          ) : (
            <p className="text-gray-300 italic font-medium">Join our growing community...</p>
          )}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <NewsletterForm />
      </section>
    </div>
  )
}