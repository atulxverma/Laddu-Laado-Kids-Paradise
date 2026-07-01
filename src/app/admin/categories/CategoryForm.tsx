"use client"

import { useState } from "react"
import { createCategory, updateCategory } from "@/lib/actions"
import { Plus, X, Pencil } from "lucide-react"

interface Category {
  id: string
  name: string
}

export default function CategoryForm({
  category,
}: {
  category?: Category
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(category?.name || "")
  const [loading, setLoading] = useState(false)

  const isEdit = !!category

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    setLoading(true)

    const res = isEdit
      ? await updateCategory(category.id, name.trim())
      : await createCategory(name.trim())

    if (res.success) {
      setOpen(false)
      window.location.reload()
    } else {
      alert(res.error)
    }

    setLoading(false)
  }

  return (
    <>
      {isEdit ? (
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <Pencil size={14} />
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-80"
        >
          <Plus size={14} />
          Add Category
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4">

            <div className="flex justify-between mb-5">
              <h2 className="font-bold">
                {isEdit ? "Edit Category" : "New Category"}
              </h2>

              <button onClick={() => setOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                className="w-full border rounded-xl px-4 py-3"
              />

              <button
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-full"
              >
                {loading
                  ? "Saving..."
                  : isEdit
                  ? "Update Category"
                  : "Create Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}