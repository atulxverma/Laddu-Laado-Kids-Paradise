"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
const faqs = [
  {
    category: "Orders",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse your favorite products, select the appropriate size, add them to your cart and proceed to checkout."
      },
      {
        q: "Can I cancel my order?",
        a: "Yes. Orders can usually be cancelled before they are shipped. Please contact our support team as soon as possible."
      },
      {
        q: "How will I know my order is confirmed?",
        a: "Once your payment is successful, you'll receive an order confirmation email along with your Order ID."
      }
    ]
  },
  {
    category: "Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Most orders are delivered within 3–7 business days depending on your location."
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes. Free shipping is available on orders above ₹999."
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. A tracking link will be shared with you once your order has been shipped."
      }
    ]
  },
  {
    category: "Returns",
    items: [
      {
        q: "What is your return policy?",
        a: "Eligible products can be returned within 7 days of delivery if they are unused and in their original condition."
      },
      {
        q: "How do I request an exchange?",
        a: "Simply contact our support team with your Order ID and we'll guide you through the exchange process."
      },
      {
        q: "When will I receive my refund?",
        a: "Refunds are usually processed within 5–7 business days after your returned product has been inspected."
      }
    ]
  },
  {
    category: "Payments",
    items: [
      {
        q: "Which payment methods are accepted?",
        a: "We accept UPI, Debit Cards, Credit Cards, Net Banking and Cash on Delivery (where available)."
      },
      {
        q: "Is my payment secure?",
        a: "Yes. Every transaction is protected using industry-standard SSL encryption."
      },
      {
        q: "Can I split my payment?",
        a: "Currently, only one payment method can be used for each order."
      }
    ]
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="text-sm font-semibold text-black">{q}</span>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 h-7 w-7 rounded-full bg-neutral-100 group-hover:bg-black group-hover:text-white flex items-center justify-center">
          <Plus size={14} className="text-gray-600" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="px-5 pb-5">
              <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQsPage() {
  const [active, setActive] = useState("Orders")
  const current = faqs.find((f) => f.category === active)
  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 py-16">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 text-center"
        ></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 border border-gray-200 px-4 py-1.5 rounded-full inline-block">Help Center</span>
          <h1 className="text-4xl md:text-5xl font-bold text-black">Frequently Asked Questions</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">Need help with your order, shipping or payments? We've answered the most common questions to make your shopping experience simple and hassle-free.</p>
        </motion.div>
      </div>
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-8">
          {faqs.map((f) => (
            <motion.button key={f.category} whileTap={{ scale: 0.95 }} onClick={() => setActive(f.category)} className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all ${active === f.category ? "bg-black text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
              {f.category}
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-3">
            {current?.items.map((item) => (
              <FAQItem key={item.q} q={item.q} a={item.a} />
            ))}
          </motion.div>
        </AnimatePresence>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 bg-gray-50 border border-gray-100 rounded-3xl p-8 text-center">
          <h3 className="font-bold text-lg text-black mb-2">Need More Help?</h3>
          <p className="text-sm text-gray-500 mb-6">Our friendly support team is always ready to assist you with your orders, shipping or returns.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">

            <Link href="/shop" className="border border-gray-200 text-black px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors">Browse Shop</Link>
            <Link
              href="/contact"
              className="border border-black px-6 py-3 rounded-full text-sm font-bold hover:bg-black hover:text-white transition"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}