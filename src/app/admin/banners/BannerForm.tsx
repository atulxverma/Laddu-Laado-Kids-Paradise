"use client"

import { useState } from "react"
import { CldUploadWidget } from "next-cloudinary"
import { ImagePlus, Trash2, CheckCircle2 } from "lucide-react"
import { upsertBanner, deleteBanner } from "@/lib/actions"

export default function BannerForm({ type, initialData }: { type: string, initialData?: any }) {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "")
  const [title, setTitle] = useState(initialData?.title || "")
  const [label, setLabel] = useState(initialData?.label || "")

  const handleSave = async () => {
    if (!imageUrl || !title) return alert("Please provide both Image and Title")
    setLoading(true)
    const res = await upsertBanner({ type, imageUrl, title, label })
    if (res.success) alert("Changes saved successfully!")
    setLoading(false)
  }

  const handleRemove = async () => {
  if (
    !confirm(
      "Are you sure you want to remove this banner?"
    )
  )
    return

  setLoading(true)

  const res = await deleteBanner(type)

  if (res.success) {
    setImageUrl("")
    setTitle("")
    setLabel("")

    alert("Banner removed successfully!")

    window.location.reload()
  } else {
    alert(res.error)
  }

  setLoading(false)
}

  return (
    <div className="space-y-6">
      {/* PREVIEW BOX */}
      <div className="relative aspect-[16/8] rounded-3xl bg-gray-50 border border-gray-100 overflow-hidden group shadow-inner">
        {imageUrl ? (
          <img src={imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Banner Preview" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold uppercase text-[10px] tracking-widest">No Media Uploaded</div>
        )}
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
          <CldUploadWidget 
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} 
            onSuccess={(res: any) => setImageUrl(res.info.secure_url)}
          >
            {({ open }) => (
              <button onClick={() => open()} className="bg-white text-black px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
                <ImagePlus size={14} /> {imageUrl ? "Replace" : "Upload"}
              </button>
            )}
          </CldUploadWidget>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-gray-400">Banner Heading</label>
          <input 
            placeholder="e.g. New Seasonal Drops" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-100 rounded-xl px-5 py-4 text-sm font-bold uppercase outline-none focus:border-black bg-gray-50/50 transition-all"
          />
        </div>

        {type === "HERO" && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-gray-400">Mini Label (Optional)</label>
            <input 
              placeholder="e.g. SPECIAL OFFER" 
              value={label} 
              onChange={(e) => setLabel(e.target.value)}
              className="w-full border border-gray-100 rounded-xl px-5 py-4 text-sm font-bold uppercase outline-none focus:border-black bg-gray-50/50 transition-all"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {loading ? "SAVING..." : <><CheckCircle2 size={14} /> Update Visuals</>}
        </button>

        {initialData && (
           <button 
             type="button"
             onClick={handleRemove}
             className="w-full text-rose-500 text-[10px] font-black uppercase tracking-widest py-3 hover:bg-rose-50 rounded-xl transition-all"
           >
             Remove Permanently
           </button>
        )}
      </div>
    </div>
  )
}