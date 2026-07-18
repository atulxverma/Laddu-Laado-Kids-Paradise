"use client"

import { useState } from "react"
import { createCategory, updateCategory } from "@/lib/actions"
import { Plus, X, Pencil } from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"
import { ImagePlus } from "lucide-react"

interface Category {
  id: string
  name: string
  imageUrl?: string
  showOnHome?: boolean
}

export default function CategoryForm({
  category,
}: {
  category?: Category
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(category?.name || "")
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(
    category?.imageUrl || ""
  )

  const [showOnHome, setShowOnHome] = useState(
    category?.showOnHome ?? true
  )

  const isEdit = !!category

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    setLoading(true)

    const res = isEdit
      ? await updateCategory(
        category.id,
        name.trim(),
        imageUrl,
        showOnHome
      )
      : await createCategory(
        name.trim(),
        imageUrl,
        showOnHome
      )

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
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl mx-4">

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

              {/* IMAGE UPLOAD */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Category Thumbnail
                </label>

                <div className="flex gap-3 items-center">

                  {imageUrl && (
                    <img
                      src={imageUrl}
                      className="h-20 w-20 rounded-2xl object-cover border"
                      alt=""
                    />
                  )}

                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    onSuccess={(result: any) =>
                      setImageUrl(result.info.secure_url)
                    }
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 transition hover:border-black"
                      >
                        <ImagePlus />
                      </button>
                    )}
                  </CldUploadWidget>

                </div>
              </div>

              <div className="flex items-center gap-3">

                <input
                  type="checkbox"
                  checked={showOnHome}
                  onChange={(e) => setShowOnHome(e.target.checked)}
                  className="h-4 w-4 accent-black"
                />

                <label>
                  Show on Home Page
                </label>

              </div>

              {/* BUTTON HAMESHA LAST */}
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