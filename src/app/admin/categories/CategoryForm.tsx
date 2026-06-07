"use client"

import { useState } from "react"
import { createCategory } from "@/lib/actions"
import { Plus, X } from "lucide-react"

export default function CategoryForm() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    const res = await createCategory(name.trim())
    if (res.success) {
      setName("")
      setOpen(false)
    } else {
      alert(res.error)
    }
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
      >
        <Plus size={14} />
        Add Category
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 w-full max-w-sm mx-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-base">New Category</h2>
              <button
                onClick={() => setOpen(false)}
                className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1.5">
                  Category Name
                </label>
                <input
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Summer Wear"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-black placeholder:text-gray-300 outline-none focus:border-black transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-40"
              >
                {loading ? "Creating..." : "Create Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}