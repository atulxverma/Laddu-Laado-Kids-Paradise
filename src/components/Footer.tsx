import Link from "next/link"

const footerCols = [
  {
    title: "Company",
    links: ["About", "Features", "Works", "Career"],
  },
  {
    title: "Help",
    links: [
      "Customer Support",
      "Delivery Details",
      "Terms & Conditions",
      "Privacy Policy",
    ],
  },
  {
    title: "FAQ",
    links: ["Account", "Manage Deliveries", "Orders", "Payments"],
  },
  {
    title: "Resources",
    links: [
      "Free eBooks",
      "Development Tutorial",
      "How to Blog",
      "Youtube Playlist",
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-8">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-black italic">L</span>
            </div>
            <span className="font-bold text-sm">Laddu Laado</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            We have clothes that suits your style and which you&apos;re proud to
            wear. From women to men.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-3 mt-4">
            {["𝕏", "f", "📷", "⭕"].map((icon) => (
              <button
                key={icon}
                className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center text-xs text-gray-500 hover:bg-black hover:text-white hover:border-black transition-all"
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Links */}
        {footerCols.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-bold uppercase tracking-widest mb-4">
              {col.title}
            </h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-xs text-gray-500 hover:text-black transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            Laddu Laado © 2026. All Rights Reserved.
          </p>
          <div className="flex items-center gap-2">
            {["VISA", "MC", "PayPal", "Apple Pay", "G Pay"].map((pay) => (
              <span
                key={pay}
                className="text-[10px] font-bold border border-gray-200 px-2 py-1 rounded text-gray-500"
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