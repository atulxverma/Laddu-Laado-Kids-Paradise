import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import ProductCard from "@/components/ProductCard"
import { ArrowRight, ChevronRight, FolderOpen, Layers, PackageOpen } from "lucide-react"

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    const category = await db.category.findUnique({
        where: {
            slug,
        },
    })

    if (!category) {
        notFound()
    }

    const products = await db.product.findMany({
        where: {
            categoryId: category.id,
            isArchived: false,
        },
        include: {
            images: true,
            category: true,
            reviews: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    return (
        <main className="min-h-screen bg-white pb-20 pt-6 sm:pt-8 lg:pt-10 sm:px-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-0">
                <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-1.5 text-xs font-medium text-neutral-400 sm:mb-9">
                    <Link href="/" className="transition-colors hover:text-neutral-950">Home</Link>
                    <ChevronRight size={14} />
                    <Link href="/categories" className="transition-colors hover:text-neutral-950">Categories</Link>
                    <ChevronRight size={14} />
                    <span className="max-w-[160px] truncate text-neutral-700 sm:max-w-none">{category.name}</span>
                </nav>

                <header className="rounded-[32px] border border-neutral-200 bg-white p-5 shadow-md sm:p-7 lg:p-8">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-neutral-100 bg-gradient-to-br from-neutral-50 to-neutral-100 p-3 sm:h-32 sm:w-32 sm:p-5">
                            {category.imageUrl ? (
                                <img src={category.imageUrl} alt={category.name} className="h-full w-full object-contain" />
                            ) : (
                                <Layers size={34} strokeWidth={1.25} className="text-neutral-300" />
                            )}
                        </div>

                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-400">Premium Collection</p>
                            <h1 className="mt-1 text-xl font-black tracking-TIGHT TEXT-neutral-950 sm:mt-2 sm:text-3xl lg:text-5xl">{category.name}</h1>
                            <div className="mt-2 flex items-center gap-2 text-xs font-medium text-neutral-500 sm:text-sm">
                                <FolderOpen size={16} />
                                {products.length} {products.length === 1 ? "Product" : "Products"} Available
                            </div>
                            <p className="mt-2 max-w-xl text-xs leading-5 text-neutral-500 sm:mt-4 sm:text-base">Explore timeless styles crafted for little stars.</p>
                        </div>
                    </div>
                </header>

                <div className="my-7 flex items-center justify-between">
                    <h2 className="text-lg font-black sm:text-2xl">
                        {category.name} Collection
                    </h2>

                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600">
                        {products.length} Products
                    </span>
                </div>

                {products.length === 0 ? (
                    <section className="flex min-h-[420px] flex-col items-center justify-center rounded-[32px] border border-dashed border-neutral-200 bg-white px-6 text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-neutral-50 to-neutral-100">
                            <PackageOpen size={36} strokeWidth={1.35} className="text-neutral-400" />
                        </div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-neutral-400">Collection update</p>
                        <h2 className="text-xl md:text-2xl font-black tracking-tight text-neutral-950">
                            No Products Yet
                        </h2>
                        <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">Products will appear here soon.</p>
                        <Link href="/categories" className="mt-7 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-neutral-300">
                            Browse Categories
                            <ArrowRight size={15} />
                        </Link>
                    </section>
                ) : (
                    <section>


                        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
                            {products.map((product) => (
                                <div key={product.id} className="min-w-0 transition-transform duration-300 hover:-translate-y-1">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    )
}