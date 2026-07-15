import { db } from "@/lib/db"
import Link from "next/link"
import HomeProductCarousel from "@/components/HomeProductCarousel"
import NewsletterForm from "@/components/NewsletterForm"
import {
Truck,
ShieldCheck,
Leaf,
RefreshCcw
} from "lucide-react"

export const dynamic = "force-dynamic";

export default async function HomePage() {

  const [boysProducts, girlsProducts, newbornProducts] =
    await Promise.all([
      db.product.findMany({
        where: {
          gender: "Boy",
        },
        include: {
          category: true,
          images: true,
        },
        take: 4,
      }),

      db.product.findMany({
        where: {
          gender: "Girl",
        },
        include: {
          category: true,
          images: true,
        },
        take: 4,
      }),

      db.product.findMany({
        where: {
          ageGroup: "0-2Y",
        },
        include: {
          category: true,
          images: true,
        },
        take: 4,
      }),
    ])

  function ProductSection({
  title,
  href,
  products,
}: {
  title: string
  href: string
  products: any[]
}) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-5">

      <div
  className={`
    rounded-[28px]
    border
    border-gray-100
    shadow-sm
    p-5
    md:p-7

    ${
      title.includes("Top")
        ? "bg-gradient-to-r from-orange-50 to-amber-50"
        : title.includes("Boy")
        ? "bg-gradient-to-r from-sky-50 to-cyan-50"
        : title.includes("Girl")
        ? "bg-gradient-to-r from-pink-50 to-rose-50"
        : "bg-gradient-to-r from-green-50 to-emerald-50"
    }
  `}
>

        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-xl md:text-3xl font-black tracking-tight">
              {title}
            </h2>

            <p className="text-[11px] text-gray-500 mt-1 font-medium">
              Handpicked premium styles
            </p>
          </div>

          <Link
            href={href}
            className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider hover:gap-2 transition-all"
          >
            View All →
          </Link>

        </div>

        <HomeProductCarousel products={products} />

      </div>

    </section>
  )
}
  const [latestProducts, categories, banners, reviews] =
    await Promise.all([
      db.product.findMany({
        include: { category: true, images: true },
        take: 8,
        orderBy: { createdAt: "desc" }
      }),

      db.category.findMany({
        take: 4,
        orderBy: {
          createdAt: "desc"
        }
      }),

      db.banner.findMany({
        where: { active: true }
      }),

      db.review.findMany({
        take: 6,
        orderBy: { createdAt: "desc" }
      })
    ])

  const [products] = await Promise.all([
    db.product.findMany({
      where: {
        isNewArrival: true
      },
      include: {
        category: true,
        images: true
      },
      take: 8,
      orderBy: {
        createdAt: "desc"
      }
    }),
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
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-4 md:py-4">
        <div className="relative rounded-[32px] overflow-hidden h-[240px] sm:h-[320px] md:h-[550px] bg-gray-100 shadow-xl">
          <img src={heroBanner.imageUrl} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center text-white text-center p-6">
            <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-white/20">
              {heroBanner.label}
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-7xl font-black italic tracking-tighter uppercase leading-tight md:leading-none max-w-4xl drop-shadow-2xl">
              {heroBanner.title}
            </h1>
            <Link
              href="/shop"
              className="
    mt-5
    md:mt-10
    bg-white
    text-black
    px-5
    md:px-10
    py-2.5
    md:py-5
    rounded-full
    text-[10px]
    md:text-xs
    font-black
    uppercase
    tracking-[0.18em]
    hover:scale-105
    transition-all
    shadow-lg
  "
            >
              Explore Collection →
            </Link>
          </div>
        </div>
      </section>



      {/* ── TRUST FEATURES ── */}

<section className="max-w-7xl mx-auto px-4 py-6">

  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

    <div className="rounded-[28px] bg-gradient-to-br from-orange-50 to-amber-50 p-6 border border-orange-100">

      <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
        <Truck size={26}/>
      </div>

      <h3 className="mt-5 font-black text-lg">
        Free Delivery
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        On orders above ₹999
      </p>

    </div>

    <div className="rounded-[28px] bg-gradient-to-br from-sky-50 to-cyan-50 p-6 border border-sky-100">

      <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
        <ShieldCheck size={26}/>
      </div>

      <h3 className="mt-5 font-black text-lg">
        Safe Payments
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        100% Secure Checkout
      </p>

    </div>

    <div className="rounded-[28px] bg-gradient-to-br from-pink-50 to-rose-50 p-6 border border-pink-100">

      <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
      <Leaf size={26}/>
      </div>

      <h3 className="mt-5 font-black text-lg">
        Organic Cotton
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Soft & Skin Friendly
      </p>

    </div>

    <div className="rounded-[28px] bg-gradient-to-br from-emerald-50 to-green-50 p-6 border border-emerald-100">

      <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
        <RefreshCcw size={26}/>
      </div>

      <h3 className="mt-5 font-black text-lg">
        Easy Returns
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Hassle Free Exchange
      </p>

    </div>

  </div>

</section>

      {/* ── BROWSE BY CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-xl font-black italic tracking-tighter uppercase">Browse Categories</h2>
          <Link href="/shop" className="text-[9px] font-black border-b-2 border-black pb-1 tracking-widest">VIEW ALL</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/shop?category=${cat.name.toLowerCase()}`}>
              <div className="relative rounded-3xl overflow-hidden h-52 bg-gray-100 group">

                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100" />
                )}

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-500" />

                <div className="absolute bottom-4 left-4">
                  <span className="bg-white text-black text-[10px] font-black uppercase px-4 py-2 rounded-xl shadow-lg">
                    {cat.name}
                  </span>
                </div>

              </div>
            </Link>
          ))}
        </div>
      </section >

      {/* ── POPULAR PRODUCTS ── */}
      {/* ── NEW ARRIVALS ── */}
      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-2xl md:text-4xl font-black tracking-tight">
            New Arrivals
          </h2>

          <Link
            href="/shop"
            className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider hover:gap-2 transition-all"
          >
            View All
            <span>→</span>
          </Link>

        </div>

        <HomeProductCarousel products={products} />

      </section>

      <ProductSection
        title="Top Picks"
        href="/shop"
        products={latestProducts}
      />

      <ProductSection
        title="Boys Collection"
        href="/shop?gender=Boy"
        products={boysProducts}
      />

      <ProductSection
        title="Girls Collection"
        href="/shop?gender=Girl"
        products={girlsProducts}
      />

      <ProductSection
        title="Newborn Collection"
        href="/shop?ageGroup=0-2Y"
        products={newbornProducts}
      />

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


    </div >
  )
}