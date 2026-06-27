"use client"
import { useState } from "react"
import { subscribeNewsletter } from "@/lib/actions"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await subscribeNewsletter(email)
    if (res.success) {
      setStatus("Thank you! You have been successfully subscribed.")
      setEmail("")
    } else {
      setStatus(res.error || "Subscription failed. Please try again.")
    }
  }

  return (
    <div className="bg-[#111111] rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden border border-white/5">
      <div className="relative z-10 space-y-8">
        <h2 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
          Elevate Your <br /> <span className="text-gray-500 font-normal">Wardrobe</span>
        </h2>
        <p className="text-gray-400 text-sm max-w-sm mx-auto font-medium uppercase tracking-widest leading-relaxed">
          Be the first to receive exclusive drops and private sale invitations.
        </p>
        
        <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto">
          <input 
            type="email" required placeholder="Enter your email address" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-8 py-5 text-white text-sm outline-none focus:border-white/30 transition-all"
          />
          <button className="bg-white text-black px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-200 transition-all shadow-xl">
            Subscribe
          </button>
        </form>
        {status && <p className="text-[10px] font-bold text-white uppercase tracking-[0.2em] mt-4">{status}</p>}
      </div>
    </div>
  )
}