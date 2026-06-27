"use client"

import { useState } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { ImagePlus, Trash2, X, Baby, Venus, Package } from "lucide-react"
import { createProduct } from "@/lib/actions"

export default function ProductForm({ categories }: { categories: any[] }) {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "", description: "", price: "",
    categoryId: "", size: "", color: "",
    gender: "Unisex", ageGroup: "2-4Y", stock: "10"
  })

  const [customDetails, setCustomDetails] = useState<{key: string, value: string}[]>([])

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
    
    const finalDescription = `${form.description}\n\nGender: ${form.gender}\nAge: ${form.ageGroup}\n${customDetails.map(d => `${d.key}: ${d.value}`).join("\n")}`
    
    const res = await createProduct({ ...form, description: finalDescription, images })
    
    if (res.success) {
      alert("Product published successfully!")
      window.location.reload()
    } else {
      alert(res.error) // Yeh ab sahi error batayega
    }
    setLoading(false)
  }

  const inputStyle = "w-full border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-all bg-gray-50/30 font-medium"

  return (
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

      <input required placeholder="Product Title" value={form.name} className={inputStyle} onChange={(e) => setForm({...form, name: e.target.value})} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-gray-400">Price ₹</label>
          <input required type="number" value={form.price} placeholder="999" className={inputStyle} onChange={(e) => setForm({...form, price: e.target.value})} />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1"><Package size={10}/> Stock</label>
          <input required type="number" value={form.stock} className={inputStyle} onChange={(e) => setForm({...form, stock: e.target.value})} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <select required className={inputStyle} value={form.gender} onChange={(e) => setForm({...form, gender: e.target.value})}>
          <option value="Unisex">Unisex</option>
          <option value="Boy">Boy</option>
          <option value="Girl">Girl</option>
        </select>
        <select required className={inputStyle} value={form.ageGroup} onChange={(e) => setForm({...form, ageGroup: e.target.value})}>
          <option value="0-2Y">0-2 Years</option>
          <option value="2-4Y">2-4 Years</option>
          <option value="4-6Y">4-6 Years</option>
          <option value="6-8Y">6-8 Years</option>
        </select>
      </div>

      <select required className={inputStyle} value={form.categoryId} onChange={(e) => setForm({...form, categoryId: e.target.value})}>
        <option value="">Select Category</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <input required placeholder="Sizes (e.g. S, M, L)" value={form.size} className={inputStyle} onChange={(e) => setForm({...form, size: e.target.value})} />

      <textarea placeholder="Description..." value={form.description} rows={3} className={`${inputStyle} resize-none`} onChange={(e) => setForm({...form, description: e.target.value})} />

      <button disabled={loading} className="w-full bg-black text-white py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all disabled:opacity-50">
        {loading ? "PUBLISHING..." : "PUBLISH PRODUCT"}
      </button>
    </form>
  )
}