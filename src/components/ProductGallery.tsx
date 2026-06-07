"use client"

import { useState } from "react"

export default function ProductGallery({ images }: { images: any[] }) {
  const [active, setActive] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/5] rounded-2xl bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">No Images</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
        <img
          src={images[active]?.url}
          alt="Product"
          className="w-full h-full object-cover transition-all duration-500"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {images.map((img, i) => (
            <button
              key={img.id || i}
              onClick={() => setActive(i)}
              className={`shrink-0 h-20 w-16 rounded-xl overflow-hidden border-2 transition-all ${
                active === i
                  ? "border-black opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img
                src={img.url}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}