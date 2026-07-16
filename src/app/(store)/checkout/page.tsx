"use client"

import { useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { createOrder, initiateRazorpayPayment } from "@/lib/actions"
import { useUser, SignInButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, CreditCard, Home, Landmark, LockKeyhole, MapPin, Navigation, PackageCheck, Phone, ShieldCheck, ShoppingBag, Truck, User } from "lucide-react"
import Script from "next/script"

export default function CheckoutPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const items = useCart((state) => state.items)
  const clearCart = useCart((state) => state.clearCart)

  const validItems = items.filter(item => item && item.id && item.name)
  const total = validItems.reduce((s, i) => s + i.price * i.quantity, 0)

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
    } else {
      alert("Geolocation is not supported in this browser.")
      setLocating(false)
    }
  }

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
      } catch (err) {
        console.error(err)
      } finally {
        setPincodeLoading(false)
      }
    }
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    if (!user) return
    setLoading(true)

    if (!form.houseDetails.trim() || !form.city || !form.state || !form.pincode) {
      alert("Please complete your address")
      setLoading(false)
      return
    }

    if (form.phone.length !== 10) {
      alert("Please enter valid phone number")
      setLoading(false)
      return
    }

    const fullAddress = `${form.houseDetails}, ${form.city}, ${form.state} - ${form.pincode}`

    try {
      const checkoutItems = validItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        size: item.size,
      }))

      const res = await initiateRazorpayPayment(checkoutItems)

      if (!res.success) {
        alert("Payment Gateway Error")
        setLoading(false)
        return
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: res.amount,
        currency: "INR",
        name: "laddu LAADO",
        description: "Premium Couture Order",
        order_id: res.orderId,
        handler: async function (response: any) {
          setLoading(true)

          const orderRes = await createOrder({
            phone: form.phone,
            address: fullAddress,
            items: checkoutItems,
            payment: {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            },
          })

          if (orderRes.success) {
            setIsSuccess(true)
            clearCart()
            setTimeout(() => router.push("/"), 4000)
          } else {
            alert(orderRes.error || "Order failed")
          }

          setLoading(false)
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
    } catch (err) {
      setLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4 py-10 text-center">
        <section className="w-full max-w-lg rounded-[32px] bg-white px-6 py-14 shadow-[0_20px_70px_rgba(0,0,0,0.08)] sm:px-12">
          <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50">
            <div className="absolute inset-2 rounded-full border border-emerald-100" />
            <CheckCircle2 size={42} strokeWidth={1.5} className="text-emerald-600" />
          </div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">Payment successful</p>
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-4xl">Thank you for your order.</h1>
          <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-zinc-500">Your order has been confirmed and our team is preparing it for shipment.</p>
          <div className="mt-10 rounded-2xl bg-zinc-50 px-5 py-4">
            <p className="text-xs font-medium text-zinc-500">Redirecting you home in a few moments…</p>
          </div>
        </section>
      </main>
    )
  }

  if (isLoaded && !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4">
        <section className="w-full max-w-md rounded-[32px] bg-white p-8 text-center shadow-[0_20px_70px_rgba(0,0,0,0.07)] sm:p-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
            <LockKeyhole size={26} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">Sign in to checkout</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-500">Please sign in to securely continue with your order.</p>
          <SignInButton mode="modal">
            <button className="mt-8 rounded-2xl bg-black px-8 py-4 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-zinc-800">Sign In</button>
          </SignInButton>
        </section>
      </main>
    )
  }

  if (isLoaded && validItems.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4">
        <section className="w-full max-w-md rounded-[32px] bg-white px-6 py-14 text-center shadow-[0_20px_70px_rgba(0,0,0,0.07)]">
          <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-50">
            <ShoppingBag size={40} strokeWidth={1.3} className="text-zinc-900" />
          </div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">Nothing here yet</p>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Your cart is empty</h1>
          <p className="mt-4 text-sm leading-6 text-zinc-500">Discover pieces made to be worn and loved.</p>
          <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-black px-6 py-4 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-zinc-800">
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fafafa] pb-28 pt-24 sm:px-6 lg:pb-12 lg:pt-32">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="mx-auto max-w-7xl px-4 sm:px-0">
        <Link href="/cart" className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-black">
          <ArrowLeft size={16} />
          Back to Cart
        </Link>

        <header className="mb-9 sm:mb-11">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">Secure checkout</p>
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-5xl">Checkout</h1>
          <p className="mt-3 text-sm text-zinc-500 sm:text-base">Almost there. Review your shipping details before payment.</p>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-10">
          <section className="space-y-6">
            <div className="rounded-[28px] bg-white p-5 shadow-[0_12px_50px_rgba(0,0,0,0.04)] sm:p-8">
              <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-zinc-950">Shipping address</h2>
                  <p className="mt-1 text-sm text-zinc-500">Where should we deliver your order?</p>
                </div>
                <button type="button" onClick={detectLocation} disabled={locating} className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2.5 text-xs font-semibold text-blue-700 transition-all hover:-translate-y-0.5 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60">
                  <Navigation size={15} className={locating ? "animate-spin" : ""} />
                  {locating ? "Locating…" : "Use Live Location"}
                </button>
              </div>

              <form id="checkout-form" onSubmit={handlePayment} className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-zinc-700">Recipient Name</label>
                  <div className="relative">
                    <User size={17} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input value={user?.fullName || ""} disabled className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 py-4 pl-12 pr-5 text-sm font-medium text-zinc-400 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-zinc-700">Phone Number</label>
                  <div className="relative">
                    <Phone size={17} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <span className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 border-r border-zinc-200 pr-3 text-sm font-medium text-zinc-500">+91</span>
                    <input required type="tel" placeholder="00000 00000" pattern="[6-9]{1}[0-9]{9}" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-4 pl-[104px] pr-5 text-sm font-medium text-zinc-950 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-950 focus:bg-white focus:ring-4 focus:ring-zinc-100" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-zinc-700">Pincode</label>
                    <div className="relative">
                      <MapPin size={17} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input required placeholder="6 Digit PIN" value={form.pincode} onChange={handlePincodeChange} className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-4 pl-12 pr-10 text-sm font-medium text-zinc-950 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-950 focus:bg-white focus:ring-4 focus:ring-zinc-100" />
                      {pincodeLoading && <div className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin" />}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-zinc-700">City</label>
                    <div className="relative">
                      <Building2 size={17} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input readOnly placeholder="Auto-detected" value={form.city} className="w-full rounded-2xl border border-zinc-100 bg-zinc-100 py-4 pl-12 pr-5 text-sm font-medium text-zinc-500 outline-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-zinc-700">State</label>
                  <div className="relative">
                    <Landmark size={17} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input readOnly placeholder="Auto-detected" value={form.state} className="w-full rounded-2xl border border-zinc-100 bg-zinc-100 py-4 pl-12 pr-5 text-sm font-medium text-zinc-500 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-zinc-700">House No / Landmark / Road</label>
                  <div className="relative">
                    <Home size={17} className="pointer-events-none absolute left-5 top-5 text-zinc-400" />
                    <textarea minLength={10} required rows={4} placeholder="Flat/House No, Building Name, Near Landmark, Road Name..." value={form.houseDetails} onChange={(e) => setForm({ ...form, houseDetails: e.target.value })} className="w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 py-4 pl-12 pr-5 text-sm font-medium leading-6 text-zinc-950 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-950 focus:bg-white focus:ring-4 focus:ring-zinc-100" />
                  </div>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm"><ShieldCheck size={19} className="text-zinc-900" /><p className="mt-3 text-xs font-semibold text-zinc-800">Secure Checkout</p><p className="mt-1 text-[11px] text-zinc-500">Protected data</p></div>
              <div className="rounded-2xl bg-white p-4 shadow-sm"><PackageCheck size={19} className="text-zinc-900" /><p className="mt-3 text-xs font-semibold text-zinc-800">Easy Returns</p><p className="mt-1 text-[11px] text-zinc-500">Simple process</p></div>
              <div className="rounded-2xl bg-white p-4 shadow-sm"><Truck size={19} className="text-zinc-900" /><p className="mt-3 text-xs font-semibold text-zinc-800">Fast Delivery</p><p className="mt-1 text-[11px] text-zinc-500">Tracked shipping</p></div>
              <div className="rounded-2xl bg-white p-4 shadow-sm"><CheckCircle2 size={19} className="text-zinc-900" /><p className="mt-3 text-xs font-semibold text-zinc-800">Safe Payment</p><p className="mt-1 text-[11px] text-zinc-500">Razorpay secured</p></div>
            </div>
          </section>

          <aside className="h-fit lg:sticky lg:top-28">
            <div className="rounded-[28px] bg-zinc-950 p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.16)] sm:p-7">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Order Summary</h2>
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-zinc-300">{validItems.length} {validItems.length === 1 ? "item" : "items"}</span>
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300"><CheckCircle2 size={16} /> Free Delivery Unlocked</div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-full rounded-full bg-emerald-400" /></div>
                <p className="mt-2 text-xs text-zinc-400">Your order qualifies for complimentary delivery.</p>
              </div>

              <div className="my-6 max-h-[310px] space-y-4 overflow-y-auto pr-1">
                {validItems.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-3 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-white/10">
                      {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center"><ShoppingBag size={19} className="text-zinc-500" /></div>}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">{item.name}</p>
                      <p className="mt-1 text-xs text-zinc-400">Size {item.size} · Qty {item.quantity}</p>
                      <p className="mt-2 text-sm font-semibold text-white">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/15 pt-5">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-zinc-400"><span>Subtotal</span><span className="font-medium text-zinc-200">₹{total.toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between text-zinc-400"><span>Delivery charges</span><span className="font-medium text-emerald-300">FREE</span></div>
                  <div className="flex justify-between text-zinc-400"><span>Discount</span><span className="font-medium text-zinc-200">₹0</span></div>
                  <div className="flex justify-between text-zinc-400"><span>Taxes</span><span className="font-medium text-zinc-200">Included</span></div>
                </div>

                <div className="my-5 h-px bg-white/15" />

                <div className="flex items-end justify-between">
                  <div><p className="text-sm font-medium text-zinc-300">Grand Total</p><p className="mt-1 text-xs text-zinc-500">Inclusive of applicable taxes</p></div>
                  <p className="text-2xl font-semibold tracking-tight text-white">₹{total.toLocaleString("en-IN")}</p>
                </div>

                <div className="mt-5 rounded-2xl bg-white/5 p-4">
                  <div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"><Truck size={17} className="text-white" /></div><div><p className="text-xs font-semibold text-white">Estimated Delivery</p><p className="mt-0.5 text-xs text-zinc-400">Arrives in 3–5 business days</p></div></div>
                </div>

                <button form="checkout-form" type="submit" disabled={loading || !form.city} className="mt-6 hidden w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black shadow-lg transition-all hover:-translate-y-0.5 hover:bg-zinc-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 lg:flex">
                  {loading ? "Preparing secure payment…" : <><LockKeyhole size={16} /> Proceed to Payment <ArrowRight size={16} /></>}
                </button>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-zinc-500"><ShieldCheck size={14} /> SSL Secure · Encrypted Payment · Razorpay</div>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900"><CreditCard size={17} /> Accepted payment methods</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Visa", "Mastercard", "RuPay", "UPI", "Paytm", "PhonePe", "Google Pay", "Cash on Delivery"].map((method) => (
                  <span key={method} className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-[10px] font-semibold text-zinc-600">{method}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-4">
          <div className="min-w-0 flex-1"><p className="text-xs text-zinc-500">Total amount</p><p className="text-lg font-semibold tracking-tight text-zinc-950">₹{total.toLocaleString("en-IN")}</p></div>
          <button form="checkout-form" type="submit" disabled={loading || !form.city} className="flex shrink-0 items-center gap-2 rounded-2xl bg-black px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40">
            {loading ? "Preparing…" : <><LockKeyhole size={15} /> Pay Securely</>}
          </button>
        </div>
      </div>
    </main>
  )
}