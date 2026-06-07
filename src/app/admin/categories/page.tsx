import { db } from "@/lib/db"
import CategoryForm from "./CategoryForm"
import { Layers } from "lucide-react"

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { products: true } },
    },
  })

  return (
    <div className="p-6 md:p-10 space-y-8 bg-white min-h-screen">
      <div className="flex items-center justify-between pt-8 md:pt-0">
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight">Categories</h1>
          <p className="text-sm text-gray-400 mt-1">{categories.length} categories total</p>
        </div>
        <CategoryForm />
      </div>

      {categories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 py-24 text-center text-gray-400 text-sm">
          No categories yet. Create your first one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl border border-gray-100 p-6 flex items-center justify-between hover:border-gray-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                  <Layers size={16} className="text-gray-400" />
                </div>
                <div>
                  <p className="font-semibold text-black text-sm">{cat.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {cat._count.products} products
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-gray-400">
                {new Date(cat.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}