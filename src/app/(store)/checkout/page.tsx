"use client"

import { useState, useEffect, useRef } from "react"
import { useCart } from "@/hooks/use-cart"
import { createOrder, initiateRazorpayPayment } from "@/lib/actions"
import { useUser, SignInButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CheckCircle2, CreditCard, LockKeyhole, PackageCheck, ShieldCheck, ShoppingBag, Truck, Sparkles } from "lucide-react"
import Script from "next/script"
import AddressDrawer from "@/components/checkout/AddressDrawer";
import AddressCard from "@/components/checkout/AddressCard";
import AddressForm from "@/components/checkout/AddressForm";
import {
  CircleDollarSign,
} from "lucide-react";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] =
    useState<"ONLINE" | "COD" | null>(null);
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const items = useCart((state) => state.items)
  const clearCart = useCart((state) => state.clearCart)
  const [addressDrawerOpen, setAddressDrawerOpen] = useState(false);
  const paymentMethodRef = useRef<HTMLDivElement>(null);
  const validItems = items.filter(
    (item) => item && item.id && item.name
  )

  const subtotal = validItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const shippingCharge =
    paymentMethod === "COD"
      ? 79
      : subtotal >= 999
        ? 0
        : 79;

  const deliveryCharge =
    paymentMethod === "COD" ? 79 : 0;

  const total =
    subtotal +
    shippingCharge +
    deliveryCharge;

  const codTotal = subtotal + 79 + 79;

  const ctaLabel =
    paymentMethod === null
      ? "Review & Continue"
      : paymentMethod === "ONLINE"
        ? "Pay Securely"
        : "Place COD Order";

  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [successfulPaymentMethod, setSuccessfulPaymentMethod] =
    useState<"ONLINE" | "COD" | null>(null);
  const [pincodeLoading, setPincodeLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [codDrawerOpen, setCodDrawerOpen] = useState(false);

  type AddressLabel = "Home" | "Office" | "Other";

  type SavedAddress = {
    id: string;
    name: string;
    phone: string;
    pincode: string;
    city: string;
    state: string;
    houseDetails: string;
    label: string;
    isDefault: boolean;
  };

  type CheckoutAddress = {
    name: string;
    phone: string;
    pincode: string;
    city: string;
    state: string;
    houseDetails: string;
  };

  type AddressDraft = CheckoutAddress & {
    label: AddressLabel;
  };

  const emptyAddress: CheckoutAddress = {
    name: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    houseDetails: "",
  };

  const emptyDraftAddress: AddressDraft = {
    ...emptyAddress,
    label: "Home",
  };

  const [savedAddress, setSavedAddress] =
    useState<CheckoutAddress>(emptyAddress);

  const [draftAddress, setDraftAddress] =
    useState<AddressDraft>(emptyDraftAddress);

  const [savedAddresses, setSavedAddresses] =
    useState<SavedAddress[]>([]);

  const [selectedAddressId, setSelectedAddressId] =
    useState<string | null>(null);

  const [addressesLoading, setAddressesLoading] = useState(true);

  const [savingAddress, setSavingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] =
    useState<string | null>(null);

  const loadSavedAddresses = async () => {
    try {
      setAddressesLoading(true);

      const response = await fetch("/api/addresses", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to load addresses.");
      }

      const addresses: SavedAddress[] = data.addresses || [];

      setSavedAddresses(addresses);

      if (addresses.length > 0) {
        const defaultAddress =
          addresses.find((address) => address.isDefault) ||
          addresses[0];

        setSelectedAddressId(defaultAddress.id);

        setSavedAddress({
          name: defaultAddress.name,
          phone: defaultAddress.phone,
          pincode: defaultAddress.pincode,
          city: defaultAddress.city,
          state: defaultAddress.state,
          houseDetails: defaultAddress.houseDetails,
        });
      } else {
        setSelectedAddressId(null);
        setSavedAddress(emptyAddress);
      }
    } catch (error) {
      console.error("LOAD_ADDRESSES_ERROR:", error);
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded || !user) return;

    loadSavedAddresses();
  }, [isLoaded, user?.id]);

  useEffect(() => {
    document.body.style.overflow = codDrawerOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [codDrawerOpen]);

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
          setDraftAddress(prev => ({
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
    setDraftAddress((prev) => ({
      ...prev,
      pincode: pin,
    }));
    if (pin.length === 6) {
      setPincodeLoading(true)
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`)
        const data = await res.json()
        if (data[0].Status === "Success") {
          const details = data[0].PostOffice[0];

          setDraftAddress(prev => ({
            ...prev,
            city: details.District,
            state: details.State,
          }));
        } else {
          setDraftAddress(prev => ({
            ...prev,
            city: "",
            state: "",
          }));

          alert("Invalid Pincode");
        }
      } catch (err) {
        console.error(err)
      } finally {
        setPincodeLoading(false)
      }
    }
  }
  const isAddressComplete = () => {
    return (
      savedAddress.name.trim() &&
      /^[6-9]\d{9}$/.test(savedAddress.phone) &&
      savedAddress.pincode.length === 6 &&
      savedAddress.city &&
      savedAddress.state &&
      savedAddress.houseDetails.trim()
    );
  };

  const proceedToPayment = () => {
    if (!isAddressComplete()) {
      setEditingAddressId(null);

      setDraftAddress({
        ...emptyAddress,
        label: "Home",
      });

      setAddressDrawerOpen(true);
      return;
    }

    paymentMethodRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const handlePayment = async () => {
    if (loading) return;
    if (!user) return;

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (!savedAddress.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    setLoading(true);

    if (!savedAddress.pincode) {
      alert("Please enter your pincode.");
      document.querySelector<HTMLInputElement>('input[placeholder="6 Digit PIN"]')?.focus();
      setLoading(false);
      return;
    }

    if (!savedAddress.city || !savedAddress.state) {
      alert("Please enter a valid pincode to fetch your city and state.");
      document.querySelector<HTMLInputElement>('input[placeholder="6 Digit PIN"]')?.focus();
      setLoading(false);
      return;
    }

    if (!savedAddress.houseDetails.trim()) {
      alert("Please enter your complete delivery address.");
      document.querySelector<HTMLTextAreaElement>("textarea")?.focus();
      setLoading(false);
      return;
    }

    if (!/^[6-9]\d{9}$/.test(savedAddress.phone)) {
      alert("Please enter a valid Indian mobile number.");
      setLoading(false);
      return;
    }


    try {
      const checkoutItems = validItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        size: item.size,
      }))
      if (paymentMethod === "COD") {

        const orderRes = await createOrder({
          customerName: savedAddress.name,
          email: user.primaryEmailAddress?.emailAddress || "",
          phone: savedAddress.phone,
          address: savedAddress.houseDetails,
          city: savedAddress.city,
          state: savedAddress.state,
          pincode: savedAddress.pincode,

          items: checkoutItems,

          paymentMethod: "COD",

          shippingCharge,
          deliveryCharge,
          total,
        })

        if (orderRes.success) {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });

          setSuccessfulPaymentMethod("COD");
          setIsSuccess(true);
          clearCart();

          setTimeout(() => router.push("/"), 4000);
        } else {
          alert(orderRes.error || "Order failed");
        }

        setLoading(false);
        return;

      }

      const res = await initiateRazorpayPayment(
        checkoutItems,
        paymentMethod,
      )

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
            customerName: savedAddress.name,
            email: user.primaryEmailAddress?.emailAddress || "",
            phone: savedAddress.phone,
            address: savedAddress.houseDetails,
            city: savedAddress.city,
            state: savedAddress.state,
            pincode: savedAddress.pincode,

            items: checkoutItems,

            paymentMethod: "ONLINE",

            shippingCharge,
            deliveryCharge,
            total,

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
          name: savedAddress.name.trim(),
          email: user?.primaryEmailAddress?.emailAddress ?? "",
          contact: savedAddress.phone.trim(),
        },
        theme: { color: "#000000" },
        modal: { ondismiss: () => setLoading(false) }
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()


      //without razorpay code 


      //       const orderRes = await createOrder({
      //   phone: savedAddress.phone,
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
      console.error(err);
      alert("Something went wrong. Please try again.");
      setLoading(false);
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
              : "ORDER Confirmed"}
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-zinc-900">
            {successfulPaymentMethod === "ONLINE"
              ? "Order Confirmed 🎉"
              : "Order Confirmed 🎉"}
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
                Your Cash on Delivery order has been confirmed successfully.
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
    <main className="min-h-screen bg-[#fafafa] pb-28 pt-2 md:pt-6 lg:pt-10 lg:pb-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="mx-auto max-w-7xl px-4 sm:px-0">
        <header className="mb-3 lg:mb-8">

          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-black mb-3 md:mb-5"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>

          <h1 className="text-[26px] md:text-5xl font-black tracking-tight">
            Checkout
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Complete your order securely.
          </p>

        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-10">
          <section className="space-y-4 lg:space-y-6">
            <AddressCard
              addresses={savedAddresses}
              selectedAddressId={selectedAddressId}
              loading={addressesLoading}

              onSelect={(address) => {
                setSelectedAddressId(address.id);

                setSavedAddress({
                  name: address.name,
                  phone: address.phone,
                  pincode: address.pincode,
                  city: address.city,
                  state: address.state,
                  houseDetails: address.houseDetails,
                });
              }}

              onAddNew={() => {
                setEditingAddressId(null);
                setDraftAddress(emptyDraftAddress);
                setAddressDrawerOpen(true);
              }}

              onEdit={(address) => {
                setEditingAddressId(address.id);
                setSelectedAddressId(address.id);

                setDraftAddress({
                  name: address.name,
                  phone: address.phone,
                  pincode: address.pincode,
                  city: address.city,
                  state: address.state,
                  houseDetails: address.houseDetails,
                  label:
                    address.label === "Office" ||
                      address.label === "Other"
                      ? address.label
                      : "Home",
                });

                setAddressDrawerOpen(true);
              }}

              onDelete={async (address) => {
                const confirmed = window.confirm(
                  `Delete this ${address.label || "saved"} address?`
                );

                if (!confirmed) return;

                try {
                  const response = await fetch("/api/addresses", {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      id: address.id,
                    }),
                  });

                  const data = await response.json();

                  if (!response.ok || !data.success) {
                    throw new Error(
                      data.error || "Failed to delete address."
                    );
                  }

                  await loadSavedAddresses();
                } catch (error) {
                  console.error("DELETE_ADDRESS_ERROR:", error);

                  alert(
                    error instanceof Error
                      ? error.message
                      : "Failed to delete address."
                  );
                }
              }}
            />

            <AddressDrawer
              open={addressDrawerOpen}

              onClose={() => {
                setAddressDrawerOpen(false);
                setEditingAddressId(null);
                setDraftAddress(emptyDraftAddress);
              }}

              footer={
                <button
                  type="button"
                  disabled={savingAddress}

                  onClick={async () => {
                    // ============================
                    // VALIDATION
                    // ============================

                    if (
                      !draftAddress.name.trim() ||
                      !/^[6-9]\d{9}$/.test(draftAddress.phone) ||
                      draftAddress.pincode.length !== 6 ||
                      !draftAddress.city.trim() ||
                      !draftAddress.state.trim() ||
                      !draftAddress.houseDetails.trim()
                    ) {
                      alert("Please complete your address.");
                      return;
                    }

                    try {
                      setSavingAddress(true);

                      // ==========================================
                      // EDIT MODE  -> PATCH
                      // ADD MODE   -> POST
                      // ==========================================

                      const isEditing = editingAddressId !== null;

                      const response = await fetch("/api/addresses", {
                        method: isEditing ? "PATCH" : "POST",

                        headers: {
                          "Content-Type": "application/json",
                        },

                        body: JSON.stringify({
                          ...(isEditing
                            ? {
                              id: editingAddressId,
                            }
                            : {}),

                          name: draftAddress.name,
                          phone: draftAddress.phone,
                          pincode: draftAddress.pincode,
                          city: draftAddress.city,
                          state: draftAddress.state,
                          houseDetails: draftAddress.houseDetails,

                          label: draftAddress.label,
                        }),
                      });

                      const data = await response.json();

                      if (!response.ok || !data.success) {
                        throw new Error(
                          data.error ||
                          (isEditing
                            ? "Failed to update address."
                            : "Failed to save address.")
                        );
                      }

                      const returnedAddress: SavedAddress = data.address;

                      // ==========================================
                      // EDIT EXISTING ADDRESS
                      // ==========================================

                      if (isEditing) {
                        setSavedAddresses((previous) =>
                          previous.map((address) =>
                            address.id === returnedAddress.id
                              ? returnedAddress
                              : address
                          )
                        );
                      }

                      // ==========================================
                      // CREATE NEW ADDRESS
                      // ==========================================

                      else {
                        setSavedAddresses((previous) => [
                          returnedAddress,
                          ...previous,
                        ]);
                      }

                      // ==========================================
                      // SELECT SAVED / UPDATED ADDRESS
                      // ==========================================

                      setSelectedAddressId(returnedAddress.id);

                      setSavedAddress({
                        name: returnedAddress.name,
                        phone: returnedAddress.phone,
                        pincode: returnedAddress.pincode,
                        city: returnedAddress.city,
                        state: returnedAddress.state,
                        houseDetails: returnedAddress.houseDetails,
                      });

                      // ==========================================
                      // CLEANUP
                      // ==========================================

                      setAddressDrawerOpen(false);

                      setEditingAddressId(null);

                      setDraftAddress(emptyDraftAddress);
                    } catch (error) {
                      console.error(
                        editingAddressId
                          ? "UPDATE_ADDRESS_ERROR:"
                          : "SAVE_ADDRESS_ERROR:",
                        error
                      );

                      alert(
                        error instanceof Error
                          ? error.message
                          : editingAddressId
                            ? "Failed to update address."
                            : "Failed to save address."
                      );
                    } finally {
                      setSavingAddress(false);
                    }
                  }}

                  className="
        flex
        h-12
        w-full
        items-center
        justify-center
        rounded-xl
        bg-black
        text-sm
        font-semibold
        text-white
        transition
        hover:bg-neutral-800
        disabled:cursor-not-allowed
        disabled:bg-neutral-300
      "
                >
                  {savingAddress ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      {editingAddressId
                        ? "Updating..."
                        : "Saving..."}
                    </span>
                  ) : editingAddressId ? (
                    "Update Address"
                  ) : (
                    "Save Address"
                  )}
                </button>
              }
            >
              <AddressForm
                form={draftAddress}
                setForm={setDraftAddress}
                locating={locating}
                detectLocation={detectLocation}
                pincodeLoading={pincodeLoading}
                handlePincodeChange={handlePincodeChange}
                showLabelSelector={
                  savedAddresses.length > 0 ||
                  editingAddressId !== null
                }
              />
            </AddressDrawer>
            <div className="hidden lg:grid lg:grid-cols-4 gap-4">
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

                      <li>• Free Shipping on orders above ₹999 for online payments.</li>
                      <li>• COD orders include ₹79 shipping + ₹79 COD convenience charge.</li>

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

              <div className="border-t border-neutral-200 pt-4">

                <div className="space-y-2.5">

                  <div className="flex items-center justify-between text-[13px]">

                    <span className="text-neutral-500">
                      Subtotal
                    </span>

                    <span className="font-semibold text-neutral-900">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>

                  </div>

                  <div className="flex items-center justify-between text-[13px]">

                    <span className="text-neutral-500">
                      Shipping
                    </span>

                    <span className="font-semibold text-neutral-900">
                      {shippingCharge === 0 ? "FREE" : "₹79"}
                    </span>

                  </div>

                  <div className="flex items-center justify-between text-[13px]">

                    <span className="text-neutral-500">
                      Cash on Delivery
                    </span>

                    <span
                      className={`font-semibold transition-colors duration-300 ${paymentMethod === "COD"
                        ? "text-orange-600"
                        : "text-emerald-600"
                        }`}
                    >
                      {paymentMethod === "COD" ? "+₹79" : "FREE"}
                    </span>

                  </div>

                  <div className="flex items-center justify-between text-[13px]">

                    <span className="text-neutral-500">
                      Taxes
                    </span>

                    <span className="font-semibold text-neutral-900">
                      Included
                    </span>

                  </div>

                </div>

                <div className="my-4 h-px bg-neutral-200" />

                <div className="flex items-end justify-between">

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                      Grand Total
                    </p>

                    <p className="mt-0.5 text-[10px] text-neutral-400">
                      Inclusive of all taxes
                    </p>

                  </div>

                  <h3 className="text-[28px] font-black tracking-tight">
                    ₹{total.toLocaleString("en-IN")}
                  </h3>

                </div>

                <div
                  ref={paymentMethodRef}
                  className="mt-5 overflow-hidden rounded-[22px] border border-neutral-200 bg-white"
                >
                  {/* Header */}
                  <div className="border-b border-neutral-100 px-4 py-3.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-950">
                          Payment Method
                        </h3>

                        <p className="mt-0.5 text-[11px] text-neutral-400">
                          Choose how you would like to pay
                        </p>
                      </div>

                      {paymentMethod && (
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                          <CheckCircle2 size={13} />
                          Selected
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 p-3">

                    {/* ONLINE */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("ONLINE")}
                      className={`
        flex w-full items-center gap-3
        rounded-[16px] border
        p-3.5 text-left
        transition-all duration-200

        ${paymentMethod === "ONLINE"
                          ? "border-black bg-neutral-50 shadow-sm"
                          : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
                        }
      `}
                    >
                      <div
                        className={`
          flex h-10 w-10 shrink-0
          items-center justify-center
          rounded-xl
          ${paymentMethod === "ONLINE"
                            ? "bg-black text-white"
                            : "bg-neutral-100 text-neutral-700"
                          }
        `}
                      >
                        <CreditCard size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-semibold text-neutral-950">
                            Pay Online
                          </p>

                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                            RECOMMENDED
                          </span>
                        </div>

                        <p className="mt-0.5 text-[11px] text-neutral-500">
                          UPI, Cards, Net Banking & Wallets
                        </p>
                      </div>

                      <div
                        className={`
          flex h-5 w-5 shrink-0
          items-center justify-center
          rounded-full border-2
          ${paymentMethod === "ONLINE"
                            ? "border-black"
                            : "border-neutral-300"
                          }
        `}
                      >
                        {paymentMethod === "ONLINE" && (
                          <div className="h-2.5 w-2.5 rounded-full bg-black" />
                        )}
                      </div>
                    </button>

                    {/* COD */}
                    <button
                      type="button"
                      onClick={() => setCodDrawerOpen(true)}
                      className={`
        flex w-full items-center gap-3
        rounded-[16px] border
        p-3.5 text-left
        transition-all duration-200

        ${paymentMethod === "COD"
                          ? "border-black bg-neutral-50 shadow-sm"
                          : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
                        }
      `}
                    >
                      <div
                        className={`
          flex h-10 w-10 shrink-0
          items-center justify-center
          rounded-xl
          ${paymentMethod === "COD"
                            ? "bg-black text-white"
                            : "bg-neutral-100 text-neutral-700"
                          }
        `}
                      >
                        <CircleDollarSign size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[13px] font-semibold text-neutral-950">
                            Cash on Delivery
                          </p>

                          <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[9px] font-bold text-orange-700">
                            +₹79
                          </span>
                        </div>

                        <p className="mt-0.5 text-[11px] text-neutral-500">
                          Pay when your order arrives
                        </p>
                      </div>

                      <div
                        className={`
          flex h-5 w-5 shrink-0
          items-center justify-center
          rounded-full border-2
          ${paymentMethod === "COD"
                            ? "border-black"
                            : "border-neutral-300"
                          }
        `}
                      >
                        {paymentMethod === "COD" && (
                          <div className="h-2.5 w-2.5 rounded-full bg-black" />
                        )}
                      </div>
                    </button>

                  </div>

                  {/* Security footer */}
                  <div className="flex items-center gap-2 border-t border-neutral-100 bg-neutral-50/70 px-4 py-2.5">
                    <ShieldCheck
                      size={13}
                      className="text-emerald-600"
                    />

                    <p className="text-[10px] text-neutral-500">
                      Online payments are securely processed by Razorpay
                    </p>
                  </div>
                </div>

                {codDrawerOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[60] bg-black/40"
                      onClick={() => setCodDrawerOpen(false)}
                    />

                    <div
                      className="
fixed
bottom-0
left-0
right-0
z-[70]
rounded-t-[30px]
bg-white
p-6
shadow-2xl
animate-[slideUp_.28s_cubic-bezier(.22,1,.36,1)]
"
                    >

                      <div className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-neutral-300" />

                      <h3 className="text-lg font-bold">
                        Cash on Delivery
                      </h3>

                      <p className="mt-2 text-sm text-neutral-500">
                        COD orders include
                        <span className="font-semibold text-black">
                          {" "}₹79 shipping
                        </span>
                        {" "}and a
                        <span className="font-semibold text-black">
                          {" "}₹79 COD convenience charge
                        </span>.
                      </p>

                      <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4">

                        <div className="flex items-center justify-between">

                          <div>

                            <p className="text-xs uppercase tracking-wide text-neutral-500">
                              Updated Total
                            </p>

                            <p className="mt-1 text-[11px] text-neutral-400">
                              Includes COD convenience charge
                            </p>

                          </div>

                          <span className="text-2xl font-black text-neutral-900">
                            ₹{codTotal.toLocaleString("en-IN")}
                          </span>

                        </div>

                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">

                        <button
                          onClick={() => setCodDrawerOpen(false)}
                          className="h-12 rounded-xl border border-neutral-300 font-medium"
                        >
                          Cancel
                        </button>

                        <button
                          onClick={() => {
                            setPaymentMethod("COD");
                            setCodDrawerOpen(false);
                          }}
                          className="h-12 rounded-xl bg-black font-medium text-white"
                        >
                          Confirm COD
                        </button>

                      </div>

                    </div>
                  </>
                )}
                {/* DESKTOP CHECKOUT CTA */}
                <div className="mt-6 hidden lg:block">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => {
                      if (!isAddressComplete()) {
                        proceedToPayment();
                        return;
                      }

                      if (paymentMethod === null) {
                        paymentMethodRef.current?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                        return;
                      }

                      handlePayment();
                    }}
                    className="
      flex h-14 w-full
      items-center justify-center gap-3
      rounded-2xl
      bg-black
      text-sm font-bold text-white
      transition
      hover:bg-neutral-800
      active:scale-[.99]
      disabled:cursor-not-allowed
      disabled:bg-neutral-300
    "
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {paymentMethod === "COD" ? (
                          <CircleDollarSign size={18} />
                        ) : (
                          <LockKeyhole size={18} />
                        )}
                        {ctaLabel}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
                    <ShieldCheck size={13} />
                    Secure checkout · Your payment information is protected
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
              <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 p-4 backdrop-blur lg:hidden">

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {

                    if (!isAddressComplete()) {
                      proceedToPayment();
                      return;
                    }
                    if (paymentMethod === null) {
                      paymentMethodRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                      return;
                    }
                    handlePayment();
                  }}
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-black text-sm font-bold text-white transition active:scale-[.98]"
                >
                  {loading ? (
                    "Processing..."
                  ) : (
                    <>
                      {paymentMethod === "COD" ? (
                        <CircleDollarSign size={18} />
                      ) : (
                        <LockKeyhole size={18} />
                      )}
                      {ctaLabel}
                      <ArrowRight size={18} />
                    </>
                  )}

                </button>

              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}