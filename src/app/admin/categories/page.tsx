import { db } from "@/lib/db"
import CategoryForm from "./CategoryForm"
import { Layers, Pencil, Trash2 } from "lucide-react"
import DeleteCategoryButton from "./DeleteCategoryButton"

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { products: true } },
    },
  })

  return (
    <div className="min-h-screen space-y-8 bg-neutral-50 p-6 md:p-10">
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
              className="flex items-center justify-between rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100">

                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-50">
                      <Layers size={16} className="text-gray-400" />
                    </div>
                  )}

                </div>
                <div>
                  <p className="text-sm font-black tracking-tight text-black">{cat.name}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    {cat._count.products} products
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">

                <CategoryForm category={cat} />

                <DeleteCategoryButton
                  categoryId={cat.id}
                />

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}