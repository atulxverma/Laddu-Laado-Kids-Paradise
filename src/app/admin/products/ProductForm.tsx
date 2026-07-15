"use client"

import { useState } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { ImagePlus, Trash2, X, Package, Pencil } from "lucide-react"
import { createProduct, updateProduct } from "@/lib/actions"

const sizeOptions = [
  "0-2Y",
  "2-4Y",
  "4-6Y",
  "6-8Y",
  "8-10Y",
  "10-12Y",
  "12-14Y",
]

export default function ProductForm({
  categories,
  product,
}: {
  categories: any[]
  product?: any
}) {
  const [images, setImages] = useState<string[]>(
    product?.images?.map((img: any) => img.url) || []
  )
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
    ageGroup: product?.ageGroup || "0-2Y",
    isNewArrival: product?.isNewArrival ?? true,
  })

  const [customDetails, setCustomDetails] = useState(
    product?.specifications || [
      { key: "", value: "" }
    ]
  )

  const addDetail = () => setCustomDetails([...customDetails, { key: "", value: "" }])
  const removeDetail = (index: number) => setCustomDetails(customDetails.filter((_, i) => i !== index))
  const updateDetail = (index: number, field: "key" | "value", val: string) => {
    const newDetails = [...customDetails]
    newDetails[index][field] = val
    setCustomDetails(newDetails)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (images.length === 0) return alert("Please upload images first")
    setLoading(true)

    const specifications = customDetails.filter(
      d => d.key && d.value
    )

    const res = product
      ? await updateProduct(product.id, {
        ...form,
        description: form.description,
        specifications,
        images,
      })
      : await createProduct({
        ...form,
        description: form.description,
        specifications,
        images,
      })

    if (res.success) {
      alert(
        product
          ? "Product updated successfully!"
          : "Product published successfully!"
      )
      window.location.reload()
    } else {
      alert(res.error) // Yeh ab sahi error batayega
    }
    setLoading(false)
  }

  const inputStyle = "w-full border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-all bg-gray-50/30 font-medium"

  // const isEdit = !!product
  const [open, setOpen] = useState(!product)
  if (product && !open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-2 rounded-full bg-white hover:bg-gray-100 shadow"
      >
        <Pencil size={14} />
      </button>
    )
  }

  return (
    <>
      {!product && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Media */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase text-gray-400">Media</p>
            <div className="flex flex-wrap gap-3">
              {images.map((url, i) => (
                <div key={i} className="relative h-24 w-20 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <img src={url} className="h-full w-full object-cover" alt="" />
                  <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-lg"><X size={10} /></button>
                </div>
              ))}
              <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} onSuccess={(res: any) => setImages([...images, res.info.secure_url])}>
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="h-24 w-20 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-300 hover:border-black hover:text-black transition-all">
                    <ImagePlus size={20} /><span className="text-[9px] mt-1 font-bold">ADD</span>
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>

          <input required placeholder="Product Title" value={form.name} className={inputStyle} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400">Price ₹</label>
              <input required type="number" value={form.price} placeholder="999" className={inputStyle} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1"><Package size={10} /> <span
                className={`text-[10px] font-black uppercase ${(product?.stock ?? 0) > 0 ? "text-emerald-500" : "text-red-500"
                  }`}
              >
                {(product?.stock ?? 0) > 0 ? "In Stock" : "Sold Out"}
              </span></label>
              <input required type="number" value={form.stock} className={inputStyle} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.isNewArrival}
              onChange={(e) =>
                setForm({
                  ...form,
                  isNewArrival: e.target.checked,
                })
              }
              className="h-4 w-4"
            />

            <label className="text-sm font-medium">
              Mark as New Arrival
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select required className={inputStyle} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="Newborn">Newborn</option>
              <option value="Boy">Boys</option>
              <option value="Girl">Girls</option>
            </select>

          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase text-gray-400">
              Category
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => {
                const active = form.categoryId === cat.id

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        categoryId: cat.id,
                      })
                    }
                    className={`h-14 rounded-2xl border-2 transition-all font-bold text-sm ${active
                      ? "bg-black text-white border-black"
                      : "bg-white border-gray-200 hover:border-black"
                      }`}
                  >
                    {cat.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase text-gray-400">
              Available Sizes
            </p>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">

              {sizeOptions.map((size) => {
                const selectedSizes = form.size
                  ? form.size.split(",")
                  : []

                const checked = selectedSizes.includes(size)

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      let updatedSizes

                      if (checked) {
                        updatedSizes = selectedSizes.filter(
                          (s) => s !== size
                        )
                      } else {
                        updatedSizes = [...selectedSizes, size]
                      }

                      setForm({
                        ...form,
                        size: updatedSizes.join(","),
                      })
                    }}
                    className={`h-12 rounded-xl border-2 font-bold transition-all ${checked
                      ? "bg-black text-white border-black"
                      : "border-gray-200 bg-white"
                      }`}
                  >
                    {size}
                  </button>
                )
              })}

            </div>
          </div>
          <div className="space-y-4">

            <div className="flex justify-between items-center">
              <p className="text-[10px] font-black uppercase text-gray-400">
                Specifications
              </p>

              <button
                type="button"
                onClick={addDetail}
                className="px-4 py-2 rounded-full bg-black text-white text-[10px] font-bold"
              >
                Add Row
              </button>
            </div>

            {customDetails.map((detail, index) => (

              <div key={index} className="grid grid-cols-[1fr_1fr_auto] gap-3">

                <input
                  placeholder="Title (Fabric)"
                  value={detail.key}
                  className={inputStyle}
                  onChange={(e) =>
                    updateDetail(index, "key", e.target.value)
                  }
                />

                <input
                  placeholder="Value (Cotton)"
                  value={detail.value}
                  className={inputStyle}
                  onChange={(e) =>
                    updateDetail(index, "value", e.target.value)
                  }
                />

                <button
                  type="button"
                  onClick={() => removeDetail(index)}
                  className="h-12 w-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>

              </div>

            ))}
          </div>
          <textarea placeholder="Description..." value={form.description} rows={3} className={`${inputStyle} resize-none`} onChange={(e) => setForm({ ...form, description: e.target.value })} />


          <button disabled={loading} className="w-full bg-black text-white py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all disabled:opacity-50">
            {
              loading
                ? "SAVING..."
                : product
                  ? "UPDATE PRODUCT"
                  : "PUBLISH PRODUCT"
            }
          </button>
        </form>
      )}

      {product && open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 relative">

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <X size={18} />
            </button>

            <h2 className="text-2xl font-black mb-8">
              Edit Product
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Media */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-gray-400">
                  Media
                </p>

                <div className="flex flex-wrap gap-3">
                  {images.map((url, i) => (
                    <div
                      key={i}
                      className="relative h-24 w-20 rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                    >
                      <img
                        src={url}
                        className="h-full w-full object-cover"
                        alt=""
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setImages(images.filter((_, idx) => idx !== i))
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}

                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                    onSuccess={(res: any) =>
                      setImages([...images, res.info.secure_url])
                    }
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="h-24 w-20 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center"
                      >
                        <ImagePlus size={20} />
                      </button>
                    )}
                  </CldUploadWidget>
                </div>
              </div>

              <input
                required
                placeholder="Product Title"
                value={form.name}
                className={inputStyle}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  type="number"
                  value={form.price}
                  placeholder="999"
                  className={inputStyle}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                />

                <input
                  required
                  type="number"
                  value={form.stock}
                  className={inputStyle}
                  onChange={(e) =>
                    setForm({ ...form, stock: e.target.value })
                  }
                />
              </div>

              <select
                required
                className={inputStyle}
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value })
                }
              >
                <option value="Newborn">Newborn</option>
                <option value="Boy">Boys</option>
                <option value="Girl">Girls</option>
              </select>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.isNewArrival}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isNewArrival: e.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />

                <label className="text-sm font-medium">
                  Mark as New Arrival
                </label>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-gray-400">
                  Category
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((cat) => {
                    const active = form.categoryId === cat.id

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            categoryId: cat.id,
                          })
                        }
                        className={`h-14 rounded-2xl border-2 transition-all font-bold text-sm ${active
                          ? "bg-black text-white border-black"
                          : "bg-white border-gray-200 hover:border-black"
                          }`}
                      >
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-gray-400">
                  Available Sizes
                </p>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">

                  {sizeOptions.map((size) => {
                    const selectedSizes = form.size
                      ? form.size.split(",")
                      : []

                    const checked = selectedSizes.includes(size)

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          let updatedSizes

                          if (checked) {
                            updatedSizes = selectedSizes.filter(
                              (s) => s !== size
                            )
                          } else {
                            updatedSizes = [...selectedSizes, size]
                          }

                          setForm({
                            ...form,
                            size: updatedSizes.join(","),
                          })
                        }}
                        className={`h-12 rounded-xl border-2 font-bold transition-all ${checked
                          ? "bg-black text-white border-black"
                          : "border-gray-200 bg-white"
                          }`}
                      >
                        {size}
                      </button>
                    )
                  })}

                </div>
              </div>
              <div className="space-y-4">

                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase text-gray-400">
                    Specifications
                  </p>

                  <button
                    type="button"
                    onClick={addDetail}
                    className="px-4 py-2 rounded-full bg-black text-white text-[10px] font-bold"
                  >
                    Add Row
                  </button>
                </div>

                {customDetails.map((detail, index) => (

                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_auto] gap-3"
                  >

                    <input
                      placeholder="Title (Fabric)"
                      value={detail.key}
                      className={inputStyle}
                      onChange={(e) =>
                        updateDetail(index, "key", e.target.value)
                      }
                    />

                    <input
                      placeholder="Value (Cotton)"
                      value={detail.value}
                      className={inputStyle}
                      onChange={(e) =>
                        updateDetail(index, "value", e.target.value)
                      }
                    />

                    <button
                      type="button"
                      onClick={() => removeDetail(index)}
                      className="h-12 w-12 rounded-xl bg-red-50 text-red-500 flex items-center justify-center"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                ))}
              </div>
              <textarea
                value={form.description}
                rows={4}
                className={inputStyle}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <button
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-full"
              >
                {loading ? "Saving..." : "Update Product"}
              </button>

            </form>
          </div>
        </div>
      )}
    </>
  )
}