"use client"

import { Trash2 } from "lucide-react"
import { deleteCategory } from "@/lib/actions"
import { useTransition } from "react"

export default function DeleteCategoryButton({
  categoryId,
}: {
  categoryId: string
}) {
  const [pending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm("Delete this category?")) return

    startTransition(async () => {
      const res = await deleteCategory(categoryId)

      if (res?.error) {
        alert(res.error)
      } else {
        window.location.reload()
      }
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="p-2 rounded-full hover:bg-red-50 text-red-500"
    >
      <Trash2 size={14} />
    </button>
  )
}