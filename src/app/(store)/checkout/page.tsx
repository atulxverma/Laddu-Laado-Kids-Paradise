"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/hooks/use-cart"
import { createOrder, initiateRazorpayPayment } from "@/lib/actions"
import { useUser, SignInButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Building2, CheckCircle2, CreditCard, Home, Landmark, LockKeyhole, MapPin, Navigation, PackageCheck, Phone, ShieldCheck, ShoppingBag, Truck, User, Sparkles } from "lucide-react"
import Script from "next/script"

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] =
    useState<"ONLINE" | "COD">("ONLINE");
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const items = useCart((state) => state.items)
  const clearCart = useCart((state) => state.clearCart)

  const validItems = items.filter(
    (item) => item && item.id && item.name
  )

  const subtotal = validItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const shippingCharge = subtotal >= 999 ? 0 : 79;

  const deliveryCharge =
    paymentMethod === "COD" ? 79 : 0;

  const total =
    subtotal +
    shippingCharge +
    deliveryCharge;

  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [successfulPaymentMethod, setSuccessfulPaymentMethod] =
    useState<"ONLINE" | "COD" | null>(null);
  const [pincodeLoading, setPincodeLoading] = useState(false)
  const [locating, setLocating] = useState(false)

  const [form, setForm] = useState({
    phone: "",
    pincode: "",
    city: "",
    state: "",
    houseDetails: ""
  })

  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${(i * 17) % 100}%`,
    top: `${(i * 29) % 100}%`,
    duration: `${2 + (i % 3)}s`,
    delay: `${i * 0.15}s`,
  }));

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

    if (!form.pincode) {
      alert("Please enter your pincode.");
      document.querySelector<HTMLInputElement>('input[placeholder="6 Digit PIN"]')?.focus();
      setLoading(false);
      return;
    }

    if (!form.city || !form.state) {
      alert("Please enter a valid pincode to fetch your city and state.");
      document.querySelector<HTMLInputElement>('input[placeholder="6 Digit PIN"]')?.focus();
      setLoading(false);
      return;
    }

    if (!form.houseDetails.trim()) {
      alert("Please enter your complete delivery address.");
      document.querySelector<HTMLTextAreaElement>("textarea")?.focus();
      setLoading(false);
      return;
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
      if (paymentMethod === "COD") {

        const orderRes = await createOrder({

          phone: form.phone,

          address: fullAddress,

          items: checkoutItems,

          paymentMethod: "COD"

        })

        if (orderRes.success) {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
          setSuccessfulPaymentMethod("COD");
          setIsSuccess(true);
          clearCart();

        } else {

          alert(orderRes.error)

        }
setTimeout(() => router.push("/"), 4000);
        setLoading(false)

        return;

      }

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
        name: "Laddoo Laado",
        description: "Premium Couture Order",
        order_id: res.orderId,
        handler: async function (response: any) {
          setLoading(true)

          const orderRes = await createOrder({
            phone: form.phone,
            address: fullAddress,
            items: checkoutItems,
            paymentMethod: "ONLINE",
            payment: {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            },
          })

          if (orderRes.success) {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
            setSuccessfulPaymentMethod("ONLINE");
            setIsSuccess(true);
            clearCart();

            setTimeout(() => router.push("/"), 4000);
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


      //without razorpay code 


      //       const orderRes = await createOrder({
      //   phone: form.phone,
      //   address: fullAddress,
      //   items: checkoutItems,
      //   payment: {
      //     razorpayOrderId: "DEV_ORDER",
      //     razorpayPaymentId: "DEV_PAYMENT",
      //     razorpaySignature: "DEV_SIGNATURE",
      //   },
      // });

      // if (orderRes.success) {
      //   setIsSuccess(true);
      //   clearCart();
      //   setTimeout(() => router.push("/"), 4000);
      // } else {
      //   alert(orderRes.error || "Order failed");
      // }

      // setLoading(false);
      // return;

      //till there without razorpay

    } catch (err) {
      setLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4">

        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">

          {particles.map((particle) => (
            <span
              key={particle.id}
              className="absolute h-3 w-3 rounded-full bg-emerald-300/40 animate-ping"
              style={{
                left: particle.left,
                top: particle.top,
                animationDuration: particle.duration,
                animationDelay: particle.delay,
              }}
            />
          ))}
        </div>

        <section className="relative z-10 w-full max-w-lg rounded-[36px] bg-white/90 p-10 text-center shadow-[0_25px_80px_rgba(0,0,0,.08)] backdrop-blur">

          {/* Success Icon */}
          <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center">

            <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping" />

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500 shadow-lg">

              <CheckCircle2
                size={52}
                className="text-white animate-bounce"
              />

            </div>

          </div>

          <div className="mb-4 flex justify-center">
            <Sparkles className="text-yellow-500 animate-pulse" size={24} />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">
            {successfulPaymentMethod === "ONLINE"
              ? "PAYMENT SUCCESSFUL"
              : "ORDER PLACED"}
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-zinc-900">
            {successfulPaymentMethod === "ONLINE"
              ? "Order Confirmed 🎉"
              : "Order Placed 🎉"}
          </h1>

          <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-zinc-500">
            {successfulPaymentMethod === "ONLINE" ? (
              <>
                Thank you for shopping with
                <span className="font-semibold text-black"> Laddoo Laado</span>.
                <br />
                Your payment has been received and your order is being prepared for dispatch.
              </>
            ) : (
              <>
                Thank you for shopping with
                <span className="font-semibold text-black"> Laddoo Laado</span>.
                <br />
                Your Cash on Delivery order has been placed successfully and will be confirmed shortly.
              </>
            )}
          </p>

          <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">

            <p className="text-sm font-semibold text-emerald-700">
              Redirecting to Home...
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-emerald-200">

              <div className="h-full w-full animate-[progress_4s_linear] rounded-full bg-emerald-500" />

            </div>

          </div>

          <div className="mt-8">

            <button
              onClick={() => router.push("/")}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-black text-sm font-bold text-white transition hover:scale-[1.02]"
            >
              Continue Shopping
              <ArrowRight size={18} />
            </button>

          </div>

        </section>
      </main>
    );
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
            <button className="mt-8 rounded-2xl bg-black px-8 h-14 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-zinc-800">Sign In</button>
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
          <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-black px-6 h-14 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-zinc-800">
            Continue Shopping
            <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#fafafa] pb-24 pt-6 md:pt-8 lg:pt-10 lg:pb-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="mx-auto max-w-7xl px-4 sm:px-0">
        <header className="mb-8">

          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black mb-5"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Complete your order securely.
          </p>

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
                    <input value={user?.fullName || ""} disabled className="w-full rounded-2xl border border-zinc-100 bg-zinc-50 h-14 pl-12 pr-5 text-sm font-medium text-zinc-400 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-zinc-700">Phone Number</label>
                  <div className="relative">
                    <Phone size={17} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <span className="pointer-events-none absolute left-12 top-1/2 -translate-y-1/2 border-r border-zinc-200 pr-3 text-sm font-medium text-zinc-500">+91</span>
                    <input required type="tel" placeholder="00000 00000" pattern="[6-9]{1}[0-9]{9}" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 h-14 pl-[104px] pr-5 text-sm font-medium text-zinc-950 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-950 focus:bg-white focus:ring-4 focus:ring-zinc-100" />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-zinc-700">Pincode</label>
                    <div className="relative">
                      <MapPin size={17} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input required placeholder="6 Digit PIN" value={form.pincode} onChange={handlePincodeChange} className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 h-14 pl-12 pr-10 text-sm font-medium text-zinc-950 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-950 focus:bg-white focus:ring-4 focus:ring-zinc-100" />
                      {pincodeLoading && <div className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin" />}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold text-zinc-700">City</label>
                    <div className="relative">
                      <Building2 size={17} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <input readOnly placeholder="Auto-detected" value={form.city} className="w-full rounded-2xl border border-zinc-100 bg-zinc-100 h-14 pl-12 pr-5 text-sm font-medium text-zinc-500 outline-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-zinc-700">State</label>
                  <div className="relative">
                    <Landmark size={17} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input readOnly placeholder="Auto-detected" value={form.state} className="w-full rounded-2xl border border-zinc-100 bg-zinc-100 h-14 pl-12 pr-5 text-sm font-medium text-zinc-500 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-zinc-700">House No / Landmark / Road</label>
                  <div className="relative">
                    <Home size={17} className="pointer-events-none absolute left-5 top-5 text-zinc-400" />
                    <textarea minLength={10} required rows={4} placeholder="Flat/House No, Building Name, Near Landmark, Road Name..." value={form.houseDetails} onChange={(e) => setForm({ ...form, houseDetails: e.target.value })} className="w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 h-14 pl-12 pr-5 text-sm font-medium leading-6 text-zinc-950 outline-none transition-all placeholder:text-zinc-400 focus:border-zinc-950 focus:bg-white focus:ring-4 focus:ring-zinc-100" />
                  </div>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm"><ShieldCheck size={19} className="text-zinc-900" /><p className="mt-3 text-xs font-semibold text-zinc-800">Secure Checkout</p><p className="mt-1 text-[11px] text-zinc-500">Protected data</p></div>
              <div className="rounded-2xl bg-white p-4 shadow-sm"><PackageCheck size={19} className="text-zinc-900" /><p className="mt-3 text-xs font-semibold text-zinc-800">Easy Returns</p><p className="mt-1 text-[11px] text-zinc-500">Simple process</p></div>
              <div className="rounded-2xl bg-white p-4 shadow-sm"><Truck size={19} className="text-zinc-900" /><p className="mt-3 text-xs font-semibold text-zinc-800">Fast Delivery</p><p className="mt-1 text-[11px] text-zinc-500">Tracked shipping</p></div>
              <div className="rounded-2xl bg-white p-4 shadow-sm"><CheckCircle2 size={19} className="text-zinc-900" /><p className="mt-3 text-xs font-semibold text-zinc-800">Safe Payment</p><p className="mt-1 text-[11px] text-zinc-500">Razorpay secured</p></div>
            </div>
          </section>

          <aside className="relative h-fit">
            <div className="
sticky
top-28
rounded-[28px]
border
border-neutral-200
bg-white
p-6
shadow-lg
transition-all
duration-300
">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight">Order Summary</h2>
                <span className="rounded-full bg-neutral-100 text-neutral-700 px-3 py-1 text-xs font-bold">{validItems.length} {validItems.length === 1 ? "item" : "items"}</span>
              </div>

              <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">

                <div className="flex items-center gap-3">

                  <Truck
                    size={22}
                    className="text-black"
                  />

                  <div>

                    <p className="text-sm font-bold text-black">
                      Shipping Policy
                    </p>

                    <ul className="mt-2 space-y-1 text-xs text-neutral-600">

                      <li>• Free Shipping on orders above ₹999.</li>

                      <li>• Delivery Charges are included on Cash on Delivery(COD) .</li>

                    </ul>

                  </div>

                </div>

              </div>

              <div className="my-6 max-h-[310px] space-y-4 overflow-y-auto pr-1">

                {validItems.map((item) => (

                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex gap-3 border-b border-neutral-200 pb-4 last:border-0 last:pb-0"
                  >

                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingBag size={18} className="text-neutral-400" />
                        </div>
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-bold text-black">
                        {item.name}
                      </p>

                      <p className="mt-1 text-xs text-neutral-500">
                        Size {item.size} • Qty {item.quantity}
                      </p>

                      <p className="mt-2 text-sm font-black text-black">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

              <div className="border-t border-neutral-200 pt-5">

                <div className="space-y-3">

                  <div className="flex justify-between">

                    <span className="text-neutral-500">
                      Subtotal
                    </span>

                    <span className="font-bold">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>

                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-500">
                      Shipping Charges
                    </span>

                    <span className="font-bold">
                      {shippingCharge === 0 ? "FREE" : "₹79"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-500">
                      Delivery Charges
                    </span>

                    <span className="font-bold">
                      {paymentMethod === "COD" ? "₹79" : "FREE"}
                    </span>
                  </div>

                  <div className="flex justify-between">

                    <span className="text-neutral-500">
                      Taxes
                    </span>

                    <span className="font-bold">
                      Included
                    </span>

                  </div>

                </div>

                <div className="my-5 h-px bg-neutral-200" />

                <div className="flex justify-between items-end">

                  <div>

                    <p className="text-sm text-neutral-500">
                      Grand Total
                    </p>

                    <p className="text-[11px] text-neutral-400">
                      Inclusive of all taxes
                    </p>

                  </div>

                  <h3 className="text-3xl font-black">
                    ₹{total.toLocaleString("en-IN")}
                  </h3>

                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("ONLINE")}
                    className={`rounded-xl border p-3 transition ${paymentMethod === "ONLINE"
                      ? "border-black bg-black text-white"
                      : "border-zinc-200 bg-white"
                      }`}
                  >
                    <p className="text-xs font-bold">
                      ONLINE PAYMENT
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("COD")}
                    className={`rounded-xl border p-3 transition ${paymentMethod === "COD"
                      ? "border-black bg-black text-white"
                      : "border-zinc-200 bg-white"
                      }`}
                  >
                    <p className="text-xs font-bold">
                      CASH ON DELIVERY
                    </p>

                  </button>

                </div>

                <button
                  form="checkout-form"
                  type="submit"
                  disabled={loading}
                  className="mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-black text-white font-black transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[.98] disabled:opacity-40"
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      <LockKeyhole size={17} />
                      {paymentMethod === "ONLINE"
                        ? "Pay Securely"
                        : "Place COD Order"}
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>

                <div className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">

                  <div className="flex items-center gap-3">

                    <ShieldCheck
                      size={18}
                      className="text-emerald-600"
                    />

                    <div>

                      <p className="text-sm font-bold">
                        Secure Checkout
                      </p>

                      <p className="text-[11px] text-neutral-500">
                        SSL encrypted payment powered by Razorpay
                      </p>

                    </div>

                  </div>

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
            </div>
          </aside>
        </div>

      </div>


    </main>
  )
}