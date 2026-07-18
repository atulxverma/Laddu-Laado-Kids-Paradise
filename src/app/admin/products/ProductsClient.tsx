"use client"

import { useMemo, useState } from "react"
import { Package, Plus, SlidersHorizontal } from "lucide-react"
import ProductForm from "./ProductForm"
import DeleteProductButton from "./DeleteProductButton"

type Category = {
  id: string
  name: string
}

type ProductImage = {
  url: string
}

type Product = {
  id: string
  name: string
  price: number
  size?: string | null
  color?: string | null
  stock?: number | null
  isNewArrival?: boolean | null
  gender?: string | null
  createdAt: Date | string
  category?: Category | null
  images: ProductImage[]
}

type ProductsClientProps = {
  products: Product[]
  categories: Category[]
}

export default function ProductsClient({ products, categories }: ProductsClientProps) {
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [gender, setGender] = useState("")
  const [stockFilter, setStockFilter] = useState("")
  const [sort, setSort] = useState("newest")

  const genders = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.gender?.trim()).filter(Boolean))) as string[]
  }, [products])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()

    const filtered = products.filter((product) => {
      const stock = Number(product.stock ?? 0)
      const searchableValues = [product.name, product.category?.name, product.color, product.size].filter(Boolean).join(" ").toLowerCase()
      const matchesSearch = !query || searchableValues.includes(query)
      const matchesCategory = !categoryId || product.category?.id === categoryId
      const matchesGender = !gender || product.gender === gender
      const matchesStock = !stockFilter ||
        (stockFilter === "in-stock" && stock > 5) ||
        (stockFilter === "low-stock" && stock > 0 && stock <= 5) ||
        (stockFilter === "out-of-stock" && stock === 0)

      return matchesSearch && matchesCategory && matchesGender && matchesStock
    })

    return [...filtered].sort((a, b) => {
      if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (sort === "price-low") return Number(a.price) - Number(b.price)
      if (sort === "price-high") return Number(b.price) - Number(a.price)
      if (sort === "name-asc") return a.name.localeCompare(b.name)
      if (sort === "name-desc") return b.name.localeCompare(a.name)

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [products, search, categoryId, gender, stockFilter, sort])

  const hasActiveFilters = Boolean(search || categoryId || gender || stockFilter || sort !== "newest")

  const clearFilters = () => {
    setSearch("")
    setCategoryId("")
    setGender("")
    setStockFilter("")
    setSort("newest")
  }

  const getStockBadge = (stock: number) => {
    if (stock === 0)
      return "border-red-100 bg-red-50 text-red-700"
    if (stock <= 5)
      return "border-amber-100 bg-amber-50 text-amber-700"
    return "border-emerald-100 bg-emerald-50 text-emerald-700"
  }

  const getStockLabel = (stock: number) => {
    if (stock === 0) return "Out of Stock"
    if (stock <= 5) return "Low Stock"
    return "In Stock"
  }

  return (
    <section className="min-w-0 space-y-4">
      <div className="rounded-[28px] border border-neutral-100 bg-white p-3 shadow-sm sm:p-4 lg:p-5">
        <div className="mb-3 flex flex-col gap-1.5 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="shrink-0 text-neutral-500" />
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-500 sm:text-xs">Store Collection</p>
          </div>
          <p className="text-[10px] font-bold text-neutral-500 sm:text-xs">Showing {filteredProducts.length} of {products.length} products</p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3">
          <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Search products..." aria-label="Search products" className="min-w-0 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[13px] text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-neutral-900 focus:bg-white focus:ring-2 focus:ring-neutral-100 sm:px-4 sm:text-sm col-span-2 lg:col-span-3 lg:py-3" />

          <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} aria-label="Filter by category" className="min-w-0 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[13px] font-medium text-neutral-600 outline-none transition-all focus:border-neutral-900 focus:bg-white sm:px-4 sm:text-sm lg:py-3">
            <option value="">All Categories</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select>

          <select value={gender} onChange={(event) => setGender(event.target.value)} aria-label="Filter by gender" className="min-w-0 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[13px] font-medium text-neutral-600 outline-none transition-all focus:border-neutral-900 focus:bg-white sm:px-4 sm:text-sm lg:py-3">
            <option value="">All Genders</option>
            {genders.map((genderOption) => <option key={genderOption} value={genderOption}>{genderOption}</option>)}
          </select>

          <select value={stockFilter} onChange={(event) => setStockFilter(event.target.value)} aria-label="Filter by stock" className="min-w-0 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[13px] font-medium text-neutral-600 outline-none transition-all focus:border-neutral-900 focus:bg-white sm:px-4 sm:text-sm lg:py-3">
            <option value="">All Stock</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products" className="min-w-0 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-[13px] font-medium text-neutral-600 outline-none transition-all focus:border-neutral-900 focus:bg-white sm:px-4 sm:text-sm lg:py-3">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>

          <button type="button" onClick={clearFilters} disabled={!hasActiveFilters} className="rounded-xl border border-neutral-200 bg-white px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-neutral-700 transition-all hover:border-neutral-900 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-xs lg:py-3">
            Clear Filters
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <section className="flex min-h-[460px] flex-col items-center justify-center rounded-[32px] border border-dashed border-neutral-200 bg-white px-6 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-50">
            <Package size={36} strokeWidth={1.4} className="text-neutral-400" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-neutral-950">No products available</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">Click Add Product to publish your first product.</p>
          <a href="#add-product" className="mt-7 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <Plus size={15} />
            Add Product
          </a>
        </section>
      ) : filteredProducts.length === 0 ? (
        <section className="flex min-h-[360px] flex-col items-center justify-center rounded-[32px] border border-dashed border-neutral-200 bg-white px-6 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-50">
            <Package size={28} strokeWidth={1.4} className="text-neutral-400" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-neutral-950">No matching products</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">Try changing your search or filter selections.</p>
          <button type="button" onClick={clearFilters} className="mt-6 rounded-full border border-neutral-200 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-neutral-800 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-900 hover:shadow-sm">
            Clear Filters
          </button>
        </section>
      ) : (
        <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const stock = Number(product.stock ?? 0)

            return (
              <article key={product.id} className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-3xl">
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-50">
                  {product.images[0]?.url ? (
                    <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package size={28} strokeWidth={1.4} className="text-neutral-300 sm:hidden" />
                      <Package size={34} strokeWidth={1.4} className="hidden text-neutral-300 sm:block" />
                    </div>
                  )}

                  <div className="absolute left-2 right-20 top-2 flex flex-col items-start gap-1.5 sm:left-3 sm:right-24 sm:top-3">
                    <span className={`
rounded-full
border
px-2.5
py-1
text-[9px]
font-bold
uppercase
tracking-wider
${getStockBadge(stock)}
`}>{getStockLabel(stock)}</span>
                    {product.isNewArrival && <span className="max-w-full truncate rounded-full bg-black px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-white sm:px-2.5 sm:py-1.5 sm:text-[9px]">New</span>}
                  </div>
                  {stock === 0 && (
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                      <span
                        className="
  rounded-full
  border
  border-red-100
  bg-red-50
  px-2.5
  py-1
  text-[9px]
  font-bold
  uppercase
  tracking-wider
  text-red-700
  "
                      >
                        OUT OF STOCK
                      </span>
                    </div>
                  )}
                  {product.category && <span className="absolute bottom-2 left-2 max-w-[72%] truncate rounded-full bg-white px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-neutral-700 shadow-sm sm:bottom-3 sm:left-3 sm:px-2.5 sm:py-1.5 sm:text-[9px]">{product.category.name}</span>}

                  <div className="absolute right-2 top-2 z-20 flex items-center gap-1.5 opacity-100 transition-all duration-200 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 sm:right-3 sm:top-3 sm:gap-2">
                    <ProductForm categories={categories} product={product} />
                    <DeleteProductButton productId={product.id} />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="min-w-0 truncate text-sm font-bold text-neutral-950 sm:text-base">{product.name}</h3>
                    <p className="shrink-0 text-sm font-black tracking-tight text-neutral-950 sm:text-base">₹{Number(product.price).toLocaleString("en-IN")}</p>
                  </div>

                  <div className="mt-3 flex min-h-5 flex-wrap gap-1.5">
                    {product.size && <span className="max-w-full truncate rounded-full bg-neutral-100 px-2 py-1 text-[9px] font-bold text-neutral-600 sm:px-2.5 sm:text-[10px]">Size: {product.size}</span>}
                    {product.color && <span className="max-w-full truncate rounded-full bg-neutral-100 px-2 py-1 text-[9px] font-bold text-neutral-600 sm:px-2.5 sm:text-[10px]">{product.color}</span>}
                    {product.gender && <span className="max-w-full truncate rounded-full bg-neutral-100 px-2 py-1 text-[9px] font-bold text-neutral-600 sm:px-2.5 sm:text-[10px]">{product.gender}</span>}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-3">
                    <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-neutral-400 sm:text-[10px]">Inventory</span>
                    <span
                      className={`text-[10px] font-bold sm:text-xs
    ${stock === 0
                          ? "text-red-600"
                          : stock <= 5
                            ? "text-amber-600"
                            : "text-emerald-600"
                        }
  `}
                    >
                      {stock} {stock === 1 ? "unit" : "units"}
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}