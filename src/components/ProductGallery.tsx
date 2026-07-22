"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  X,
  ZoomIn,
} from "lucide-react"

interface ProductImage {
  id?: string
  url: string
}

export default function ProductGallery({
  images,
}: {
  images: ProductImage[]
}) {
  const safeImages = images?.filter((image) => image?.url) || []

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [mounted, setMounted] = useState(false)

  const selectedImage = safeImages[selectedIndex]?.url

  useEffect(() => {
    setMounted(true)
  }, [])

  const nextImage = () => {
    if (safeImages.length <= 1) return

    setSelectedIndex((prev) =>
      prev === safeImages.length - 1 ? 0 : prev + 1
    )

    setZoom(1)
  }

  const previousImage = () => {
    if (safeImages.length <= 1) return

    setSelectedIndex((prev) =>
      prev === 0 ? safeImages.length - 1 : prev - 1
    )

    setZoom(1)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setZoom(1)
  }

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 4))
  }

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1))
  }

  useEffect(() => {
    if (!lightboxOpen) return

    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox()
      }

      if (event.key === "ArrowRight") {
        nextImage()
      }

      if (event.key === "ArrowLeft") {
        previousImage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [lightboxOpen, safeImages.length])

  if (safeImages.length === 0) {
    return (
      <div className="w-full max-w-[520px] mx-auto lg:mx-0 space-y-2">
        <div className="aspect-[4/5] bg-gray-100 rounded-3xl flex items-center justify-center">
          <p className="text-xs font-black text-gray-300 uppercase tracking-widest">
            No Image
          </p>
        </div>
      </div>
    )
  }

  const lightbox =
    mounted &&
      lightboxOpen &&
      selectedImage
      ? createPortal(
        <div
          className="
              fixed
              inset-0
              z-[999999]
             bg-black/95
backdrop-blur-md
              flex
              items-center
              justify-center
              overflow-hidden
              isolate
            "
        >
          {/* CLOSE BUTTON */}
          <button
            type="button"
            onClick={closeLightbox}
            className="
                fixed
                top-4
                right-4
                md:top-6
                md:right-6
                z-[1000001]
                h-11
                w-11
                bg-white
                text-black
                rounded-full
                flex
                items-center
                justify-center
                shadow-2xl
                hover:scale-105
                transition-transform
              "
          >
            <X size={20} />
          </button>

          {/* ZOOM CONTROLS */}
          <div
            className="
                fixed
                top-4
                left-1/2
                -translate-x-1/2
                md:top-6
                z-[1000001]
                flex
                items-center
                gap-2
                bg-white
                rounded-full
                p-1.5
                shadow-2xl
              "
          >
            <button
              type="button"
              onClick={zoomOut}
              disabled={zoom <= 1}
              className="
                  h-9
                  w-9
                  rounded-full
                  flex
                  items-center
                  justify-center
                  hover:bg-gray-100
                  disabled:opacity-30
                  transition-colors
                "
            >
              <Minus size={17} />
            </button>

            <span className="min-w-[48px] text-center text-[10px] font-black">
              {Math.round(zoom * 100)}%
            </span>

            <button
              type="button"
              onClick={zoomIn}
              disabled={zoom >= 4}
              className="
                  h-9
                  w-9
                  rounded-full
                  flex
                  items-center
                  justify-center
                  hover:bg-gray-100
                  disabled:opacity-30
                  transition-colors
                "
            >
              <Plus size={17} />
            </button>
          </div>

          {/* PREVIOUS IMAGE */}
          {safeImages.length > 1 && (
            <button
              type="button"
              onClick={previousImage}
              className="
                  fixed
                  left-5
                  md:left-8
                  top-1/2
                  -translate-y-1/2
                  z-[1000001]
                  h-11
                  w-11
                  md:h-14
                  md:w-14
                  bg-white
                  text-black
                  rounded-full
                  flex
                  items-center
                  justify-center
                  shadow-2xl
                  hover:scale-105
                  transition-transform
                "
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* IMAGE */}
          <div
            className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                overflow-hidden
                px-14
                py-20
                md:px-28
                md:py-16
              "
            onDoubleClick={() => {
              setZoom((prev) => (prev === 1 ? 2 : 1))
            }}
          >
            <img
              src={selectedImage}
              alt="Product preview"
              draggable={false}
              style={{
                transform: `scale(${zoom})`,
                transition: "transform 0.25s ease",
              }}
              className="
                  max-w-full
                  max-h-full
                  object-contain
                  select-none
                "
            />
          </div>

          {/* NEXT IMAGE */}
          {safeImages.length > 1 && (
            <button
              type="button"
              onClick={nextImage}
              className="
                  fixed
                  right-5
                  md:right-8
                  top-1/2
                  -translate-y-1/2
                  z-[1000001]
                  h-11
                  w-11
                  md:h-14
                  md:w-14
                  bg-white
                  text-black
                  rounded-full
                  flex
                  items-center
                  justify-center
                  shadow-2xl
                  hover:scale-105
                  transition-transform
                "
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* IMAGE COUNT */}
          {safeImages.length > 1 && (
            <div
              className="
                  fixed
                  bottom-5
                  left-1/2
                  -translate-x-1/2
                  z-[1000001]
                  bg-white
                  text-black
                  px-4
                  py-2
                  rounded-full
                  text-[10px]
                  font-black
                  shadow-xl
                "
            >
              {selectedIndex + 1} / {safeImages.length}
            </div>
          )}
        </div>,
        document.body
      )
      : null

  return (
    <>
      {/* SMALL PRODUCT GALLERY */}
      <div className="w-full space-y-3">

        {/* MAIN IMAGE */}
        <div
          onClick={() => {
            setZoom(1);
            setLightboxOpen(true);
          }}
          className="
relative
w-full
aspect-[3/4]
bg-gradient-to-b
from-white
to-gray-50
border
border-neutral-200
rounded-[32px]
overflow-hidden
group
shadow-sm
hover:shadow-xl
transition-all
duration-500
cursor-zoom-in
"
        >
          <img
            src={selectedImage}
            alt="Product"
            className="
              w-full
              h-full
              object-cover
              p-0
              transition-transform
              duration-500
              group-hover:scale-[1.02]
            "
          />

          {/* SMALL ZOOM ICON ONLY */}
          <div
            className="
              absolute
              bottom-5
              right-5
              h-9
              w-9
             bg-white/90
backdrop-blur-xl
              rounded-full
              flex
              items-center
              justify-center
              shadow-xl
border
border-gray-200
              pointer-events-none
            "
          >
            <ZoomIn size={15} />
          </div>

          {/* MAIN IMAGE PREVIOUS */}
          {safeImages.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                previousImage()
              }}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                h-12
                w-12
               bg-white/80
backdrop-blur-xl
border
border-gray-200
                rounded-full
                flex
                items-center
                justify-center
                shadow-xl
                opacity-100
                md:opacity-0
                md:group-hover:opacity-100
                transition-opacity
              "
            >
              <ChevronLeft size={17} />
            </button>
          )}

          {/* MAIN IMAGE NEXT */}
          {safeImages.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                nextImage()
              }}
              className="
                absolute
                right-5
                top-1/2
                -translate-y-1/2
                h-12
                w-12
               bg-white/80
backdrop-blur-xl
border
border-gray-200
                rounded-full
                flex
                items-center
                justify-center
                shadow-xl
                opacity-100
                md:opacity-0
                md:group-hover:opacity-100
                transition-opacity
              "
            >
              <ChevronRight size={17} />
            </button>
          )}
        </div>

        {/* THUMBNAILS */}
        {safeImages.length > 1 && (
          <div className="flex justify-center gap-3 overflow-x-auto scroll-smooth py-2 px-1 no-scrollbar">
            {safeImages.map((image, index) => (
              <button
                key={image.id ?? image.url ?? index}
                className={`
    h-20
    w-16
    overflow-hidden
    rounded-xl
    border
    transition-all
    ${selectedIndex === index
                    ? "border-black"
                    : "border-gray-200 hover:border-gray-400"
                  }
  `}
              >
                <img
                  src={image.url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>

            ))}
          </div>
        )}
      </div>

      {lightbox}
    </>
  )
}