import { db } from "@/lib/db"
import Link from "next/link"
import HomeProductCarousel from "@/components/HomeProductCarousel"
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

  console.log(banners)
console.log(promo1)
console.log(promo2)
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

            <p className="text-[10px] text-gray-500 mt-1 font-medium">
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
        take: 3,
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
  const heroBanner =
  banners.find(
    (b) => b.type === "HERO" && b.active
  ) || {
    imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2148",
    title: "Summer Arrival of Outfit",
    label: "New Collection"
  }

  const promo1 = banners.find(
  (b) => b.type === "SIDE_1" && b.active
)

const promo2 = banners.find(
  (b) => b.type === "SIDE_2" && b.active
)



  return (
    <div className="bg-white">
      {/* ── PREMIUM HERO ── */}

<section className="max-w-7xl mx-auto px-3 md:px-4 pt-3 pb-5">

  <div className="relative overflow-hidden rounded-[28px] md:rounded-[42px] h-[240px] sm:h-[320px] md:h-[560px] bg-neutral-100 shadow-xl">

    <img
      src={heroBanner.imageUrl}
      alt="Hero"
      className="absolute inset-0 h-full w-full object-cover"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

    <div className="absolute inset-0 flex flex-col justify-end items-start p-5 md:p-12">

      <span
        className="
        mb-3
        rounded-full
        bg-white/20
        backdrop-blur-md
        border
        border-white/20
        px-3
        py-1
        text-[9px]
        md:text-[10px]
        font-black
        uppercase
        tracking-[0.25em]
        text-white
      "
      >
        {heroBanner.label}
      </span>

      <h1
  className="
  max-w-[95%]
  text-[22px]
  sm:text-[26px]
  md:text-6xl
  leading-tight
  font-black
  italic
  uppercase
  tracking-tight
  text-white
  "
>
  {heroBanner.title}
</h1>

      <p
        className="
        mt-3
        max-w-xs
        text-[12px]
        md:text-base
        text-white/80
      "
      >
        Discover premium fashion crafted for your little stars.
      </p>

      <Link
        href="/shop"
        className="
mt-5
inline-flex
items-center
gap-2
rounded-full
bg-white
px-5
md:px-8
py-3
md:py-4
text-[10px]
md:text-xs
font-black
uppercase
tracking-[0.18em]
text-black
transition-all
hover:scale-105
"
      >
        Explore Collection →
      </Link>

    </div>

  </div>

</section>
<section className="max-w-7xl mx-auto px-4 pb-6">

  <div className="grid gap-5 md:grid-cols-2">

    {promo1 && (
  <div className="group relative h-64 overflow-hidden rounded-3xl">

    <img
      src={promo1.imageUrl}
      alt={promo1.title}
      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
    />

    <div className="absolute inset-0 bg-black/30" />

    <div className="absolute bottom-6 left-6">
      <h3 className="text-2xl font-black text-white">
        {promo1.title}
      </h3>

      <Link
        href="/shop"
        className="mt-4 inline-flex rounded-full bg-white px-5 py-2 text-[10px] font-black uppercase tracking-widest text-black"
      >
        Shop Now →
      </Link>
    </div>

  </div>
)}

    {promo2 && (
  <div className="group relative h-64 overflow-hidden rounded-3xl">

    <img
      src={promo2.imageUrl}
      alt={promo2.title}
      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
    />

    <div className="absolute inset-0 bg-black/30" />

    <div className="absolute bottom-6 left-6">
      <h3 className="text-2xl font-black text-white">
        {promo2.title}
      </h3>

      <Link
        href="/shop"
        className="mt-4 inline-flex rounded-full bg-white px-5 py-2 text-[10px] font-black uppercase tracking-widest text-black"
      >
        Shop Now →
      </Link>
    </div>

  </div>
)}

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

      {/* ───────────── LOVED BY PARENTS ───────────── */}

<section className="max-w-7xl mx-auto px-4 py-16 md:py-24">

  <div className="text-center mb-12">

    <span className="inline-flex items-center rounded-full bg-pink-50 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-pink-600">
      Loved by Parents ❤️
    </span>

    <h2 className="mt-5 text-2xl md:text-5xl font-black tracking-tight">
      Trusted by Thousands of Families
    </h2>

    <p className="mt-4 max-w-2xl mx-auto text-[12px] md:text-base text-neutral-500 leading-6 md:leading-7">
      Soft fabrics, premium quality and adorable designs that parents absolutely love.
    </p>

  </div>

  {/* Stats */}

  <div className="grid grid-cols-3 gap-3 md:gap-6 mb-12">

    <div className="rounded-3xl border border-neutral-200 bg-white p-3 md:p-5 text-center shadow-sm">

      <h3 className="text-lg md:text-4xl md:text-4xl font-black">
        4.9★
      </h3>

      <p className="mt-2 text-[9px] uppercase tracking-widest text-neutral-500">
        Average Rating
      </p>

    </div>

    <div className="rounded-3xl border border-neutral-200 bg-white p-3 md:p-5 text-center shadow-sm">

      <h3 className="text-lg md:text-4xl md:text-4xl font-black">
        5K+
      </h3>

      <p className="mt-2 text-[9px] uppercase tracking-widest text-neutral-500">
        Happy Parents
      </p>

    </div>

    <div className="rounded-3xl border border-neutral-200 bg-white p-3 md:p-5 text-center shadow-sm">

      <h3 className="text-lg md:text-4xl md:text-4xl font-black">
        98%
      </h3>

      <p className="mt-2 text-[9px] uppercase tracking-widest text-neutral-500">
        Repeat Orders
      </p>

    </div>

  </div>

  {/* Reviews */}

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    {reviews.slice(0, 3).map((review) => (

      <div
        key={review.id}
        className="rounded-[30px] border border-neutral-200 bg-white p-4 md:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >

        <div className="flex items-center gap-4">

          <img
            src={review.userImage || "https://ui-avatars.com/api/?background=random&name=Parent"}
            alt={review.userName}
            className="h-11 w-11 md:h-14 md:w-14 rounded-full object-cover border"
          />

          <div>

            <h4 className="font-black">
              {review.userName}
            </h4>

            <p className="text-yellow-500 text-sm">
              {Array.from({ length: review.rating }).map((_, i) => (
  <span key={i}>★</span>
))}
            </p>

          </div>

        </div>

        <p className="mt-5 text-[12px] md:text-[15px] leading-6 md:leading-7 text-neutral-600 line-clamp-4">

          {review.comment.length > 120
  ? review.comment.slice(0, 120) + "..."
  : review.comment}

        </p>

      </div>

    ))}

  </div>

</section>
<div className="mt-12 text-center">
  <Link
    href="/shop"
    className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-[10px] md:text-sm font-black uppercase tracking-wider text-white hover:scale-105 transition-all"
  >
    Shop Collection →
  </Link>
</div>

    </div >
  )
}