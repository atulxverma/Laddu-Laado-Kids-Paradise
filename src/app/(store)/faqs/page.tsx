"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import Link from "next/link"

const faqs = [
  { category: "Orders", items: [{ q: "How do I place an order?", a: "Browse our collection, select your size, add to cart and checkout." }, { q: "Can I cancel my order?", a: "You can cancel within 24 hours of placing it." }, { q: "How will I know order is confirmed?", a: "You will receive a confirmation notification." }] },
  { category: "Shipping", items: [{ q: "How long does delivery take?", a: "Standard delivery takes 3-5 business days." }, { q: "Do you offer free shipping?", a: "Free shipping on all orders above Rs 999." }, { q: "Can I track my order?", a: "Yes, you will receive a tracking link after shipment." }] },
  { category: "Returns", items: [{ q: "What is your return policy?", a: "Hassle-free returns within 7 days of delivery." }, { q: "How do I exchange a product?", a: "Contact support with your order ID." }, { q: "When will I get my refund?", a: "Within 5-7 business days after receiving the item." }] },
  { category: "Payments", items: [{ q: "What payment methods do you accept?", a: "UPI, credit/debit cards, net banking, and COD." }, { q: "Is it safe to pay here?", a: "Yes, we use SSL encryption." }, { q: "Can I use multiple payment methods?", a: "Only one payment method per order." }] },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="text-sm font-semibold text-black">{q}</span>
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
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
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 border border-gray-200 px-4 py-1.5 rounded-full inline-block">Help Center</span>
          <h1 className="text-4xl md:text-5xl font-bold text-black">Frequently Asked Questions</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">Cannot find what you are looking for? Reach out to our support team.</p>
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
          <h3 className="font-bold text-lg text-black mb-2">Still have questions?</h3>
          <p className="text-sm text-gray-500 mb-6">Our support team is here to help you 7 days a week.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="mailto:support@laddulaado.com" className="bg-black text-white px-6 py-3 rounded-full text-sm font-bold hover:opacity-80 transition-opacity">Email Us</a>
            <Link href="/shop" className="border border-gray-200 text-black px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors">Browse Shop</Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}