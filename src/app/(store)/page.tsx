import { db } from "@/lib/db"
import Link from "next/link"
import ProductCard from "@/components/ProductCard"

export default async function HomePage() {
  const products = await db.product.findMany({
    include: { category: true, images: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  })

  const categories = await db.category.findMany({ take: 4 })

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="relative rounded-2xl overflow-hidden h-[380px] md:h-[500px] bg-gray-100">
          <img
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2148"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/25 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-2xl">
              Summer Arrival of Outfit
            </h1>
            <p className="mt-3 text-sm text-white/80 max-w-sm">
              Discover quality fashion that reflects your style and makes everyday enjoyable.
            </p>
            <Link
              href="/shop"
              className="mt-6 inline-flex items-center gap-3 bg-white text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all group"
            >
              Explore Product
              <span className="h-6 w-6 bg-black text-white rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* PROMO BANNERS */}
      <section className="max-w-7xl mx-auto px-4 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative rounded-2xl overflow-hidden h-48 bg-[#EDE8DF]">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=960"
            alt="Promo 1"
            className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-80"
          />
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <h3 className="text-xl font-bold max-w-[55%] leading-tight">
              Where dreams meet couture
            </h3>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white text-black text-xs font-bold px-4 py-2 rounded-full w-fit hover:bg-black hover:text-white transition-all"
            >
              Shop Now
            </Link>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden h-48 bg-[#EAE4DA]">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=960"
            alt="Promo 2"
            className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-80"
          />
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <h3 className="text-xl font-bold max-w-[55%] leading-tight">
              Enchanting styles for every women
            </h3>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-white text-black text-xs font-bold px-4 py-2 rounded-full w-fit hover:bg-black hover:text-white transition-all"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* BROWSE BY CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Browse by categories</h2>
        </div>
        {categories.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-12 border-2 border-dashed border-gray-100 rounded-2xl">
            No categories yet. Add from admin panel.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/shop?category=${cat.name.toLowerCase()}`}>
                <div className="relative rounded-xl overflow-hidden h-44 bg-gray-100 group cursor-pointer">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-all duration-300" />
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-white text-black text-[10px] font-bold uppercase px-3 py-1 rounded-full">
                      {cat.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* POPULAR PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Popular products</h2>
        </div>
        {products.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-12 border-2 border-dashed border-gray-100 rounded-2xl">
            No products yet. Add from admin panel.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-xl font-bold mb-4">
          Over 350+ Customer reviews from our client
        </h2>
        <div className="flex gap-3 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-14 w-14 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-md"
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&fit=crop&crop=face"
                alt="reviewer"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-[#6B7A5E] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white font-bold text-lg max-w-xs">
            Stay up to date about our offers
          </p>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <div className="flex items-center gap-3 bg-white rounded-full px-4 py-3">
              <span className="text-gray-400 text-xs">✉</span>
              <input
                placeholder="Enter your email here"
                className="text-xs outline-none flex-1 text-gray-600 placeholder:text-gray-400 bg-transparent"
              />
            </div>
            <button className="bg-white text-black text-xs font-bold py-3 rounded-full hover:bg-black hover:text-white transition-all">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}