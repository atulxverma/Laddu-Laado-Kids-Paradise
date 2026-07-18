import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";
import ReviewForm from "@/components/ReviewForm";
import Link from "next/link";
import {
  ChevronLeft,
  Clock,
  Package,
  Tag,
  Calendar,
  Star,
  Truck,
  RotateCcw,
  BadgeCheck,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  // 1. Fetch Product with Reviews
  const product = await db.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      images: true,
      reviews: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!product) notFound();

  // 2. Fetch Related
  const related = await db.product.findMany({
    where: { categoryId: product.categoryId, NOT: { id: product.id } },
    include: { category: true, images: true },
    take: 4,
  });

  // 3. Dynamic Stats Logic
  const reviews = product.reviews || [];
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(
        1,
      )
      : "0.0";

  return (
    <main className="bg-gradient-to-b from-white via-[#fcfcfc] to-white pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-2 md:pt-8">
        {/* Breadcrumb */}
        <div className="py-2 md:py-4">

          {/* Mobile */}

          <Link
            href="/shop"
            className="md:hidden inline-flex items-center gap-2 text-[11px] font-black text-gray-500 hover:text-black transition"
          >
            <ChevronLeft size={16} />
            Back
          </Link>

          {/* Desktop */}

          <div className="hidden md:flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-gray-400">

            <Link
              href="/"
              className="hover:text-black flex items-center gap-1 transition-colors"
            >
              <ChevronLeft size={12} />
              Home
            </Link>

            <span className="opacity-30">/</span>

            <span>{product.category?.name}</span>

          </div>

        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-[58%_42%] gap-10 xl:gap-20">
          <div className="lg:sticky lg:top-24 h-fit">
            <ProductGallery images={product.images} />
          </div>

          <div className="flex flex-col gap-8 xl:pl-4">
            <div className="space-y-8 border-b border-gray-100 pb-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-4 py-2 rounded-full bg-black text-white text-[10px] uppercase tracking-[0.22em] font-black">
                  {product.category?.name}
                </span>

                <span
                  className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-[0.22em] font-black
      ${product.stock > 0
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                    }`}
                >
                  {product.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                </span>
              </div>

              <div className="space-y-4">
                <h1
                  className="
      text-[28px]
sm:text-[34px]
md:text-5xl
xl:text-6xl
      font-black
      tracking-tight
md:tracking-[-0.05em]
      leading-[0.9]
    "
                >
                  {product.name}
                </h1>

                <p className="text-[14px] md:text-[16px] leading-6 md:leading-8 text-gray-500">
                  {(product.description || "")
                    .split("\n")
                    .find((line) => line.trim() && !line.includes(":")) ||
                    "Premium handcrafted kidswear designed for comfort and everyday adventures."}
                </p>
              </div>

              <div className="flex items-end gap-6">
                <div>
                  <h2
                    className="
        text-[34px]
sm:text-[40px]
md:text-5xl
        font-black
        tracking-tight
      "
                  >
                    ₹{product.price.toLocaleString("en-IN")}
                  </h2>

                  <p className="text-sm text-gray-400 mt-1">
                    Inclusive of all taxes
                  </p>
                </div>

                <div className="h-14 w-px bg-gray-200" />

                <div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={16}
                        className={
                          s <= Math.round(Number(avgRating))
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-200"
                        }
                      />
                    ))}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-bold">{avgRating}</span>

                    <span className="text-gray-300">•</span>

                    <span className="text-sm text-gray-500">
                      {totalReviews} Verified Reviews
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <details open className="group">
                <summary className="flex items-center justify-between cursor-pointer text-[11px] font-black uppercase tracking-[0.2em] py-3 list-none">
                  Description & Fit{" "}
                  <span className="group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p
                  className="text-[14px]
md:text-[16px]
leading-6
md:leading-8
tracking-wide text-gray-600 pb-5 whitespace-pre-wrap font-medium"
                >
                  {(product.description || "")
                    .split("\n")
                    .filter((line) => !line.includes(":"))
                    .join("\n") ||
                    "Premium handcrafted clothing designed for your little ones."}
                </p>
              </details>

              {product.specifications?.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-4">
                    Specifications
                  </h3>

                  <div className="rounded-[28px] overflow-hidden border border-gray-100 bg-[#fafafa]">
                    {product.specifications.map((item: any, index: number) => (
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
                    ))}
                  </div>
                </div>
              )}

              <details className="group border-t border-gray-100">
                <summary className="flex items-center justify-between cursor-pointer text-[11px] font-black uppercase tracking-[0.2em] py-5 list-none">
                  Premium Quality Guarantee{" "}
                  <span className="group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-8">
                  {[
                    {
                      icon: Tag,
                      label: "Eco-Friendly",
                      value: "Organic Cotton",
                    },
                    { icon: Package, label: "Packaging", value: "Luxury Box" },
                    { icon: Clock, label: "Support", value: "24/7 Priority" },
                    { icon: Calendar, label: "Exchange", value: "7-Day Easy" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 p-5 bg-white border border-gray-100 rounded-[24px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      <item.icon size={18} className="text-black" />
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">
                          {item.label}
                        </p>
                        <p className="text-sm font-bold text-black">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>

            {/* Add to Cart Component (Handles Sizes) */}
            <div className="rounded-[32px] border border-neutral-200 bg-gradient-to-b from-white to-neutral-50 p-6 shadow-sm">
              <AddToCartButton product={product} />
            </div>

            {/* Product Highlights */}

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {/* Organic Fabric */}

              <div className="rounded-2xl md:rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50 p-4 md:p-6 shadow-sm hover:shadow-lg transition-all">
                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.22em] text-emerald-600 font-black">
                  Organic Fabric
                </p>

                <h3 className="mt-2 text-lg md:text-2xl font-black text-neutral-900">
                  100% Cotton
                </h3>

                <p className="mt-2 text-[11px] md:text-xs leading-5 text-neutral-600">
                  Soft, breathable & gentle on baby's skin.
                </p>
              </div>

              {/* Fast Delivery */}

              <div className="rounded-2xl md:rounded-[28px] border border-sky-100 bg-gradient-to-br from-sky-50 to-cyan-50 p-4 md:p-6 shadow-sm hover:shadow-lg transition-all">
                <p className="text-[9px] md:text-[10px] uppercase tracking-[0.22em] text-sky-600 font-black">
                  Fast Delivery
                </p>

                <h3 className="mt-2 text-lg md:text-2xl font-black text-neutral-900">
                  2–5 Days
                </h3>

                <p className="mt-2 text-[11px] md:text-xs leading-5 text-neutral-600">
                  Quick shipping with easy returns across India.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC REVIEWS SECTION --- */}
        <section className="mt-16 md:mt-24 border-t border-gray-100 pt-12 md:pt-16">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            <div className="lg:w-1/3 space-y-10">
              <h2 className="text-2xl md:text-5xl font-black tracking-tighter uppercase leading-[0.8]">
                What Souls <br />{" "}
                <span className="text-gray-300">Are Saying</span>
              </h2>
              <div className="flex items-end gap-5">
                <span className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
                  {avgRating}
                </span>
                <div className="pb-2">
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={18}
                        className={
                          s <= Math.round(Number(avgRating))
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-200"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {totalReviews} Verified Reviews
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <h3 className="mb-5 text-lg font-black tracking-tight">
                  Write a Review
                </h3>

                <ReviewForm productId={product.id} />
              </div>
            </div>

            <div className="flex-1 space-y-6">
              {reviews.length === 0 ? (
                <div className="h-full flex items-center justify-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs ">
                    Be the first to tell a story...
                  </p>
                </div>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-[32px] border border-gray-100 bg-white p-5 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            review.userImage || "https://avatar.vercel.sh/user"
                          }
                          alt={review.userName}
                          className="h-14 w-14 rounded-full object-cover ring-2 ring-pink-100"
                        />

                        <div>
                          <h3 className="font-black text-base">
                            {review.userName}
                          </h3>

                          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-IN",
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            className={
                              s <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>

                    <div className="my-6 h-px bg-gray-100" />

                    <p
                      className="text-[13px]
md:text-[15px]
leading-6
md:leading-8 text-gray-600"
                    >
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* RELATED PRODUCTS */}

        {related.length > 0 && (
          <section className="mt-16 md:mt-24 mb-10">
            <div className="flex items-end justify-between mb-6 md:mb-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-gray-400">
                  Recommended For You
                </p>

                <h2 className="mt-2 text-2xl md:text-5xl font-black tracking-tight leading-none">
                  Complete the Look
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/shop"
                  className="
hidden md:flex
items-center
gap-2
rounded-full
border
border-gray-200
px-5
py-3
text-xs
font-black
hover:bg-black
hover:text-white
transition-all"
                >
                  View All →
                </Link>

                <Link
                  href="/shop"
                  className="
md:hidden
text-[10px]
font-black
uppercase
tracking-[0.18em]
border-b-2
border-black
pb-1"
                >
                  View All →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
