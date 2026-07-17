"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { deleteProduct } from "@/lib/actions"

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!confirm("Delete this product?")) return

    setLoading(true)

    try {
      const response = await deleteProduct(productId)

      if (response?.error) {
        alert(response.error)
        return
      }

      alert("Product deleted successfully")
      router.refresh()
    } catch {
      alert("Something went wrong while deleting the product.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={handleDelete} disabled={loading} aria-label="Delete product" className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60">
      {loading ? <span className="text-[10px] text-gray-400">...</span> : <Trash2 size={13} className="text-red-500" />}
    </button>
  )
}