"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CldUploadWidget } from "next-cloudinary"
import { ImagePlus, Trash2, X, Package, Pencil } from "lucide-react"
import { createProduct, updateProduct } from "@/lib/actions"
import { createPortal } from "react-dom"
import { Sparkles, Flame, Crown } from "lucide-react";

const sizeOptions = [
  "0-1Y",
  "1-2Y",
  "2-3Y",
  "3-4Y",
  "4-5Y",
  "5-6Y",
  "6-7Y",
  "7-8Y",
  "8-9Y",
  "9-10Y",
  "10-11Y",
  "11-12Y",
]
const createEmptyForm = () => ({
  name: "",
  description: "",
  price: "",
  categoryId: "",
  color: "",
  gender: "Newborn",
  isNewArrival: true,
  isTrending: false,
  isExclusive: false,
})

export default function ProductForm({
  categories,
  product,
}: {
  categories: any[]
  product?: any
}) {
  const router = useRouter()
  const isEdit = Boolean(product)
  const [open, setOpen] = useState(!isEdit)
  const [images, setImages] = useState<
    {
      id: string
      url: string
      order: number
    }[]
  >(
    product?.images?.map((img: any, index: number) => ({
      id: img.id ?? crypto.randomUUID(),
      url: img.url,
      order: index,
    })) || []
  )
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    categoryId: product?.categoryId || "",
    color: product?.color || "",
    gender: product?.gender || "Newborn",
    isNewArrival: product?.isNewArrival ?? true,
    isTrending: product?.isTrending ?? false,
    isExclusive: product?.isExclusive ?? false,
  })

  const [variants, setVariants] = useState(
    product?.variants?.length
      ? product.variants
      : []
  )
  const [customDetails, setCustomDetails] = useState(product?.specifications || [{ key: "", value: "" }])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const inputStyle = "w-full rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-3 text-sm font-medium outline-none transition-all focus:border-black"

  const addDetail = () => setCustomDetails((details: { key: string; value: string }[]) => [...details, { key: "", value: "" }])

  const removeDetail = (index: number) => {
    setCustomDetails((details: { key: string; value: string }[]) => details.filter((_, detailIndex) => detailIndex !== index))
  }

  const updateDetail = (index: number, field: "key" | "value", value: string) => {
    setCustomDetails((details: { key: string; value: string }[]) => details.map((detail, detailIndex) => detailIndex === index ? { ...detail, [field]: value } : detail))
  }

  const closeModal = () => {
    if (!loading) setOpen(false)
  }

  const resetCreateForm = () => {
    setImages([])
    setForm(createEmptyForm())
    setCustomDetails([{ key: "", value: "" }])
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (images.length === 0) {
      alert("Please upload images first")
      return
    }

    setLoading(true)

    const specifications = customDetails.filter((detail: { key: string; value: string }) => detail.key && detail.value)

    const response = product
      ? await updateProduct(product.id, {
        ...form,
        variants,
        description: form.description,
        specifications,
        images: images
          .sort((a, b) => a.order - b.order)
          .map((i) => i.url),
      })
      : await createProduct({
        ...form,
        variants,
        description: form.description,
        specifications,
        images: images
          .sort((a, b) => a.order - b.order)
          .map((i) => i.url),
      })

    if (response.success) {
      alert(product ? "Product updated successfully!" : "Product published successfully!")

      if (product) {
        setOpen(false)
      } else {
        resetCreateForm()
      }

      router.refresh()
    } else {
      alert(response.error)
    }

    setLoading(false)
  }

  const editorForm = (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase text-gray-400">Media</p>

        <div className="flex flex-wrap gap-3">
          {images.map((image, index) => (
            <div key={image.id} className="relative h-24 w-20 overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
              <img src={image.url} className="h-full w-full object-cover" alt="" />
              <button type="button" onClick={() => setImages((currentImages) => currentImages.filter((_, imageIndex) => imageIndex !== index))} aria-label="Remove image" className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white shadow-lg">
                <X size={10} />
              </button>
            </div>
          ))}

          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onSuccess={(result: any) => {
              const imageUrl = result?.info?.secure_url

              if (!imageUrl) return

              setImages((currentImages) => [
                ...currentImages,
                {
                  id: crypto.randomUUID(),
                  url: imageUrl,
                  order: currentImages.length,
                },
              ])
            }}
          >
            {({ open: openUpload }) => (
              <button type="button" onClick={() => openUpload()} className="flex h-24 w-20 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-100 text-gray-300 transition-all hover:border-black hover:text-black">
                <ImagePlus size={20} />
                <span className="mt-1 text-[9px] font-bold">ADD</span>
              </button>
            )}
          </CldUploadWidget>
        </div>
      </div>

      <input required placeholder="Product Title" value={form.name} className={inputStyle} onChange={(event) => setForm({ ...form, name: event.target.value })} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-gray-400">Price ₹</label>
          <input required type="number" value={form.price} placeholder="999" className={inputStyle} onChange={(event) => setForm({ ...form, price: event.target.value })} />
        </div>


      </div>

      <select
        required
        className={inputStyle}
        value={form.gender}
        onChange={(event) =>
          setForm({ ...form, gender: event.target.value })
        }
      >
        <option value="Newborn">Newborn</option>
        <option value="Boy">Boys</option>
        <option value="Girl">Girls</option>
      </select>


      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
          Collections
        </p>

        <div className="space-y-3">

          {/* New Arrival */}
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                isNewArrival: !form.isNewArrival,
              })
            }
            className="w-full rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-black hover:shadow-sm"
          >
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-neutral-100 p-2">
                  <Sparkles size={18} />
                </div>

                <div className="text-left">
                  <h4 className="font-bold">New Arrival</h4>
                  <p className="text-xs text-gray-500">
                    Show in New Arrival section
                  </p>
                </div>
              </div>

              <div
                className={`relative h-7 w-12 rounded-full transition ${form.isNewArrival ? "bg-black" : "bg-gray-300"
                  }`}
              >
                <div
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${form.isNewArrival ? "left-6" : "left-1"
                    }`}
                />
              </div>

            </div>
          </button>

          {/* Trending */}
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                isTrending: !form.isTrending,
              })
            }
            className="w-full rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-black hover:shadow-sm"
          >
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-neutral-100 p-2">
                  <Flame size={18} />
                </div>

                <div className="text-left">
                  <h4 className="font-bold">Trending</h4>
                  <p className="text-xs text-gray-500">
                    Show in Trending Collection
                  </p>
                </div>
              </div>

              <div
                className={`relative h-7 w-12 rounded-full transition ${form.isTrending ? "bg-black" : "bg-gray-300"
                  }`}
              >
                <div
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${form.isTrending ? "left-6" : "left-1"
                    }`}
                />
              </div>

            </div>
          </button>

          {/* Exclusive */}
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                isExclusive: !form.isExclusive,
              })
            }
            className="w-full rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-black hover:shadow-sm"
          >
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-neutral-100 p-2">
                  <Crown size={18} />
                </div>

                <div className="text-left">
                  <h4 className="font-bold">Exclusive</h4>
                  <p className="text-xs text-gray-500">
                    Premium Collection
                  </p>
                </div>
              </div>

              <div
                className={`relative h-7 w-12 rounded-full transition ${form.isExclusive ? "bg-black" : "bg-gray-300"
                  }`}
              >
                <div
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${form.isExclusive ? "left-6" : "left-1"
                    }`}
                />
              </div>

            </div>
          </button>

        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase text-gray-400">Category</p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {categories.map((category) => {
            const active = form.categoryId === category.id

            return (
              <button key={category.id} type="button" onClick={() => setForm({ ...form, categoryId: category.id })} className={`h-11 sm:h-14 rounded-xl sm:rounded-2xl border-2 text-xs sm:text-sm font-bold transition-all ${active ? "border-black bg-black text-white" : "border-gray-200 bg-white hover:border-black"}`}>
                {category.name}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-black uppercase text-gray-400">
          Size Inventory
        </p>

        {sizeOptions.map((size) => {
          const variant = variants.find((v: any) => v.size === size)

          return (
            <div
              key={size}
              className="flex items-center gap-3"
            >
              <input
                type="checkbox"
                checked={!!variant}
                onChange={(e) => {
                  if (e.target.checked) {
                    setVariants([
                      ...variants,
                      {
                        size,
                        stock: 0
                      }
                    ])
                  } else {
                    setVariants(
                      variants.filter((v: any) => v.size !== size)
                    )
                  }
                }}
              />

              <div className="w-20 font-semibold">
                {size}
              </div>

              {variant && (
                <input
                  type="number"
                  min={0}
                  className={inputStyle}
                  value={variant.stock}
                  onChange={(e) => {
                    setVariants(
                      variants.map((v: any) =>
                        v.size === size
                          ? {
                            ...v,
                            stock: Number(e.target.value)
                          }
                          : v
                      )
                    )
                  }}
                  placeholder="Stock"
                />
              )}
            </div>
          )
        })}

      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase text-gray-400">Specifications</p>
          <button type="button" onClick={addDetail} className="rounded-full bg-black px-4 py-2 text-[10px] font-bold text-white">Add Row</button>
        </div>

        {customDetails.map((detail: { key: string; value: string }, index: number) => (
          <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-3">
            <input placeholder="Title (Fabric)" value={detail.key} className={inputStyle} onChange={(event) => updateDetail(index, "key", event.target.value)} />
            <input placeholder="Value (Cotton)" value={detail.value} className={inputStyle} onChange={(event) => updateDetail(index, "value", event.target.value)} />
            <button type="button" onClick={() => removeDetail(index)} aria-label="Remove specification" className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <textarea placeholder="Description..." value={form.description} rows={isEdit ? 4 : 3} className={`${inputStyle} resize-none`} onChange={(event) => setForm({ ...form, description: event.target.value })} />

      <button disabled={loading} className="w-full rounded-full bg-black py-3 sm:py-4 text-[11px] sm:text-xs text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all active:scale-95 disabled:opacity-50">
        {loading ? "Saving..." : isEdit ? "Update Product" : "Publish Product"}
      </button>
    </form>
  )

  if (!isEdit) return editorForm

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Edit ${product.name}`}
        className="relative z-50 flex h-7 w-7 items-center justify-center rounded-full bg-white text-neutral-800 shadow-md transition hover:bg-gray-100 sm:h-8 sm:w-8"
      >
        <Pencil size={14} />
      </button>
    )
  }

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={closeModal}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-product-title"
        onMouseDown={(event) => event.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white p-5 sm:p-7 lg:p-8 shadow-2xl"
      >
        <button
          type="button"
          onClick={closeModal}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <X size={18} />
        </button>

        <h2
          id="edit-product-title"
          className="mb-8 text-2xl font-black"
        >
          Edit Product
        </h2>

        {editorForm}
      </div>
    </div>,
    document.body
  )
}