import { db } from "@/lib/db"
import ProductForm from "./ProductForm"
import { Package, Tag, Trash2 } from "lucide-react"
import DeleteProductButton from "./DeleteProductButton"

export default async function ProductsPage() {
  const categories = await db.category.findMany()
  const products = await db.product.findMany({
    include: { category: true, images: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="p-6 md:p-10 bg-[#fafafa] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8 pt-8 md:pt-0">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-black tracking-tight">Inventory</h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-medium">
            {products.length} products in store
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-6">

          {/* LEFT — Product Grid */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Package size={14} className="text-gray-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Store Collection ({products.length})
              </span>
            </div>

            {products.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 py-24 text-center text-gray-400 text-sm bg-white">
                No products yet. Add your first one →
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-300 hover:shadow-md transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
                      {product.images[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={32} className="text-gray-200" />
                        </div>
                      )}

                      {/* Category Badge */}
                      {product.category && (
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                            {product.category.name}
                          </span>
                        </div>
                      )}

                      {/* Delete Button */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                        

                        <ProductForm
                          categories={categories}
                          product={product}
                        />
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-sm text-black truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-black text-black">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {product.size && (
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                              {product.size}
                            </span>
                          )}
                          {product.color && (
                            <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                              {product.color}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Add Product Form */}
          <div className="xl:sticky xl:top-6 h-fit">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <Tag size={14} className="text-gray-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Add New Product
                </span>
              </div>
              <div className="p-6">
                <ProductForm categories={categories} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}