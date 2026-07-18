"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
} from "react-icons/fa";

const footerCols = [
  {
    title: "Shop",
    links: [
      { name: "Newborn", href: "/shop?age=0-2Y" },
      { name: "Boys", href: "/shop?gender=Boy" },
      { name: "Girls", href: "/shop?gender=Girl" },
      { name: "New Arrivals", href: "/shop?new=true" },
      { name: "Sale", href: "/shop" },
    ],
  },
  {
    title: "Customer",
    links: [
      { name: "Contact Us", href: "/contact" },
      { name: "FAQs", href: "/faq" },
      { name: "Shipping", href: "/shipping" },
      { name: "Returns", href: "/returns" },
      { name: "Track Order", href: "/orders" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 md:mt-28 border-t border-neutral-200 bg-[#fafafa]">

      <div className="max-w-7xl mx-auto px-5 py-10 md:py-16">

        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1.5fr] gap-8 md:gap-12">

          {/* ---------------- BRAND ---------------- */}

          <div>

            <div className="flex items-center gap-3">

              <img
                src="/logo.jpeg"
                alt="Laddu Laado"
                className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover border border-neutral-200 shadow-sm"
              />

              <div>

                <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase">
                  Laddu Laado
                </h2>

                <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400">
                  Premium Kids Fashion
                </p>

              </div>

            </div>

            <p className="mt-4 md:mt-4 md:mt-6 text-[15px] leading-7 text-neutral-500 max-w-sm">
              Beautiful clothing crafted with comfort, softness and timeless
              style for every little star.
            </p>

            {/* Trust Badges */}

            <div className="flex flex-wrap gap-2 mt-4 md:mt-4 md:mt-6">

              {[
                "Organic Cotton",
                "Made with Love",
                "Premium Quality",
              ].map((item) => (

                <span
                  key={item}
                  className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[11px] font-semibold text-neutral-600"
                >
                  {item}
                </span>

              ))}

            </div>

            {/* Social */}

            <div className="flex gap-3 mt-5 md:mt-8">

              <Link
                href="#"
                className="h-11 w-11 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-600 hover:bg-black hover:text-white hover:scale-110 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <FaInstagram size={18} />
              </Link>

              <Link
                href="#"
                className="h-11 w-11 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-600 hover:bg-black hover:text-white hover:scale-110 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <FaFacebookF size={17} />
              </Link>

              <Link
                href="#"
                className="h-11 w-11 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-600 hover:bg-black hover:text-white hover:scale-110 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              >
                <FaWhatsapp size={18} />
              </Link>

            </div>

          </div>

          {/* ---------------- LINKS ---------------- */}

          {footerCols.map((col) => (

            <div key={col.title}>

              <h3 className="text-sm font-black uppercase tracking-[0.18em] mb-3 md:mb-6">

                {col.title}

              </h3>

              <ul className="space-y-2 md:space-y-3">

                {col.links.map((link) => (

                  <li key={link.name}>

                    <Link
                      href={link.href}
                      className="text-[15px] text-neutral-500 hover:text-black hover:translate-x-1 transition-all duration-300 inline-block"
                    >
                      {link.name}
                    </Link>

                  </li>

                ))}

              </ul>

            </div>

          ))}

                    {/* ---------------- NEWSLETTER ---------------- */}

          <div>

            <div className="rounded-[30px] border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-5 md:p-7 shadow-sm hover:shadow-xl transition-all duration-300">

              <h3 className="text-lg font-black">
                Stay Updated
              </h3>

              <p className="mt-2 text-sm leading-6 text-neutral-500">
                Subscribe to receive new arrivals, exclusive offers and seasonal
                collections.
              </p>

              <div className="mt-4 md:mt-4 md:mt-6 flex h-12 overflow-hidden rounded-full border border-neutral-300">

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent px-5 text-sm outline-none"
                />

                <button
                  className="flex w-14 items-center justify-center bg-black text-white transition hover:bg-neutral-800"
                >
                  <Mail size={18} />
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* ---------------- BOTTOM BAR ---------------- */}

        <div className="mt-8 md:mt-14 border-t border-neutral-200 pt-6 md:pt-8">

          <div className="flex flex-col gap-3 md:gap-5  md:flex-row md:items-center md:justify-between">

            <p className="text-sm text-neutral-500">
              © 2026 <span className="font-semibold text-black">Laddu Laado</span>. Crafted with ❤️ for every little star.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm">

              <Link
                href="/privacy"
                className="text-neutral-500 transition hover:text-black"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="text-neutral-500 transition hover:text-black"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/returns"
                className="text-neutral-500 transition hover:text-black"
              >
                Returns
              </Link>

            </div>

          </div>

        </div>

      </div>

    </footer>
  );
}