"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/hooks/use-cart"
import { createOrder, initiateRazorpayPayment } from "@/lib/actions"
import { useUser, SignInButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ShoppingBag, CheckCircle2, ShieldCheck, MapPin, Phone, Navigation } from "lucide-react"
import Script from "next/script"

export default function CheckoutPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const items = useCart((state) => state.items)
  const clearCart = useCart((state) => state.clearCart)

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [pincodeLoading, setPincodeLoading] = useState(false)
  const [locating, setLocating] = useState(false)

  const [form, setForm] = useState({
    phone: "",
    pincode: "",
    city: "",
    state: "",
    houseDetails: ""
  })

  // --- 📍 LIVE GPS LOCATION DETECTION ---
  const detectLocation = () => {
    setLocating(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          const data = await res.json()
          const addr = data.address
          setForm(prev => ({
            ...prev,
            pincode: addr.postcode?.replace(/\s/g, "") || "",
            city: addr.city || addr.town || addr.village || addr.district || "",
            state: addr.state || "",
            houseDetails: `${addr.road || ""} ${addr.suburb || ""}`.trim()
          }))
        } catch (err) {
          alert("Auto-location failed. Please enter manually.")
        } finally {
          setLocating(false)
        }
      }, () => {
        alert("Permission denied. Please enter address manually.")
        setLocating(false)
      })
    }
  }

  // --- 🔢 PINCODE LOOKUP ---
  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pin = e.target.value.replace(/\D/g, "").slice(0, 6)
    setForm({ ...form, pincode: pin })
    if (pin.length === 6) {
      setPincodeLoading(true)
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`)
        const data = await res.json()
        if (data[0].Status === "Success") {
          const details = data[0].PostOffice[0]
          setForm(prev => ({ ...prev, city: details.District, state: details.State }))
        }
      } catch (err) { console.error(err) } finally { setPincodeLoading(false) }
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)

    const fullAddress = `${form.houseDetails}, ${form.city}, ${form.state} - ${form.pincode}`

    try {
      const res = await initiateRazorpayPayment(total)
      if (!res.success) {
        alert("Payment Gateway Error")
        setLoading(false)
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: res.amount,
        currency: "INR",
        name: "laddoo LAADO",
        description: "Premium Couture Order",
        order_id: res.orderId,
        handler: async function (response: any) {
          const orderRes = await createOrder({
            clerkId: user.id,
            phone: form.phone,
            address: fullAddress,
            total,
            items,
          })
          if (orderRes.success) {
            setIsSuccess(true)
            clearCart()
            setTimeout(() => router.push("/"), 4000)
          }
        },
        prefill: {
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          contact: form.phone,
        },
        theme: { color: "#000000" },
        modal: { ondismiss: () => setLoading(false) }
      }
      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()
    } catch (err) { setLoading(false) }
  }

  if (isSuccess) return (
    <main className="bg-white min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <CheckCircle2 size={70} className="text-emerald-500 mb-6" />
      <h1 className="text-3xl font-black italic">ORDER PLACED SUCCESSFULLY</h1>
      <p className="text-gray-400 text-sm mt-2">Preparing your luxury selection. Redirecting...</p>
    </main>
  )

  if (isLoaded && items.length === 0) return (
    <main className="bg-white min-h-screen flex flex-col items-center justify-center gap-4">
      <ShoppingBag size={48} className="text-gray-100" />
      <p className="text-gray-400 text-sm">Your cart is empty</p>
      <Link href="/" className="font-bold border-b-2 border-black">Continue Shopping</Link>
    </main>
  )

  return (
    <main className="bg-white pb-20 min-h-screen pt-20">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          
          {/* LEFT: SHIPPING FORM (WITH PLACEHOLDERS RESTORED) */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">Checkout</h1>
              <button 
                type="button"
                onClick={detectLocation}
                disabled={locating}
                className="flex items-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100"
              >
                <Navigation size={12} className={locating ? "animate-spin" : ""} />
                {locating ? "LOCATING..." : "USE LIVE LOCATION"}
              </button>
            </div>

            <form id="checkout-form" onSubmit={handlePayment} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Recipient Name</label>
                <input value={user?.fullName || ""} disabled className="w-full border border-gray-100 rounded-2xl px-5 py-4 text-sm bg-gray-50 text-gray-400 font-bold" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-5 top-4 text-sm font-bold text-gray-400">+91</span>
                  <input required type="tel" placeholder="00000 00000" pattern="[6-9]{1}[0-9]{9}" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0,10) })} className="w-full border border-gray-100 rounded-2xl pl-14 pr-5 py-4 text-sm outline-none focus:border-black bg-gray-50/30 font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Pincode</label>
                  <div className="relative">
                    <input required placeholder="6 Digit PIN" value={form.pincode} onChange={handlePincodeChange} className="w-full border border-gray-100 rounded-2xl px-5 py-4 text-sm outline-none focus:border-black bg-gray-50/30 font-bold" />
                    {pincodeLoading && <div className="absolute right-4 top-4 h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">City</label>
                  <input readOnly placeholder="Auto-detected" value={form.city} className="w-full border border-gray-100 rounded-2xl px-5 py-4 text-sm bg-gray-100 text-gray-500 font-bold" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">State</label>
                <input readOnly placeholder="Auto-detected" value={form.state} className="w-full border border-gray-100 rounded-2xl px-5 py-4 text-sm bg-gray-100 text-gray-500 font-bold" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">House No / Landmark / Road</label>
                <textarea required rows={3} placeholder="Flat/House No, Building Name, Near Landmark, Road Name..." value={form.houseDetails} onChange={(e) => setForm({ ...form, houseDetails: e.target.value })} className="w-full border border-gray-100 rounded-2xl px-5 py-4 text-sm outline-none focus:border-black bg-gray-50/30 resize-none font-medium" />
              </div>
            </form>
          </div>

          {/* RIGHT: PREMIUM SUMMARY (KEEPING THIS Version) */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100 sticky top-28">
              <h3 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 mb-8">Summary</h3>
              
              <div className="space-y-5 max-h-[350px] overflow-y-auto no-scrollbar mb-8">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex items-center gap-4">
                    <div className="h-20 w-16 bg-white rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-black truncate">{item.name}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase mt-1">
                        Size {item.size} · Qty {item.quantity}
                      </p>
                      <p className="text-sm font-black text-black mt-1">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <div className="flex justify-between items-center text-gray-400 text-xs font-bold uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-500 text-xs font-bold uppercase tracking-widest">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="font-black text-sm uppercase italic">Total</span>
                  <span className="font-black text-3xl tracking-tighter">₹{total.toLocaleString("en-IN")}</span>
                </div>

                <button form="checkout-form" type="submit" disabled={loading || !form.city} className="w-full bg-black text-white py-5 rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] mt-6 hover:shadow-2xl transition-all active:scale-95 disabled:opacity-40 flex items-center justify-center gap-3">
                  {loading ? "PREPARING..." : <><ShieldCheck size={18} /> Pay Securely</>}
                </button>
              </div>

              <div className="mt-8 flex flex-col items-center gap-3">
                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Powered by Razorpay Secure</p>
                <div className="flex gap-3 opacity-20 grayscale">
                   {["VISA", "MC", "UPI", "PAYTM"].map(p => <span key={p} className="text-[7px] font-black border border-black px-1.5 py-0.5 rounded">{p}</span>)}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}