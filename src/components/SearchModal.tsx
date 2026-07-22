"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  getSearchSuggestions,
} from "@/lib/actions";

const genderFilters = [
  "Newborn",
  "Boy",
  "Girl",
]

const allFilters = ["All", ...genderFilters]


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
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (!open) return;

    const loadCategories = async () => {
      try {
        const res = await fetch("/api/search-data");

        const data = await res.json();

        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadCategories();

  }, [open]);

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

    if (activeFilter === "Newborn") {
      params.set("age", "0-1Y")
    } else if (activeFilter !== "All") {
      params.set("gender", activeFilter)
    }

    onClose()
    router.push(`/shop?${params.toString()}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);

      const data = await getSearchSuggestions(
        query,
        activeFilter
      );

      setSuggestions(data);

      setLoading(false);
    }, 250);

    return () => clearTimeout(timer);

  }, [query, activeFilter]);

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
                  <div className="space-y-2">

                    {loading && (
                      <p className="text-sm text-neutral-500">
                        Searching...
                      </p>
                    )}

                    {!loading &&
                      suggestions.map((product) => (

                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          onClick={onClose}
                          className="flex items-center gap-3 rounded-xl p-3 hover:bg-neutral-100"
                        >

                          <img
                            src={product.images[0]?.url}
                            className="w-14 h-14 rounded-lg object-cover"
                          />

                          <div className="flex-1">

                            <p className="font-semibold">
                              {product.name}
                            </p>

                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-semibold">
                                ₹{product.price}
                              </span>

                              <span className="text-xs text-neutral-400">
                                •
                              </span>

                              <span className="text-xs text-neutral-500">
                                {product.category?.name}
                              </span>
                            </div>

                          </div>

                        </Link>

                      ))}

                    {!loading && suggestions.length === 0 && (
                      <button
                        onClick={() => handleSearch(query)}
                        className="w-full rounded-xl border border-neutral-200 p-4 text-left hover:bg-neutral-100"
                      >
                        <p className="font-semibold">
                          Search "{query}"
                        </p>

                        <p className="text-xs text-neutral-500 mt-1">
                          Products • Categories • {activeFilter}
                        </p>

                        <p className="text-xs text-neutral-500 mt-1">
                          Search products & categories
                        </p>
                      </button>
                    )}

                  </div>
                ) : (
                  <div className="space-y-5">
                    {/* Trending */}

                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-1.5">
                        <TrendingUp size={10} />
                        Popular Categories
                      </p>

                      <div className="space-y-0.5 max-h-64 overflow-y-auto pr-1">
                        {categories.map((category, i) => (
                          <motion.div
                            key={category.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                          >
                            <Link
                              href={`/category/${category.slug}`}
                              onClick={onClose}
                              className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-neutral-50 hover:translate-x-1 transition-all text-left group"
                            >
                              <div className="h-7 w-7 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-gray-200 transition-colors">
                                <TrendingUp
                                  size={11}
                                  className="text-gray-400"
                                />
                              </div>

                              <span className="text-sm text-gray-700 font-medium">
                                {category.name}
                              </span>

                              <span className="ml-auto text-gray-300 group-hover:text-gray-500 text-xs">
                                →
                              </span>
                            </Link>
                          </motion.div>
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