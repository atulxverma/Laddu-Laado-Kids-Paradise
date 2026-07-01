import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import ProductGallery from "@/components/ProductGallery"
import AddToCartButton from "@/components/AddToCartButton"
import ProductCard from "@/components/ProductCard"
import ReviewForm from "@/components/ReviewForm"
import Link from "next/link"
import { ChevronLeft, Clock, Package, Tag, Calendar, Star, ShieldCheck } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params

  // 1. Fetch Product with Reviews
  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      images: true,
      reviews: { orderBy: { createdAt: "desc" } }
    },
  })

  if (!product) notFound()

  // 2. Fetch Related
  const related = await db.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id } },
    include: { category: true, images: true },
    take: 4,
  })

  // 3. Dynamic Stats Logic
  const reviews = product.reviews || []
  const totalReviews = reviews.length
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0"

  // 4. Dynamic Delivery Logic (Today + 3 to 5 days)
  const deliveryStart = new Date();
  deliveryStart.setDate(deliveryStart.getDate() + 3);
  const deliveryEnd = new Date();
  deliveryEnd.setDate(deliveryEnd.getDate() + 5);
  const deliveryStr = `${deliveryStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${deliveryEnd.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;

  return (
    <main className="bg-white pb-16 pt-2 md:pt-4">
      <div className="max-w-7xl mx-auto px-4 pt-2 md:pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 py-2 md:py-4">
          <Link href="/" className="hover:text-black flex items-center gap-1 transition-colors">
            <ChevronLeft size={12} /> Home
          </Link>
          <span className="opacity-30">/</span>
          <span>{product.category?.name}</span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5 lg:gap-12">
          <div className="lg:sticky lg:top-24 h-fit">
   <ProductGallery images={product.images} />
</div>

          <div className="flex flex-col gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase bg-gray-100 px-3 py-1 rounded-full text-gray-500 tracking-widest">
                  {product.category?.name}
                </span>
                <span className="text-[10px] font-black uppercase text-emerald-500">In Stock</span>
              </div>

              <h1 className="text-xl md:text-4xl font-black italic tracking-tighter uppercase leading-[0.9]">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <p className="text-3xl md:text-4xl font-black tracking-tighter">₹{product.price.toLocaleString("en-IN")}</p>
                <div className="h-8 w-[1px] bg-gray-100" />
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={12} className={s <= Math.round(Number(avgRating)) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                    ))}
                  </div>
                  <span className="text-[10px] font-black text-gray-400 uppercase">{avgRating} ({totalReviews} Reviews)</span>
                </div>
              </div>
            </div>

            {/* Premium Delivery Widget */}
            <div className="bg-black text-white p-4 md:p-6 rounded-3xl flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 md:h-10 md:w-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Express Shipping</p>
                  <p className="text-sm font-bold tracking-tight">Arrives by {deliveryStr}</p>
                </div>
              </div>
              <ShieldCheck size={24} className="text-emerald-400 opacity-50" />
            </div>

            {/* Add to Cart Component (Handles Sizes) */}
            <AddToCartButton product={product} />

            {/* Accordions */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <details open className="group">
                <summary className="flex items-center justify-between cursor-pointer text-[11px] font-black uppercase tracking-[0.2em] py-3 list-none">
                  Description & Fit <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-sm text-gray-500 leading-relaxed pb-5 whitespace-pre-wrap font-medium">
                  {product.description || "Premium handcrafted clothing designed for your little ones."}
                </p>
              </details>

              {product.specifications?.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-4">
                    Specifications
                  </h3>

                  <div className="rounded-3xl overflow-hidden border border-gray-100 bg-[#fafafa]">
                    {product.specifications.map(
                      (item: any, index: number) => (
                        <div
                          key={index}
                          className="grid grid-cols-[140px_1fr] md:grid-cols-[180px_1fr] gap-4 px-5 py-4 border-b border-gray-100 last:border-none bg-white"
                        >
                          <span className="font-bold text-gray-500">
                            {item.key}
                          </span>

                          <span className="text-black font-medium">
                            {item.value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              <details className="group border-t border-gray-100">
                <summary className="flex items-center justify-between cursor-pointer text-[11px] font-black uppercase tracking-[0.2em] py-5 list-none">
                  Premium Quality Guarantee <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="grid grid-cols-2 gap-3 pb-8">
                  {[
                    { icon: Tag, label: "Eco-Friendly", value: "Organic Cotton" },
                    { icon: Package, label: "Packaging", value: "Luxury Box" },
                    { icon: Clock, label: "Support", value: "24/7 Priority" },
                    { icon: Calendar, label: "Exchange", value: "7-Day Easy" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                      <item.icon size={14} className="text-gray-400" />
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase">{item.label}</p>
                        <p className="text-[10px] font-bold text-black">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC REVIEWS SECTION --- */}
        <section className="mt-16 md:mt-24 border-t border-gray-100 pt-12 md:pt-16">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            <div className="lg:w-1/3 space-y-10">
              <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase leading-[0.8]">What Souls <br /> <span className="text-gray-300">Are Saying</span></h2>
              <div className="flex items-end gap-5">
                <span className="text-5xl md:text-8xl font-black tracking-tighter leading-none">{avgRating}</span>
                <div className="pb-2">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={18} className={s <= Math.round(Number(avgRating)) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                    ))}
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{totalReviews} Verified Stories</p>
                </div>
              </div>
              <ReviewForm productId={product.id} />
            </div>

            <div className="flex-1 space-y-6">
              {reviews.length === 0 ? (
                <div className="h-full flex items-center justify-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs italic">Be the first to tell a story...</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-gray-100 rounded-[2rem] p-6 md:p-10 space-y-6 hover:shadow-2xl transition-all duration-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={review.userImage || "https://avatar.vercel.sh/user"} className="h-12 w-12 rounded-full border-2 border-white shadow-lg" alt="" />
                        <div>
                          <p className="font-black text-sm uppercase tracking-tight">{review.userName}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={10} className={s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-100"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed font-medium italic">&ldquo;{review.comment}&rdquo;</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* RELATED */}
        {related.length > 0 && (
          <section className="mt-16 md:mt-24 mb-6">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase">More to Love</h2>
              <Link href="/shop" className="text-[10px] font-black border-b-2 border-black pb-1 uppercase tracking-widest">Explore All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}