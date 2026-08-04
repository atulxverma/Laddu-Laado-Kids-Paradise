"use client"

import { useRef, useState } from "react"
import { ImagePlus, Link2, Loader2, X } from "lucide-react"

type ImageKitUploadProps = {
  onUpload: (url: string) => void
  folder?: string
  buttonText?: string
  className?: string
}

export default function ImageKitUpload({
  onUpload,
  folder = "/uploads",
  buttonText = "Upload",
  className = "",
}: ImageKitUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [uploading, setUploading] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  // ==============================
  // LOCAL FILE → IMAGEKIT
  // ==============================

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.")
      e.target.value = ""
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be smaller than 10MB.")
      e.target.value = ""
      return
    }

    try {
      setUploading(true)

      const authResponse = await fetch("/api/imagekit-auth", {
        method: "GET",
        cache: "no-store",
      })

      if (!authResponse.ok) {
        throw new Error("Failed to authenticate ImageKit.")
      }

      const { token, expire, signature } =
        await authResponse.json()

      if (!token || !expire || !signature) {
        throw new Error(
          "Invalid ImageKit authentication response."
        )
      }

      const formData = new FormData()

      formData.append("file", file)
      formData.append("fileName", file.name)

      formData.append(
        "publicKey",
        process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!
      )

      formData.append("token", token)
      formData.append("expire", String(expire))
      formData.append("signature", signature)

      formData.append("folder", folder)
      formData.append("useUniqueFileName", "true")

      const uploadResponse = await fetch(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          method: "POST",
          body: formData,
        }
      )

      const result = await uploadResponse.json()

      if (!uploadResponse.ok) {
        console.error("IMAGEKIT_UPLOAD_RESPONSE:", result)

        throw new Error(
          result?.message ||
            result?.help ||
            "Image upload failed."
        )
      }

      if (!result?.url) {
        throw new Error(
          "ImageKit did not return an image URL."
        )
      }

      onUpload(result.url)

      setShowOptions(false)
    } catch (error) {
      console.error("IMAGEKIT_UPLOAD_ERROR:", error)

      alert(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      )
    } finally {
      setUploading(false)

      if (inputRef.current) {
        inputRef.current.value = ""
      }
    }
  }

  // ==============================
  // DIRECT IMAGE URL
  // ==============================

  const handleUrlSubmit = () => {
    const url = imageUrl.trim()

    if (!url) {
      alert("Please enter an image URL.")
      return
    }

    try {
      const parsedUrl = new URL(url)

      if (
        parsedUrl.protocol !== "http:" &&
        parsedUrl.protocol !== "https:"
      ) {
        throw new Error()
      }
    } catch {
      alert("Please enter a valid image URL.")
      return
    }

    onUpload(url)

    setImageUrl("")
    setShowOptions(false)
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="hidden"
      />

      {/* MAIN BUTTON */}

      <button
        type="button"
        disabled={uploading}
        onClick={() => setShowOptions(true)}
        className={
          className ||
          `
          flex items-center justify-center gap-2
          rounded-full
          bg-white
          px-5 py-2.5
          text-[10px]
          font-black
          uppercase
          tracking-widest
          text-black
          transition-all
          hover:scale-105
          disabled:cursor-not-allowed
          disabled:opacity-60
          `
        }
      >
        {uploading ? (
          <>
            <Loader2
              size={14}
              className="animate-spin"
            />

            Uploading...
          </>
        ) : (
          <>
            <ImagePlus size={14} />
            {buttonText}
          </>
        )}
      </button>

      {/* UPLOAD OPTIONS MODAL */}

      {showOptions && (
        <div
          className="
          fixed inset-0 z-[9999]
          flex items-center justify-center
          bg-black/40
          px-4
          backdrop-blur-sm
          "
          onClick={() => setShowOptions(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
            w-full max-w-md
            rounded-[28px]
            bg-white
            p-6
            shadow-2xl
            "
          >
            {/* HEADER */}

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black">
                  Add Image
                </h3>

                <p className="mt-1 text-xs text-neutral-500">
                  Upload an image or paste an image URL
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowOptions(false)}
                className="
                flex h-9 w-9
                items-center justify-center
                rounded-full
                bg-neutral-100
                transition
                hover:bg-black
                hover:text-white
                "
              >
                <X size={16} />
              </button>
            </div>

            {/* UPLOAD */}

            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="
              mt-6
              flex w-full
              items-center gap-4
              rounded-2xl
              border border-neutral-200
              p-4
              text-left
              transition
              hover:border-black
              hover:bg-neutral-50
              "
            >
              <div
                className="
                flex h-11 w-11
                shrink-0
                items-center justify-center
                rounded-xl
                bg-black
                text-white
                "
              >
                <ImagePlus size={18} />
              </div>

              <div>
                <p className="text-sm font-bold">
                  Upload from device
                </p>

                <p className="mt-0.5 text-[11px] text-neutral-500">
                  JPG, PNG, WEBP and other images
                </p>
              </div>
            </button>

            {/* DIVIDER */}

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-neutral-200" />

              <span className="text-[10px] font-bold uppercase text-neutral-400">
                OR
              </span>

              <div className="h-px flex-1 bg-neutral-200" />
            </div>

            {/* URL */}

            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                Image URL
              </label>

              <div className="relative mt-2">
                <Link2
                  size={16}
                  className="
                  absolute left-4 top-1/2
                  -translate-y-1/2
                  text-neutral-400
                  "
                />

                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) =>
                    setImageUrl(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleUrlSubmit()
                    }
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="
                  w-full
                  rounded-2xl
                  border border-neutral-200
                  py-3.5
                  pl-11 pr-4
                  text-sm
                  outline-none
                  transition
                  focus:border-black
                  "
                />
              </div>

              <button
                type="button"
                onClick={handleUrlSubmit}
                disabled={!imageUrl.trim()}
                className="
                mt-3
                w-full
                rounded-2xl
                bg-black
                py-3.5
                text-xs
                font-black
                uppercase
                tracking-wider
                text-white
                transition
                hover:bg-neutral-800
                disabled:cursor-not-allowed
                disabled:opacity-40
                "
              >
                Use Image URL
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}