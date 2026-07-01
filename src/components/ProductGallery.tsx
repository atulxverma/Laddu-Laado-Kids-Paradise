"use client"

import { useState } from "react"

export default function ProductGallery({
  images,
}: {
  images: any[]
}) {
  const [active, setActive] = useState(0)

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[4/5] rounded-[2rem] bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">
          No Images
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="order-2 lg:order-1 flex lg:flex-col gap-3 overflow-x-auto no-scrollbar">
          {images.map((img, i) => (
            <button
              key={img.id || i}
              onClick={() => setActive(i)}
              className={`shrink-0 h-16 w-14 md:h-24 md:w-20 rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                active === i
                  ? "border-black scale-105"
                  : "border-gray-100 opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img.url}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="order-1 lg:order-2 flex-1">
        <div className="group relative h-[320px] md:h-[450px] lg:h-[500px] max-w-[500px] mx-auto rounded-[2.5rem] overflow-hidden bg-[#fafafa]">

          <img
            src={images[active]?.url}
            alt="Product"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Image Counter */}
          <div className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 text-[10px] font-black uppercase shadow">
            {active + 1} / {images.length}
          </div>

        </div>
      </div>
    </div>
  )
}