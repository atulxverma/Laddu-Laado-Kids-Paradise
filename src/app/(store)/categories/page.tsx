import { db } from "@/lib/db"
import Link from "next/link"
import { ArrowRight, Layers } from "lucide-react"

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: {
      order: "asc",
    },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  })

  return (
    <main className="min-h-screen bg-white pb-20 pt-6 sm:pt-8 lg:pt-10 sm:px-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-0">
        <header className="mb-9 sm:mb-11">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-neutral-400">Shop</p>
          <h1 className="text-3xl font-black tracking-tight text-neutral-950 sm:text-5xl">Browse Categories</h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500 sm:text-base">Discover thoughtfully made collections for every little moment.</p>
        </header>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`} className="group flex min-w-0 flex-col rounded-3xl border border-neutral-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-4">
              <div className="flex h-28 items-center justify-center overflow-hidden rounded-3xl border border-neutral-100 bg-neutral-50 p-4 sm:h-36 sm:p-5">
                {category.imageUrl ? (
                  <img src={category.imageUrl} alt={category.name} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                ) : (
                  <Layers size={30} strokeWidth={1.3} className="text-neutral-300" />
                )}
              </div>

              <div className="flex flex-1 flex-col px-1 pb-1 pt-4 sm:pt-5">
                <h2 className="truncate text-base font-black tracking-tight text-neutral-950 sm:text-lg">{category.name}</h2>
                <p className="mt-1 text-xs font-medium text-neutral-500">{category._count.products} {category._count.products === 1 ? "Product" : "Products"}</p>

                <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-neutral-900 transition-transform duration-300 group-hover:translate-x-1 sm:text-sm">
                  Explore Collection
                  <ArrowRight size={15} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}