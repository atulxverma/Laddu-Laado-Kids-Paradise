"use client"

import { useState, useRef, useEffect } from "react"
import { updateOrderStatus } from "@/lib/actions"
import { ChevronDown, Check } from "lucide-react"

const STATUS_OPTIONS = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"]

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-600 border border-amber-200",
  Confirmed: "bg-blue-50 text-blue-600 border border-blue-200",
  Shipped: "bg-purple-50 text-purple-600 border border-purple-200",
  Delivered: "bg-emerald-50 text-emerald-600 border border-emerald-200",
  Cancelled: "bg-red-50 text-red-500 border border-red-200",
}

const DOT_COLORS: Record<string, string> = {
  Pending: "bg-amber-400",
  Confirmed: "bg-blue-400",
  Shipped: "bg-purple-400",
  Delivered: "bg-emerald-400",
  Cancelled: "bg-red-400",
}

export default function OrderStatusButton({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  // ✅ Fixed: Fallback status to "Pending" if currentStatus comes undefined during build
  const safeStatus = currentStatus || "Pending"
  const [status, setStatus] = useState(safeStatus)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Sync state if server data changes later
  useEffect(() => {
    if (currentStatus) setStatus(currentStatus)
  }, [currentStatus])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = async (newStatus: string) => {
    setOpen(false)
    if (newStatus === status) return
    setLoading(true)
    const res = await updateOrderStatus(orderId, newStatus)
    if (res?.success) setStatus(newStatus)
    setLoading(false)
  }

  // Fallback styling lookup to avoid undefined string injections
  const currentStyle = STATUS_STYLES[status] || STATUS_STYLES["Pending"]
  const currentDot = DOT_COLORS[status] || DOT_COLORS["Pending"]

  return (
    <div ref={ref} className="relative inline-block">

      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        disabled={loading}
        className={`
          flex items-center gap-1 px-2.5 py-1 rounded-full
          text-[9px] font-bold uppercase tracking-widest
          transition-all select-none
          ${currentStyle}
        `}
      >
        <span className={`h-1 w-1 rounded-full shrink-0 ${currentDot}`} />
        {loading ? "..." : status}
        <ChevronDown
          size={8}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+4px)] z-[999] w-28 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
          {STATUS_OPTIONS.map((option) => {
            const isSelected = status === option
            const optionDot = DOT_COLORS[option] || "bg-gray-400"
            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`
                  w-full flex items-center gap-1.5 px-2.5 py-1.5 text-left
                  text-[10px] font-medium text-black transition-colors
                  ${isSelected ? "bg-gray-50 font-bold" : "bg-white hover:bg-gray-50"}
                `}
              >
                <span className={`h-1 w-1 rounded-full shrink-0 ${optionDot}`} />
                {option}
                {isSelected && (
                  <Check size={8} className="ml-auto text-black" />
                )}
              </button>
            )
          })}
        </div>
      )}

    </div>
  )
}