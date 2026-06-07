import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import ProductGallery from "@/components/ProductGallery"
import AddToCartButton from "@/components/AddToCartButton"
import ProductCard from "@/components/ProductCard"
import Link from "next/link"
import { ChevronLeft, Clock, Package, Tag, Calendar } from "lucide-react"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params

  const product = await db.product.findUnique({
    where: { id: productId },
    include: { category: true, images: true },
  })

  if (!product) notFound()

  const related = await db.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id } },
    include: { category: true, images: true },
    take: 4,
  })

  const sizes = ["S", "M", "L", "XL", "XXL"]

  return (
    <main className="bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 py-4">
          <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
            <ChevronLeft size={13} /> Home
          </Link>
          <span>›</span>
          <span>Product details</span>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <ProductGallery images={product.images} />

          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs text-gray-400 mb-1">{product.category?.name}</p>
              <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>
              <p className="text-2xl font-bold mt-2">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-yellow-400 text-sm">★</span>
                ))}
                <span className="text-xs text-gray-400 ml-1">4.5/5 (50 Reviews)</span>
              </div>
            </div>

            {/* Delivery Timer */}
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-4 py-3 rounded-xl">
              <Clock size={13} className="text-black" />
              Order within <span className="font-bold text-black mx-1">02:30:25</span> to get next day delivery
            </div>

            {/* Add to Cart — size selector inside */}
            <AddToCartButton product={product} sizes={sizes} />

            {/* Description */}
            <div className="border-t border-gray-100 pt-4">
              <details open>
                <summary className="flex items-center justify-between cursor-pointer text-sm font-bold py-2 list-none">
                  <span>Description & Fit</span>
                  <span className="text-gray-400 text-xs">▲</span>
                </summary>
                <p className="text-sm text-gray-500 leading-relaxed mt-3">
                  {product.description ||
                    "Premium handcrafted clothing designed for everyday elegance. Made with the finest materials for maximum comfort and style."}
                </p>
              </details>
            </div>

            {/* Shipping */}
            <div className="border-t border-gray-100 pt-4">
              <details>
                <summary className="flex items-center justify-between cursor-pointer text-sm font-bold py-2 list-none">
                  <span>Shipping</span>
                  <span className="text-gray-400 text-xs">▼</span>
                </summary>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {[
                    { icon: Tag, label: "Discount", value: "Disc 50%" },
                    { icon: Package, label: "Package", value: "Regular Package" },
                    { icon: Clock, label: "Delivery Time", value: "3-4 Working Days" },
                    { icon: Calendar, label: "Estimation Arrive", value: "10-12 Oct 2024" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                      <item.icon size={14} className="text-gray-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-gray-400">{item.label}</p>
                        <p className="text-xs font-bold">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Rating & Reviews */}
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-6">Rating & Reviews</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center justify-center min-w-[140px]">
              <span className="text-7xl font-black leading-none">4.5</span>
              <span className="text-sm text-gray-400">/ 5</span>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <span className="text-xs text-gray-400 mt-1">(50 New Reviews)</span>
            </div>

            <div className="flex-1 space-y-2">
              {[
                { star: 5, pct: 75 },
                { star: 4, pct: 55 },
                { star: 3, pct: 30 },
                { star: 2, pct: 15 },
                { star: 1, pct: 8 },
              ].map((r) => (
                <div key={r.star} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-4">{r.star}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex-1 border border-gray-100 rounded-2xl p-5 max-w-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-sm">Alex Mathio</p>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-yellow-400 text-xs">★</span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400">13 Oct 2024</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Premium quality clothing that fits perfectly and looks amazing. Highly recommend!
              </p>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16 mb-8">
            <h2 className="text-3xl font-bold text-center mb-10">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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