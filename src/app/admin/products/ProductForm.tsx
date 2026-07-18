"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CldUploadWidget } from "next-cloudinary"
import { ImagePlus, Trash2, X, Package, Pencil } from "lucide-react"
import { createProduct, updateProduct } from "@/lib/actions"
import { createPortal } from "react-dom"

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
  size: "",
  color: "",
  gender: "Newborn",
  stock: "10",
  ageGroup: "0-1Y",
  isNewArrival: true,
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
  const [images, setImages] = useState<string[]>(product?.images?.map((img: any) => img.url) || [])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    categoryId: product?.categoryId || "",
    size: product?.size || "",
    color: product?.color || "",
    gender: product?.gender || "Newborn",

    stock: product?.stock?.toString() || "10",
    ageGroup: product?.ageGroup || "0-1Y",
    isNewArrival: product?.isNewArrival ?? true,
  })
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
      ? await updateProduct(product.id, { ...form, description: form.description, specifications, images })
      : await createProduct({ ...form, description: form.description, specifications, images })

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
          {images.map((url, index) => (
            <div key={url} className="relative h-24 w-20 overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
              <img src={url} className="h-full w-full object-cover" alt="" />
              <button type="button" onClick={() => setImages((currentImages) => currentImages.filter((_, imageIndex) => imageIndex !== index))} aria-label="Remove image" className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white shadow-lg">
                <X size={10} />
              </button>
            </div>
          ))}

          <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} onSuccess={(result: any) => {
            const imageUrl = result?.info?.secure_url
            if (imageUrl) setImages((currentImages) => [...currentImages, imageUrl])
          }}>
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

        <div className="space-y-1.5">
          <label className="flex items-center gap-1 text-[10px] font-black uppercase text-gray-400">
            <Package size={10} />
            Stock Quantity
          </label>
          <input required type="number" value={form.stock} className={inputStyle} onChange={(event) => setForm({ ...form, stock: event.target.value })} />
        </div>
      </div>

      <select required className={inputStyle} value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })}>
        <option value="Newborn">Newborn</option>
        <option value="Boy">Boys</option>
        <option value="Girl">Girls</option>
      </select>
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase text-gray-400">
          Age Group
        </label>

        <select
          className={inputStyle}
          value={form.ageGroup}
          onChange={(e) =>
            setForm({
              ...form,
              ageGroup: e.target.value,
            })
          }
        >
          <option value="0-1Y">0-1 Years</option>
          <option value="1-2Y">1-2 Years</option>
          <option value="2-3Y">2-3 Years</option>
          <option value="3-4Y">3-4 Years</option>
          <option value="4-5Y">4-5 Years</option>
          <option value="5-6Y">5-6 Years</option>
          <option value="6-7Y">6-7 Years</option>
          <option value="7-8Y">7-8 Years</option>
          <option value="8-9Y">8-9 Years</option>
          <option value="9-10Y">9-10 Years</option>
          <option value="10-11Y">10-11 Years</option>
          <option value="11-12Y">11-12 Years</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" checked={form.isNewArrival} onChange={(event) => setForm({ ...form, isNewArrival: event.target.checked })} className="h-4 w-4" />
        <label className="text-sm font-medium">Mark as New Arrival</label>
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

      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase text-gray-400">Available Sizes</p>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
          {sizeOptions.map((size) => {
            const selectedSizes = form.size ? form.size.split(",") : []
            const checked = selectedSizes.includes(size)

            return (
              <button key={size} type="button" onClick={() => {
                const updatedSizes = checked ? selectedSizes.filter((selectedSize) => selectedSize !== size) : [...selectedSizes, size]
                setForm({ ...form, size: updatedSizes.join(",") })
              }} className={`h-10 sm:h-12 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all ${checked ? "border-black bg-black text-white" : "border-gray-200 bg-white"}`}>
                {size}
              </button>
            )
          })}
        </div>
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