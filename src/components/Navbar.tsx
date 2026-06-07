"use client"

import Link from "next/link"
import { Search, ShoppingBag, Menu, X, Heart, LayoutDashboard, Package, ChevronDown } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import SearchModal from "@/components/SearchModal"

const categories = ["Clothing", "Footwear", "Accessories", "Essentials"]

const navLinks = [
  { label: "About", href: "/about" },
  { label: "FAQs", href: "/faqs" },
]

const genderFilters = [
  { label: "BOYS", href: "/shop?gender=boy" },
  { label: "GIRLS", href: "/shop?gender=girl" },
  { label: "NEWBORN", href: "/shop?age=0-2y" },
]

export default function Navbar() {
  const { user, isSignedIn } = useUser()
  const cartItems = useCart((state) => state.items)
  const { items: wishlistItems } = useWishlist()
  
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const cartCount = cartItems.reduce((t, i) => t + i.quantity, 0)
  
  // ADMIN CHECK LOGIC
  const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // SEARCH SHORTCUT (Ctrl + K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? "shadow-md py-1" : "py-0"
        }`}
      >
        {/* --- TOP BAR (LOGO, MAIN NAV, ACTIONS) --- */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            
            {/* LEFT: Logo & Mobile Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 md:hidden hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Toggle Menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <Link href="/" className="flex items-center gap-2 group">
                <div className="h-9 w-9 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-white text-sm font-black italic">L</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg tracking-tighter leading-none uppercase italic">laddoo Laado</span>
                  <span className="text-[7px] font-black text-gray-300 uppercase tracking-[0.3em] leading-none mt-1">Premium Kids Wear</span>
                </div>
              </Link>
            </div>

            {/* CENTER: Main Info Links (Desktop Only) */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* RIGHT: User Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              
              {/* Search Icon (Always visible on mobile) */}
              <button 
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all md:hidden"
              >
                <Search size={20} />
              </button>

              {/* Wishlist Icon */}
              <Link href="/wishlist" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                <Heart size={20} />
                {mounted && wishlistItems.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Cart Icon */}
              <Link href="/cart" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all mr-2">
                <ShoppingBag size={20} />
                {mounted && cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 bg-black text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* AUTH SECTION */}
              <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
                {mounted && (
                  <>
                    {isSignedIn ? (
                      <div className="flex items-center gap-4">
                        {isAdmin && (
                          <Link 
                            href="/admin/dashboard" 
                            className="hidden lg:flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-[9px] font-black uppercase border border-amber-100"
                          >
                            <LayoutDashboard size={12} /> Panel
                          </Link>
                        )}
                        <UserButton afterSignOutUrl="/">
                          <UserButton.MenuItems>
                            <UserButton.Link
                              label="My Orders"
                              labelIcon={<Package size={14} />}
                              href="/orders"
                            />
                            <UserButton.Link
                              label="Wishlist"
                              labelIcon={<Heart size={14} />}
                              href="/wishlist"
                            />
                          </UserButton.MenuItems>
                        </UserButton>
                      </div>
                    ) : (
                      <SignInButton mode="modal">
                        <button className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-5 py-2.5 rounded-full hover:opacity-80 transition-all shadow-sm">
                          Login
                        </button>
                      </SignInButton>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM BAR (CATEGORIES, GENDER FILTERS, SEARCH) --- */}
        <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md hidden md:block">
          <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
            
            <div className="flex items-center gap-8">
              {/* Categories Label */}
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black group">
                Categories <ChevronDown size={12} className="text-gray-400 group-hover:text-black transition-colors" />
              </button>

              <div className="h-4 w-[1px] bg-gray-100" />

              {/* Gender Filters */}
              <div className="flex items-center gap-8">
                {genderFilters.map((filter) => (
                  <Link
                    key={filter.label}
                    href={filter.href}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all"
                  >
                    {filter.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Search Bar (Large Input Style) */}
            <div className="flex-1 flex justify-center px-10">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-3 w-full max-w-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 hover:border-gray-300 hover:bg-gray-100 transition-all group"
              >
                <Search size={14} className="text-gray-400 shrink-0" />
                <span className="text-xs text-gray-400 font-medium">Search products...</span>
                <div className="ml-auto flex items-center gap-1">
                  <span className="text-[9px] text-gray-300 bg-white border border-gray-100 px-1.5 py-0.5 rounded font-mono">
                    CTRL K
                  </span>
                </div>
              </button>
            </div>

            {/* Quick Category Pills */}
            <div className="flex items-center gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/shop?category=${cat.toLowerCase()}`}
                  className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:bg-black hover:text-white hover:border-black transition-all"
                >
                  {cat}
                </Link>
              ))}
            </div>

          </div>
        </div>
      </header>

      {/* SEARCH MODAL */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* --- MOBILE DRAWER MENU (ENHANCED) --- */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-[300px] bg-white shadow-2xl flex flex-col md:hidden"
            >
              {/* Mobile Drawer Header */}
              <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-black italic">L</span>
                  </div>
                  <span className="font-black text-sm tracking-widest italic">NAVIGATION</span>
                </div>
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="h-10 w-10 bg-white rounded-full shadow-sm flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Mobile Search Button */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Quick Search</p>
                  <button
                    onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
                    className="w-full flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-400"
                  >
                    <Search size={20} />
                    <span className="text-sm font-bold">Search items...</span>
                  </button>
                </div>

                {/* Account Actions for Mobile */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">My Account</p>
                  {isSignedIn ? (
                    <div className="grid grid-cols-1 gap-2">
                      <Link 
                        href="/orders" 
                        onClick={() => setMenuOpen(false)} 
                        className="flex items-center gap-3 text-lg font-bold text-black bg-gray-50 p-4 rounded-2xl active:scale-95 transition-all"
                      >
                        <Package size={20} className="text-gray-400" /> My Orders
                      </Link>
                      <Link 
                        href="/wishlist" 
                        onClick={() => setMenuOpen(false)} 
                        className="flex items-center gap-3 text-lg font-bold text-black bg-gray-50 p-4 rounded-2xl active:scale-95 transition-all"
                      >
                        <Heart size={20} className="text-gray-400" /> Favorites
                      </Link>
                    </div>
                  ) : (
                    <SignInButton mode="modal">
                      <button onClick={() => setMenuOpen(false)} className="w-full bg-black text-white py-4 rounded-2xl font-bold text-sm">
                        Login / Register
                      </button>
                    </SignInButton>
                  )}
                </div>

                {/* Shop by Collections */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Shop Collection</p>
                  <div className="flex flex-col gap-2">
                    {genderFilters.map((filter) => (
                      <Link
                        key={filter.label}
                        href={filter.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between text-2xl font-black italic border-b border-gray-50 pb-2 group"
                      >
                        {filter.label}
                        <span className="text-gray-200 group-hover:text-black transition-colors">→</span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Categories Scroll */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                   {categories.map(cat => (
                     <Link key={cat} href={`/shop?category=${cat.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="shrink-0 px-4 py-2 bg-gray-100 rounded-full text-[10px] font-black uppercase">{cat}</Link>
                   ))}
                </div>

                {/* Standard Nav Links */}
                <div className="space-y-4 pt-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block text-sm font-bold text-gray-500 uppercase tracking-widest"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Drawer Footer */}
              <div className="mt-auto p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
                {mounted && isAdmin && (
                  <Link 
                    href="/admin/dashboard" 
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-3 w-full bg-amber-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-200"
                  >
                    <LayoutDashboard size={16} /> Admin Dashboard
                  </Link>
                )}
                
                {mounted && isSignedIn && user && (
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                    <UserButton afterSignOutUrl="/" />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-700 truncate max-w-[120px]">{user.fullName}</span>
                      <span className="text-[10px] text-gray-400">Manage Account</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}