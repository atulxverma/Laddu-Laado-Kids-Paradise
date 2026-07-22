import { db } from "@/lib/db"
import ProductForm from "./ProductForm"
import ProductsClient from "./ProductsClient"
import Link from "next/link"
import { ArrowUpRight, Boxes, CircleAlert, Plus, Tag, Warehouse } from "lucide-react"

export default async function ProductsPage() {
  const categories = await db.category.findMany()
  const products = await db.product.findMany({
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
  orderBy: {
    createdAt: "desc",
  },
})

  const inventoryProducts = products as Array<
typeof products[number] & {
stock?: number | null
isNewArrival?: boolean | null
isTrending?: boolean | null
isExclusive?: boolean | null
}
>

  const newArrivalProducts = inventoryProducts.filter((product) => product.isNewArrival).length
  const lowStockProducts = inventoryProducts.filter((product) => {
    const stock =
  product.variants?.reduce((sum, v) => sum + v.stock, 0) ?? product.stock ?? 0
    return stock > 0 && stock <= 5
  }).length
  const outOfStockProducts = inventoryProducts.filter((product) => {
  const stock =
    product.variants?.reduce(
      (sum, v) => sum + v.stock,
      0
    ) ??
    product.stock ??
    0

  return stock === 0
}).length

  return (
    <main className="min-h-screen bg-[#fafafa] p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-[1440px] space-y-8">
        <header className="flex flex-col gap-5 rounded-[32px] border border-neutral-100 bg-white p-6 shadow-sm sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-neutral-400">Admin Dashboard</p>
            <h1 className="text-4xl font-black tracking-[-0.05em] text-neutral-950 sm:text-5xl">Inventory</h1>
            <p className="mt-3 text-sm text-neutral-500 sm:text-base">Manage products, stock and collections.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="#add-product" className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <Plus size={15} />
              
            </a>
            <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-neutral-800 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-900 hover:shadow-sm">
              View Store
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          <div className="rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900"><Boxes size={19} /></div>
            <p className="mt-5 text-3xl font-black tracking-tight text-neutral-950">{products.length}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-neutral-500">Total Products</p>
            <p className="mt-2 hidden text-xs text-neutral-400 sm:block">Across all collections</p>
          </div>

          <div className="rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900"><Tag size={19} /></div>
            <p className="mt-5 text-3xl font-black tracking-tight text-neutral-950">{newArrivalProducts}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-neutral-500">New Arrivals</p>
            <p className="mt-2 hidden text-xs text-neutral-400 sm:block">Recently introduced pieces</p>
          </div>

          <div className="rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700"><CircleAlert size={19} /></div>
            <p className="mt-5 text-3xl font-black tracking-tight text-neutral-950">{lowStockProducts}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-neutral-500">Low Stock</p>
            <p className="mt-2 hidden text-xs text-neutral-400 sm:block">Five units or fewer left</p>
          </div>

          <div className="rounded-3xl border border-neutral-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-700"><Warehouse size={19} /></div>
            <p className="mt-5 text-3xl font-black tracking-tight text-neutral-950">{outOfStockProducts}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-neutral-500">Out of Stock</p>
            <p className="mt-2 hidden text-xs text-neutral-400 sm:block">Products requiring attention</p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-7 xl:grid-cols-[minmax(0,1fr)_390px]">
          <ProductsClient products={products} categories={categories} />

          <aside id="add-product" className="h-fit xl:sticky xl:top-6">
            <section className="overflow-hidden rounded-[32px] border border-neutral-100 bg-white shadow-sm">
              <div className="border-b border-neutral-100 px-6 py-6 sm:px-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900">
                  <Tag size={19} />
                </div>
                <h2 className="mt-4 text-xl font-black tracking-tight text-neutral-950">Add New Product</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-500">Create a product and add it to your store collection.</p>
              </div>
              <div className="p-6 sm:p-7">
                <ProductForm categories={categories} />
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}