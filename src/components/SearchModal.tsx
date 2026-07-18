"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const genderFilters = [
  "Newborn",
  "Boy",
  "Girl",
]

const allFilters = ["All", ...genderFilters]

const trendingSearches = [
  "Party Wear",
  "Ethnic Wear",
  "Frocks",
  "Newborn Set",
  "Winter Wear",
]

export default function SearchModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [query, setQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
      setQuery("")
      setActiveFilter("All")
    }
  }, [open])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  const handleSearch = (q: string) => {
    if (!q.trim()) return

    const params = new URLSearchParams()

    params.set("q", q.trim())

    if (activeFilter !== "All") {
      params.set("gender", activeFilter)
    }

    onClose()
    router.push(`/shop?${params.toString()}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto p-4"
          >
            <div className="w-full max-w-3xl rounded-[32px] border border-neutral-200 bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

              {/* Input */}
              <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                  <Search size={20} className="text-gray-400 shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for products, categories..."
                    className="flex-1 text-base md:text-lg font-medium text-black placeholder:text-neutral-300 outline-none bg-transparent"
                  />
                 
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={15} />
                    </button>
                  )}
                  <button
  type="button"
  onClick={onClose}
  className="
    flex h-9 w-9 md:h-auto md:w-auto
    items-center justify-center
    rounded-full border border-neutral-200
    md:px-4 md:py-2
    text-neutral-500
    hover:bg-neutral-100
    transition-all
  "
>
  <X className="h-4 w-4 md:hidden" />

  <span className="hidden md:block text-xs font-bold uppercase tracking-wider">
    Close
  </span>
</button>
                </div>
              </form>

              {/* Filters */}
              <div className="flex items-center gap-2 px-5 py-2.5 border-b border-gray-50 overflow-x-auto no-scrollbar">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 shrink-0">
                  Filter:
                </span>
                {allFilters.map((f) => (
                  <motion.button
                    key={f}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveFilter(f)}
                    className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${activeFilter === f
                        ? "bg-black text-white"
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                  >
                    {f}
                  </motion.button>
                ))}
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5">
                {query.trim() ? (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                      Press Enter to Search
                    </p>
                    <button
                      onClick={() => handleSearch(query)}
                      className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-neutral-50 hover:-translate-y-1 hover:shadow-md transition-colors text-left group"
                    >
                      <div className="h-8 w-8 bg-black rounded-xl flex items-center justify-center shrink-0">
                        <Search size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-black">
                          Search results for &quot;{query}&quot;
                        </p>
                        {activeFilter !== "All" && (
                          <p className="text-xs text-gray-400">in {activeFilter}</p>
                        )}
                      </div>
                      <span className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors">
                        →
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Trending */}
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                        <TrendingUp size={10} />
                        Popular Searches
                      </p>
                      <div className="space-y-0.5">
                        {trendingSearches.map((term, i) => (
                          <motion.button
                            key={term}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            onClick={() => handleSearch(term)}
                            className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-neutral-50 hover:translate-x-1 hover:bg-neutral-100 transition-colors text-left group"
                          >
                            <div className="h-7 w-7 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-gray-200 transition-colors">
                              <TrendingUp size={11} className="text-gray-400" />
                            </div>
                            <span className="text-sm text-gray-700 font-medium">
                              {term}
                            </span>
                            <span className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors text-xs">
                              →
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                        Explore Collections
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {genderFilters.map((cat) => (
                          <Link
                            key={cat}
                            href={`/shop?gender=${cat}`}
                            onClick={onClose}
                            className="flex items-center gap-2 p-4 rounded-xl border border-neutral-200 hover:border-gray-200 hover:bg-neutral-50 hover:translate-x-1 hover:bg-neutral-100 transition-all group"
                          >
                            <span className="text-sm font-medium text-gray-700 group-hover:text-black transition-colors">
                              {cat}
                            </span>
                            <span className="ml-auto text-gray-300 group-hover:text-gray-500 text-xs">
                              →
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="border-t border-neutral-100 bg-neutral-50 px-6 py-5">

                <p className="text-[10px] uppercase tracking-[0.22em] font-black text-neutral-400">
                  Need Inspiration?
                </p>

                <h2 className="mt-2 text-xl font-black">
                  Find Your Perfect Outfit
                </h2>

                <p className="mt-2 text-sm text-neutral-500">
                  Explore our newest arrivals and trending collections.
                </p>

                <Link
                  href="/shop?new=true"
                  onClick={onClose}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-white hover:-translate-y-1 transition-all"
                >
                  New Arrivals →
                </Link>

              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}