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
    <main className="bg-white min-h-screen pb-20 pt-15">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 md:mb-10">

  <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.28em] text-neutral-400">
    Premium Kids Fashion
  </span>

  <div className="mt-2 flex flex-col md:flex-row md:items-end md:justify-between gap-3">

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

</div>

        {/* -------- CATEGORY CARDS -------- */}

        <div className="grid grid-cols-3 gap-3 md:gap-5 mb-10">

  <Link href="/shop?age=0-2Y">

    <div className="rounded-2xl border border-neutral-200 bg-gradient-to-b from-orange-50 to-white px-3 py-5 md:p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300">

      <div className="h-11 w-11 md:h-14 md:w-14 rounded-full bg-orange-100 flex items-center justify-center">

        <Baby size={20} />

      </div>

      <p className="mt-3 text-[11px] md:text-sm font-bold">
        Newborn
      </p>

    </div>

  </Link>

  <Link href="/shop?gender=Boy">

    <div className="rounded-2xl border border-neutral-200 bg-gradient-to-b from-sky-50 to-white px-3 py-5 md:p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300">

      <div className="h-11 w-11 md:h-14 md:w-14 rounded-full bg-sky-100 flex items-center justify-center">

        <Shirt size={20} />

      </div>

      <p className="mt-3 text-[11px] md:text-sm font-bold">
        Boys
      </p>

    </div>

  </Link>

  <Link href="/shop?gender=Girl">

    <div className="rounded-2xl border border-neutral-200 bg-gradient-to-b from-pink-50 to-white px-3 py-5 md:p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300">

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
    Latest Collection
  </h2>

  <div className="flex overflow-x-auto no-scrollbar gap-2">

    <Link
      href={`/shop?sort=newest${gender ? `&gender=${gender}` : age ? `&age=${age}` : ""}`}
      className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-bold transition ${
        !sort || sort === "newest"
          ? "bg-black text-white"
          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
      }`}
    >
      Newest
    </Link>

    <Link
      href={`/shop?sort=price-asc${gender ? `&gender=${gender}` : age ? `&age=${age}` : ""}`}
      className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-bold transition ${
        sort === "price-asc"
          ? "bg-black text-white"
          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
      }`}
    >
      Low Price
    </Link>

    <Link
      href={`/shop?sort=price-desc${gender ? `&gender=${gender}` : age ? `&age=${age}` : ""}`}
      className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-bold transition ${
        sort === "price-desc"
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
          <div className="py-32 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <Search size={40} className="mx-auto text-gray-200 mb-4" />
            <h2 className="text-xl font-black uppercase text-gray-400">
              No Collection Matches
            </h2>
            <Link
              href="/shop"
              className="mt-4 inline-block text-[10px] font-black border-b-2 border-black pb-1 uppercase tracking-widest"
            >
              Back to Store
            </Link>
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
  );
}
