import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import { Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { Baby, Shirt, Sparkles, ArrowRight } from "lucide-react";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    q?: string;
    gender?: string;
    age?: string;
    sort?: string;
    new?: string;
  }>;
}) {
  const { category, q, gender, age, sort, new: isNew } = await searchParams;

  const products = await db.product.findMany({
    where: {
      ...(isNew === "true" && {
        isNewArrival: true,
      }),
      ...(category && {
        category: { name: { equals: category, mode: "insensitive" } },
      }),
      ...(q && {
        OR: [
          {
            name: {
              contains: q,
              mode: "insensitive",
            },
          },

          {
            category: {
              name: {
                contains: q,
                mode: "insensitive",
              },
            },
          },
        ],
      }),
      ...(gender && { gender: { equals: gender, mode: "insensitive" } }),
      ...(age && { ageGroup: { equals: age, mode: "insensitive" } }),
    },
    orderBy:
      sort === "price-asc"
        ? { price: "asc" }
        : sort === "price-desc"
          ? { price: "desc" }
          : { createdAt: "desc" },
    include: { category: true, images: true },
  });

  return (
    <main className="min-h-screen bg-white pb-20 pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">

          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.28em] text-neutral-400">
            Premium Kids Fashion
          </span>

          <div className="mt-3 flex flex-col md:flex-row md:items-end md:justify-between gap-3">

            <div>

              <h1 className="text-[30px] md:text-5xl font-black tracking-tight leading-none">

                {gender === "Boy"
                  ? "Boys Collection"
                  : gender === "Girl"
                    ? "Girls Collection"
                    : age === "0-2Y"
                      ? "Newborn Collection"
                      : "All Collection"}

              </h1>

              <p className="mt-2 text-sm text-neutral-500 max-w-lg">
                Discover premium outfits crafted with comfort, style and love.
              </p>

            </div>

            {(gender || age) && (
              <Link
                href="/shop"
                className="text-xs font-bold text-neutral-500 hover:text-black transition"
              >
                View All →
              </Link>
            )}

          </div>

          <div className="mt-8 rounded-[30px] border border-neutral-200 bg-gradient-to-r from-neutral-50 to-white p-6 md:p-8 shadow-sm">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>

                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-400">
                  Available Products
                </p>

                <h3 className="mt-2 text-2xl md:text-4xl font-black">
                  {products.length} Products
                </h3>

                <p className="mt-2 text-sm text-neutral-500">
                  Carefully curated premium kidswear.
                </p>

              </div>

              <div className="rounded-full bg-black px-6 py-3 text-sm font-bold text-white shadow-lg">
                Premium Collection
              </div>

            </div>

          </div>

        </div>

        {/* -------- CATEGORY CARDS -------- */}

        <div className="grid grid-cols-3 gap-3 md:gap-5 mb-10">

          <Link href="/shop?age=0-2Y">

            <div className="rounded-2xl border border-neutral-200 bg-gradient-to-b from-orange-50 to-white px-3 py-5 md:p-6 flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">

              <div className="h-11 w-11 md:h-14 md:w-14 rounded-full bg-orange-100 flex items-center justify-center">

                <Baby size={20} />

              </div>

              <p className="mt-3 text-[11px] md:text-sm font-bold">
                Newborn
              </p>

            </div>

          </Link>

          <Link href="/shop?gender=Boy">

            <div className="rounded-2xl border border-neutral-200 bg-gradient-to-b from-sky-50 to-white px-3 py-5 md:p-6 flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">

              <div className="h-11 w-11 md:h-14 md:w-14 rounded-full bg-sky-100 flex items-center justify-center">

                <Shirt size={20} />

              </div>

              <p className="mt-3 text-[11px] md:text-sm font-bold">
                Boys
              </p>

            </div>

          </Link>

          <Link href="/shop?gender=Girl">

            <div className="rounded-2xl border border-neutral-200 bg-gradient-to-b from-pink-50 to-white px-3 py-5 md:p-6 flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">

              <div className="h-11 w-11 md:h-14 md:w-14 rounded-full bg-pink-100 flex items-center justify-center">

                <Sparkles size={20} />

              </div>

              <p className="mt-3 text-[11px] md:text-sm font-bold">
                Girls
              </p>

            </div>

          </Link>

        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">

          <h2 className="text-xl md:text-3xl font-black">
            Explore Collection
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Showing {products.length} Products
          </p>

          <div className="flex overflow-x-auto no-scrollbar gap-2">

            <Link
              href={`/shop?sort=newest${gender ? `&gender=${gender}` : age ? `&age=${age}` : ""}`}
              className={`whitespace-nowrap px-5 py-3 rounded-2xl text-[10px] font-bold transition ${!sort || sort === "newest"
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
            >
              Newest
            </Link>

            <Link
              href={`/shop?sort=price-asc${gender ? `&gender=${gender}` : age ? `&age=${age}` : ""}`}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-bold transition ${sort === "price-asc"
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
            >
              Low Price
            </Link>

            <Link
              href={`/shop?sort=price-desc${gender ? `&gender=${gender}` : age ? `&age=${age}` : ""}`}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-bold transition ${sort === "price-desc"
                  ? "bg-black text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
            >
              High Price
            </Link>

          </div>

        </div>
        {/* --- PRODUCT GRID --- */}
        {products.length === 0 ? (
          <div className="flex min-h-[500px] flex-col items-center justify-center rounded-[32px] border border-neutral-200 bg-neutral-50">

            <Search size={50} className="text-neutral-300" />

            <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-neutral-400">
              No Products Found
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Nothing matches your search
            </h2>

            <p className="mt-3 max-w-sm text-center text-neutral-500">
              Try changing your filters or browse all collections.
            </p>

            <Link
              href="/shop"
              className="mt-8 rounded-full bg-black px-8 py-4 text-xs font-bold uppercase tracking-wider text-white"
            >
              View All Products →
            </Link>

          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        )}

        <section className="mt-20 rounded-[32px] border border-neutral-200 bg-neutral-50 p-10 text-center">

          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-400">
            Can't Decide?
          </p>

          <h2 className="mt-3 text-3xl font-black">
            Discover New Arrivals
          </h2>

          <p className="mt-3 text-neutral-500">
            Fresh styles added every week.
          </p>

          <Link
            href="/shop?new=true"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-black px-8 py-4 text-xs font-bold uppercase tracking-wider text-white transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            New Arrivals
            <ArrowRight size={15} />
          </Link>

        </section>
      </div>
    </main>
  );
}
