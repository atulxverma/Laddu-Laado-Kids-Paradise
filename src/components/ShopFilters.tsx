"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"

export default function ShopFilters({
  categories,
  activeCategory,
}: {
  categories: { id: string; name: string }[]
  activeCategory?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const setCategory = (cat?: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (cat) {
      params.set("category", cat)
    } else {
      params.delete("category")
    }
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setCategory()}
        className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
          !activeCategory
            ? "bg-black text-white"
            : "border border-gray-200 text-gray-500 hover:bg-gray-50"
        }`}
      >
        All
      </motion.button>
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCategory(cat.name)}
          className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            activeCategory?.toLowerCase() === cat.name.toLowerCase()
              ? "bg-black text-white"
              : "border border-gray-200 text-gray-500 hover:bg-gray-50"
          }`}
        >
          {cat.name}
        </motion.button>
      ))}
    </div>
  )
}