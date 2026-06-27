"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  ClipboardList,
  Store,
  Menu,
  X,
  Image as ImageIcon
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { UserButton } from "@clerk/nextjs"

const navItems = [
  { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "/admin/products", icon: ShoppingBag },
  { label: "Categories", href: "/admin/categories", icon: Layers },
  { label: "Banners", href: "/admin/banners", icon: ImageIcon }, // 👈 Naya Link
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-5 gap-8">
      {/* Brand */}
      <div className="flex items-center justify-between px-2 pt-2">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-black text-white rounded-xl flex items-center justify-center">
            <span className="text-sm font-black italic">L</span>
          </div>
          <div>
            <p className="text-sm font-black text-black tracking-tight">
              laddu LAADO
            </p>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest">
              Admin
            </p>
          </div>
        </div>
        <button
          className="md:hidden p-1"
          onClick={() => setMobileOpen(false)}
        >
          <X size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="relative group"
            >
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="admin-active"
                    className="absolute inset-0 bg-black rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </AnimatePresence>
              <div
                className={`relative z-10 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 hover:text-black hover:bg-gray-100"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="space-y-3">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:text-black hover:bg-gray-100 transition-all"
        >
          <Store size={16} /> View Store
        </Link>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
          <UserButton afterSignOutUrl="/" />
          <div>
            <p className="text-[10px] text-gray-400 uppercase">Status</p>
            <p className="text-[11px] font-bold text-emerald-500">Online</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 h-9 w-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={18} className="text-gray-600" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 h-screen sticky top-0 bg-white border-r border-gray-100 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/20 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-gray-100 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}