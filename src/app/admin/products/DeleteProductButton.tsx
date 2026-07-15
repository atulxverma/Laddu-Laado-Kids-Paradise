"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { deleteProduct } from "@/lib/actions"

export default function DeleteProductButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()

  if (!confirm("Delete this product?")) return

  setLoading(true)

  try {
    const res = await deleteProduct(productId)

    if (res?.error) {
      alert(res.error)
      return
    }

    alert("Product deleted successfully")
  } catch {
    alert("Something went wrong while deleting the product.")
  } finally {
    setLoading(false)
  }
}

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
    >
      {loading ? (
        <span className="text-[10px] text-gray-400">...</span>
      ) : (
        <Trash2 size={13} className="text-red-500" />
      )}
    </button>
  )
}