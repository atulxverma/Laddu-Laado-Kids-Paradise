"use client";

import { motion } from "framer-motion";
import { RefreshCcw, PackageCheck, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ReturnsPage() {
  const policies = [
    {
      icon: <RefreshCcw className="h-6 w-6" />,
      title: "Easy Returns",
      desc: "Eligible products can be returned within 7 days of delivery."
    },
    {
      icon: <PackageCheck className="h-6 w-6" />,
      title: "Product Condition",
      desc: "Items must be unused, unwashed and returned with original tags."
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Refund Process",
      desc: "Refunds are processed within 5–7 business days after inspection."
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Quality Assurance",
      desc: "If you receive a damaged or incorrect item, we'll replace it at no extra cost."
    },
  ];

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-6xl mx-auto px-4">
    
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="px-4 py-1 rounded-full border text-xs font-semibold uppercase tracking-widest text-gray-500">
            Returns & Refunds
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            Easy Returns & Refund Policy
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-600">
            Your satisfaction matters to us. If something isn't right, we'll make it right.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {policies.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-black hover:shadow-2xl"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>

              <h3 className="text-xl font-semibold">
                {item.title}
              </h3>

              <p className="mt-3 leading-7 text-neutral-600">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 rounded-[32px] border border-neutral-200 bg-neutral-50 p-8 shadow-sm md:p-14">
          <h2 className="mb-10 text-center text-3xl font-bold">
            Return Process
          </h2>

          <ol className="space-y-4 text-gray-600">
            <li><strong>1.</strong> Contact our support team with your Order ID.</li>
            <li><strong>2.</strong> We'll verify your request and arrange the return.</li>
            <li><strong>3.</strong> Pack the product securely with original tags.</li>
            <li><strong>4.</strong> After inspection, your refund or replacement will be processed.</li>
          </ol>
        </div>

        <div className="mt-24 rounded-[32px] bg-black px-8 py-14 text-center text-white">
          <h2 className="text-2xl font-bold">
            Need Assistance?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-neutral-300">
            Our support team is always ready to help with returns, exchanges or refunds.
          </p>

          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <Link
              href="/contact"
              className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
            >
              Contact Us
            </Link>

            <Link
              href="/shop"
              className="rounded-full border border-white px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}