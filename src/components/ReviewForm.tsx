"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { createReview } from "@/lib/actions"
import { useUser } from "@clerk/nextjs"

export default function ReviewForm({ productId }: { productId: string }) {
  const { user } = useUser()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (!user)
    return alert("Please sign in to submit a review.")

  setLoading(true)

  const res = await createReview({
    productId,
    rating,
    comment,
    clerkId: user.id,
    userName: user.fullName || "Valued Customer",
    userImage: user.imageUrl,
  })

  if (res.success) {
    setComment("")
    setRating(5)
    alert("Thank you! Your review has been submitted successfully.")
  } else if (res.error) {
    alert(res.error)
  }

  setLoading(false)
} 

    return (
      <form onSubmit={onSubmit} className="bg-gray-50 rounded-[2rem] p-8 space-y-6">
        <h3 className="font-bold text-lg uppercase tracking-widest text-black">Submit a Review</h3>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <button key={s} type="button" onClick={() => setRating(s)}>
              <Star size={20} className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
            </button>
          ))}
        </div>

        <textarea
          required
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this product..."
          className="w-full border border-gray-200 rounded-2xl p-5 text-sm outline-none focus:border-black bg-white resize-none font-medium"
        />

        <button
          disabled={loading || !user}
          className="bg-black text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-30 hover:opacity-80 transition-all"
        >
          {loading ? "SUBMITTING..." : "POST REVIEW"}
        </button>
      </form>
    )
  }