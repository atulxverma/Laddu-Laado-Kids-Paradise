"use client"

import { useState } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { ImagePlus, Trash2, Plus, X, Baby, VenusMars } from "lucide-react"
import { createProduct } from "@/lib/actions"

export default function ProductForm({ categories }: { categories: any[] }) {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "", description: "", price: "",
    categoryId: "", size: "", color: "",
    gender: "Unisex", // New Field
    ageGroup: "2-4Y"  // New Field
  })

  const [customDetails, setCustomDetails] = useState<{key: string, value: string}[]>([])

  const addDetail = () => setCustomDetails([...customDetails, { key: "", value: "" }])
  const removeDetail = (index: number) => setCustomDetails(customDetails.filter((_, i) => i !== index))
  const updateDetail = (index: number, field: 'key' | 'value', val: string) => {
    const newDetails = [...customDetails]
    newDetails[index][field] = val
    setCustomDetails(newDetails)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (images.length === 0) return alert("Please upload images")
    setLoading(true)
    
    // Sab kuch description mein ya alag se save kar sakte ho
    const finalDescription = `${form.description}\n\nGender: ${form.gender}\nAge: ${form.ageGroup}\n${customDetails.map(d => `${d.key}: ${d.value}`).join('\n')}`
    
    const res = await createProduct({ ...form, description: finalDescription, images })
    if (res.success) {
      alert("Product published successfully!")
      window.location.reload()
    }
    setLoading(false)
  }

  const inputStyle = "w-full border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-black transition-all bg-gray-50/30"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Media */}
      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Media Gallery</p>
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div key={i} className="relative h-24 w-20 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
              <img src={url} className="h-full w-full object-cover" alt="" />
              <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-lg">
                <X size={10} />
              </button>
            </div>
          ))}
          <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} onSuccess={(res: any) => setImages([...images, res.info.secure_url])}>
            {({ open }) => (
              <button type="button" onClick={() => open()} className="h-24 w-20 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-300 hover:border-black hover:text-black hover:bg-gray-50 transition-all">
                <ImagePlus size={20} />
                <span className="text-[9px] mt-1 font-bold">ADD</span>
              </button>
            )}
          </CldUploadWidget>
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 gap-4">
        <input required placeholder="Product Title (e.g. Velvet Party Dress)" className={inputStyle} onChange={(e) => setForm({...form, name: e.target.value})} />
        <textarea placeholder="Describe the product, material, fit..." rows={3} className={`${inputStyle} resize-none`} onChange={(e) => setForm({...form, description: e.target.value})} />
      </div>

      {/* Gender & Age (KIDS SPECIAL) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1.5"><VenusMars size={10}/> Gender</label>
          <select className={inputStyle} onChange={(e) => setForm({...form, gender: e.target.value})}>
            <option value="Unisex">Unisex / Both</option>
            <option value="Boy">Baby Boy</option>
            <option value="Girl">Baby Girl</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-1.5"><Baby size={10}/> Age Group</label>
          <select className={inputStyle} onChange={(e) => setForm({...form, ageGroup: e.target.value})}>
            <option value="0-2Y">0-2 Years</option>
            <option value="2-4Y">2-4 Years</option>
            <option value="4-6Y">4-6 Years</option>
            <option value="6-8Y">6-8 Years</option>
            <option value="8-10Y">8-10 Years</option>
          </select>
        </div>
      </div>

      {/* Price & Category */}
      <div className="grid grid-cols-2 gap-4">
        <input required type="number" placeholder="Price ₹" className={inputStyle} onChange={(e) => setForm({...form, price: e.target.value})} />
        <select required className={inputStyle} onChange={(e) => setForm({...form, categoryId: e.target.value})}>
          <option value="">Select Category</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Dynamic Sizes */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase text-gray-400">Available Sizes (Separate with comma)</label>
        <input required placeholder="e.g. 2-4Y, 4-6Y, S, M" className={inputStyle} onChange={(e) => setForm({...form, size: e.target.value})} />
        <p className="text-[9px] text-gray-400 italic">Jo size tum yahan likhoge, sirf wahi shop pe dikhenge.</p>
      </div>

      {/* Extra Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-black uppercase text-gray-400">Custom Specifications</p>
          <button type="button" onClick={addDetail} className="text-[10px] font-bold text-black border border-black px-2 py-1 rounded-md hover:bg-black hover:text-white transition-all">+ ADD FIELD</button>
        </div>
        {customDetails.map((detail, index) => (
          <div key={index} className="flex gap-2">
            <input placeholder="Fabric" className={`${inputStyle} py-2`} value={detail.key} onChange={(e) => updateDetail(index, 'key', e.target.value)} />
            <input placeholder="100% Cotton" className={`${inputStyle} py-2`} value={detail.value} onChange={(e) => updateDetail(index, 'value', e.target.value)} />
            <button type="button" onClick={() => removeDetail(index)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>

      <button disabled={loading} className="w-full bg-black text-white py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all disabled:opacity-50">
        {loading ? "SAVING TO DATABASE..." : "PUBLISH PRODUCT"}
      </button>
    </form>
  )
}