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
    trending?: string;
    exclusive?: string;
  }>
}) {
  //   await new Promise((resolve) =>
  //   setTimeout(resolve, 3000)
  // );
  const {
    category,
    q,
    gender,
    age,
    sort,
    new: isNew,
    trending,
    exclusive
  } = await searchParams;
  const createSortLink = (sortValue: string) => {
    const params = new URLSearchParams();

    params.set("sort", sortValue);

    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (gender) params.set("gender", gender);
    if (age) params.set("age", age);
    if (isNew === "true")
      params.set("new", "true");
    if (trending === "true")
      params.set("trending", "true");

    if (exclusive === "true")
      params.set("exclusive", "true");

    return `/shop?${params.toString()}`;
  };

  const products = await db.product.findMany({
    where: {
      ...(isNew === "true" && {
        isNewArrival: true,
      }),
      ...(trending === "true" && {
        isTrending: true,
      }),
      ...(exclusive === "true" && {
        isExclusive: true,
      }),


      ...(category && {
        category: {
          name: {
            equals: category,
            mode: "insensitive",
          },
        },
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
            description: {
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

          {
            gender: {
              contains: q,
              mode: "insensitive",
            },
          },

          {
            size: {
              contains: q,
              mode: "insensitive",
            },
          },

          {
            color: {
              contains: q,
              mode: "insensitive",
            },
          },
        ]
      }),
      ...(gender && {
        gender: {
          equals: gender,
          mode: "insensitive",
        },
      }),

      ...(age && {
        size: {
          contains: age,
          mode: "insensitive",
        },
      }),

      isArchived: false,

    },

    include: {
      category: true,
      images: {
        orderBy: {
          position: "asc",
        },
      },
      reviews: true,
      variants: true,
    },
  });

  // ---------- Sorting ----------

  if (sort === "price-asc") {
    products.sort((a, b) => a.price - b.price);

  } else if (sort === "price-desc") {
    products.sort((a, b) => b.price - a.price);

  } else if (sort === "top-rated") {
    products.sort((a, b) => {
      const avgA =
        a.reviews.length === 0
          ? 0
          : a.reviews.reduce((sum, r) => sum + r.rating, 0) /
          a.reviews.length;

      const avgB =
        b.reviews.length === 0
          ? 0
          : b.reviews.reduce((sum, r) => sum + r.rating, 0) /
          b.reviews.length;

      if (avgA === avgB) {
        return b.reviews.length - a.reviews.length;
      }

      return avgB - avgA;
    });

  } else {
    products.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  }

  return (
    <main className="min-h-screen bg-white pb-20 pt-8 md:pt-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">

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
                    : age === "0-1Y"
                      ? "Newborn Collection"
                      : "All Collection"}

              </h1>

              <p className="mt-2 text-sm text-neutral-500 max-w-lg">
                Discover premium outfits crafted with comfort, style and love.
              </p>

            </div>

            {(gender || age) && (
              <Link
                href="/shop?new=true"
                className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider hover:gap-2 transition-all"
              >
                View New Arrivals →
              </Link>
            )}

          </div>

        </div>

        {/* -------- CATEGORY CARDS -------- */}

        <div className="grid grid-cols-3 gap-3 md:gap-5 mb-6">

          <Link href="/shop?age=0-1Y">

            <div className="rounded-2xl border border-neutral-200 bg-gradient-to-b from-orange-50 to-white px-3 py-4 md:p-5 flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">

              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-orange-100 flex items-center justify-center">

                <Baby size={20} />

              </div>

              <p className="mt-3 text-[10px] md:text-[13px]
uppercase
tracking-wide
font-black tracking-wide">
                Newborn
              </p>

            </div>

          </Link>

          <Link href="/shop?gender=Boy">

            <div className="rounded-2xl border border-neutral-200 bg-gradient-to-b from-sky-50 to-white px-3 py-4 md:p-5 flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">

              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-sky-100 flex items-center justify-center">

                <Shirt size={20} />

              </div>

              <p className="mt-3 text-[10px] md:text-[13px]
uppercase
tracking-wide
font-black tracking-wide">
                Boys
              </p>

            </div>

          </Link>

          <Link href="/shop?gender=Girl">

            <div className="rounded-2xl border border-neutral-200 bg-gradient-to-b from-pink-50 to-white px-3 py-4 md:p-5 flex flex-col items-center justify-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300">

              <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-pink-100 flex items-center justify-center">

                <Sparkles size={20} />

              </div>

              <p className="mt-3 text-[10px] md:text-[13px]
uppercase
tracking-wide
font-black tracking-wide">
                Girls
              </p>

            </div>

          </Link>

        </div>


        <div className="mt-5 md:mt-6 rounded-[28px] border border-neutral-200 bg-gradient-to-r from-neutral-50 to-white p-5 md:p-6 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-400">
                Collection Overview
              </p>

              <h3 className="mt-2 text-xl md:text-2xl font-black">
                {products.length} Products
              </h3>

              <p className="mt-2 text-xs text-neutral-500">
                Premium outfits curated for little stars.
              </p>

            </div>

            <div className="flex items-center justify-between md:block">
  <div className="inline-flex items-center justify-center rounded-full bg-black px-3 py-1.5 text-[10px] md:px-5 md:py-2.5 md:text-xs font-bold text-white shadow-sm">
    Premium Collection
  </div>
</div>

          </div>

        </div>


        <div className="mt-8 mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <h2 className="text-xl md:text-3xl font-black">
            Explore Collection
          </h2>

          <div className="flex overflow-x-auto no-scrollbar gap-2">

            <Link
              href={createSortLink("newest")}
              className={`inline-flex h-8 items-center justify-center whitespace-nowrap rounded-full px-5 text-xs font-bold transition ${!sort || sort === "newest"
                ? "bg-black text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
            >
              Newest
            </Link>

            <Link
              href={createSortLink("price-asc")}
              className={`inline-flex h-8 items-center justify-center whitespace-nowrap rounded-full px-5 text-xs font-bold transition ${sort === "price-asc"
                ? "bg-black text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
            >
              Low Price
            </Link>

            <Link
              href={createSortLink("price-desc")}
              className={`inline-flex h-8 items-center justify-center whitespace-nowrap rounded-full px-5 text-xs font-bold transition ${sort === "price-desc"
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

            <h2 className="mt-3 text-2xl md:text-3xl font-black tracking-tight">
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
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
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
