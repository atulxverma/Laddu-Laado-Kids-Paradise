"use client";

import { motion } from "framer-motion";
import { Truck, Clock, MapPin, Package } from "lucide-react";
import Link from "next/link";

export default function ShippingPage() {
  const shippingInfo = [
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Processing Time",
    desc: "Orders are processed and packed within 24 hours of successful payment."
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Delivery Time",
    desc: "Most orders are delivered within 3–7 business days depending on your location."
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Live Tracking",
    desc: "You'll receive an email and SMS with a tracking link once your order ships."
  },
  {
    icon: <Package className="h-6 w-6" />,
    title: "Free Shipping",
    desc: "Free shipping on orders above ₹999. Standard shipping charges apply below this amount."
  },
];

  return (
    <div className="min-h-screen bg-white py-16">
         
        <div className="mt-24 rounded-[32px] border border-neutral-200 bg-neutral-50 p-8 shadow-sm md:p-14">
  <h2 className="text-3xl font-bold text-center mb-10">
    Shipping Process
  </h2>

  <div className="grid md:grid-cols-4 gap-8">

    <div className="text-center">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-white text-black hover:bg-neutral-200 flex items-center justify-center font-bold">
        1
      </div>
      <h3 className="font-semibold">Order Placed</h3>
      <p className="text-sm text-gray-500 mt-2">
        Your order is confirmed instantly.
      </p>
    </div>

    <div className="text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 rounded-full bg-white text-black hover:bg-neutral-200 flex items-center justify-center font-bold">
        2
      </div>
      <h3 className="font-semibold">Packed</h3>
      <p className="text-sm text-gray-500 mt-2">
        Carefully packed by our team.
      </p>
    </div>

    <div className="text-center">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-white text-black hover:bg-neutral-200 flex items-center justify-center font-bold">
        3
      </div>
      <h3 className="font-semibold">Shipped</h3>
      <p className="text-sm text-gray-500 mt-2">
        Tracking details are shared.
      </p>
    </div>

    <div className="text-center">
      <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-white text-black hover:bg-neutral-200 flex items-center justify-center font-bold">
        4
      </div>
      <h3 className="font-semibold">Delivered</h3>
      <p className="text-sm text-gray-500 mt-2">
        Delivered safely to your doorstep.
      </p>
    </div>

  </div>
</div>
      <div className="max-w-6xl mx-auto px-4 py-5">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="px-4 py-1 rounded-full border text-xs font-semibold uppercase tracking-widest text-gray-500">
            Shipping Policy
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Fast & Reliable Shipping
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-600">
            We carefully pack every order and deliver it safely to your doorstep.
Enjoy fast dispatch, real-time tracking and hassle-free delivery across India.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {shippingInfo.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group rounded-3xl border hover:bg-white hover:text-black border-neutral-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-black hover:shadow-2xl"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-black hover:bg-neutral-200 transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>

              <h3 className="text-xl font-semibold">{item.title}</h3>

              <p className="mt-3 leading-7 text-neutral-600">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 rounded-[32px] bg-black px-8 py-14 text-center text-white">
          <h2 className="text-2xl font-bold">
            Questions About Your Delivery?
          </h2>

          <p className="mt-3 text-neutral-300">
           Need help tracking your package or have delivery-related questions? Our support team is always here to assist you.
          </p>

          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <Link
              href="/contact"
              className="bg-white text-black hover:bg-neutral-200 px-6 py-3 rounded-full font-semibold hover:opacity-90"
            >
              Contact Us
            </Link>

            <Link
              href="/shop"
              className="border px-6 py-3 rounded-full font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}