import Link from "next/link"

const footerCols = [
  {
    title: "Company",
    links: [
      { name: "About", href: "/about" },
      { name: "Features", href: "/#features" },
      { name: "Works", href: "/#works" },
      { name: "Career", href: "/#career" },
    ],
  },
  {
    title: "Help",
    links: [
      { name: "Customer Support", href: "/faqs" },
      { name: "Delivery Details", href: "/faqs" },
      { name: "Terms & Conditions", href: "/legal/terms-conditions" },
      { name: "Privacy Policy", href: "/legal/privacy-policy" },
      { name: "Refund Policy", href: "/legal/refund-policy" },
    ],
  },
  {
    title: "FAQ",
    links: [
      { name: "Account", href: "/orders" },
      { name: "Manage Deliveries", href: "/orders" },
      { name: "Orders", href: "/orders" },
      { name: "Payments", href: "/faqs" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Free eBooks", href: "/#" },
      { name: "Development Tutorial", href: "/#" },
      { name: "How to Blog", href: "/#" },
      { name: "Youtube Playlist", href: "/#" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-8">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand Section with Circular Logo */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full overflow-hidden shadow-md border border-gray-50 bg-white">
              <img 
                src="/logo.jpeg" 
                alt="Laddu Laado Logo" 
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-black text-lg italic text-black uppercase tracking-tighter">Laddu Laado</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            Premium kids wear handcrafted with love. We bring elegance to your little ones&apos; wardrobe.
          </p>
          <div className="flex items-center gap-3 mt-6">
            {["𝕏", "f", "📷", "⭕"].map((icon) => (
              <button
                key={icon}
                className="h-8 w-8 rounded-full border border-gray-100 flex items-center justify-center text-xs text-gray-500 hover:bg-black hover:text-white transition-all shadow-sm"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Links Columns */}
        {footerCols.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-black uppercase tracking-widest mb-4 text-black">
              {col.title}
            </h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-xs text-gray-500 hover:text-black transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Laddu Laado © 2026. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2 opacity-50 grayscale hover:opacity-100 transition-all">
            {["VISA", "MC", "PayPal", "Apple Pay", "G Pay"].map((pay) => (
              <span
                key={pay}
                className="text-[8px] font-black border border-gray-200 px-2 py-0.5 rounded text-gray-400 shadow-sm bg-white"
              >
                {pay}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}