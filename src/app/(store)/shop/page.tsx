import { db } from "@/lib/db"
import ProductCard from "@/components/ProductCard"
import { Search } from "lucide-react"
import ShopFilters from "@/components/ShopFilters"
import Link from "next/link"

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const { category, q } = await searchParams

  const products = await db.product.findMany({
    where: {
      ...(category && {
        category: { name: { equals: category, mode: "insensitive" } },
      }),
      ...(q && { name: { contains: q, mode: "insensitive" } }),
    },
    include: { category: true, images: true },
    orderBy: { createdAt: "desc" },
  })

  const categories = await db.category.findMany()

  return (
    <main className="bg-white min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black tracking-tight">Shop</h1>
          <p className="text-sm text-gray-400 mt-1">
            {products.length} products found
            {category && (
              <span>
                {" "}in{" "}
                <span className="font-semibold text-black capitalize">
                  {category}
                </span>
              </span>
            )}
            {q && (
              <span>
                {" "}for{" "}
                <span className="font-semibold text-black">
                  &quot;{q}&quot;
                </span>
              </span>
            )}
          </p>
        </div>

        {/* Filters */}
        <ShopFilters categories={categories} activeCategory={category} />

        {/* Grid */}
        {products.length === 0 ? (
          <div className="py-32 text-center">
            <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              No products found
            </p>
            {(category || q) && (
              <Link
                href="/shop"
                className="mt-4 inline-block text-xs font-bold text-black border-b border-black pb-0.5 hover:opacity-60 transition-opacity"
              >
                Clear filters
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}