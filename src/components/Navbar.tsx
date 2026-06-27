"use client"

import Link from "next/link"
import { Search, ShoppingBag, Menu, X, Heart, LayoutDashboard, Package, ChevronDown } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import SearchModal from "@/components/SearchModal"
import { syncCartWithDb, getDbCart } from "@/lib/actions"

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
  const { user, isSignedIn, isLoaded } = useUser()
  const cart = useCart()
  const wishlist = useWishlist()
  
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const cartCount = cart.items.reduce((t, i) => t + i.quantity, 0)
  const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.id) {
      const lastKnownUser = localStorage.getItem("laddu-laado-auth-session")
      if (lastKnownUser && lastKnownUser !== user.id) {
        console.warn("User Switch Detected. Resetting Local State...")
        cart.clearCart()
        wishlist.clearWishlist()
      }
      localStorage.setItem("laddu-laado-auth-session", user.id)
    }
  }, [user?.id, isLoaded, isSignedIn])

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.id) {
      const loadData = async () => {
        try {
          const dbCart = await getDbCart(user.id)
          if (dbCart && dbCart.length > 0) {
            const formatted = dbCart.map((item: any) => ({
              id: item.product.id,
              name: item.product.name,
              price: item.product.price,
              image: item.product.images[0]?.url || "",
              size: item.size,
              quantity: item.quantity,
              color: item.product.color,
              category: item.product.category?.name
            }))
            cart.setItems(formatted)
          }
        } catch (err) { console.error("Sync Error", err) }
      }
      loadData()
    }
  }, [isSignedIn, isLoaded])

  useEffect(() => {
    if (isSignedIn && user?.id && cart.items.length >= 0) {
      const timer = setTimeout(() => {
        syncCartWithDb(user.id, cart.items)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [cart.items, isSignedIn, user?.id])

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-500 ${
          scrolled ? "shadow-md py-1" : "py-0"
        }`}
      >
        {/* TOP BAR */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            
            {/* LEFT: Logo & Mobile Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 md:hidden hover:bg-gray-100 rounded-full transition-all active:scale-90"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <Link href="/" className="flex items-center gap-3 group">
                <div className="h-11 w-11 relative rounded-full overflow-hidden shadow-lg border border-gray-100 group-hover:scale-110 transition-transform duration-500 bg-white">
                  <img 
                    src="/logo.jpeg" 
                    alt="Laddu Laado Logo" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col text-black">
                  <span className="font-black text-xl tracking-tighter leading-none uppercase italic">laddu Laado</span>
                  <span className="text-[7px] font-black text-gray-300 uppercase tracking-[0.3em] leading-none mt-1.5">Premium Kids Wear</span>
                </div>
              </Link>
            </div>

            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 md:gap-4">
              
              <button 
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <Search size={20} />
              </button>

              <Link href="/wishlist" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                <Heart size={20} />
                {mounted && wishlist.items.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white shadow-sm">
                    {wishlist.items.length}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all mr-2">
                <ShoppingBag size={20} />
                {mounted && cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-3.5 w-3.5 bg-black text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
                {mounted && (
                  <>
                    {isSignedIn ? (
                      <div className="flex items-center gap-4">
                        {isAdmin && (
                          <Link 
                            href="/admin/dashboard" 
                            className="hidden lg:flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-[9px] font-black uppercase border border-amber-100 hover:bg-amber-100 transition-all shadow-sm"
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
                        <button className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-6 py-2.5 rounded-full hover:opacity-80 transition-all shadow-md active:scale-95">
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

        <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md hidden md:block">
          <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
            
            <div className="flex items-center gap-8">
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black group">
                Categories <ChevronDown size={12} className="text-gray-400 group-hover:text-black transition-colors" />
              </button>

              <div className="h-4 w-[1px] bg-gray-100" />

              <div className="flex items-center gap-8">
                {genderFilters.map((filter) => (
                  <Link
                    key={filter.label}
                    href={filter.href}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-all hover:scale-105"
                  >
                    {filter.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex-1 flex justify-center px-10">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-3 w-full max-w-sm bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 hover:border-gray-300 hover:bg-gray-100 transition-all group shadow-inner"
              >
                <Search size={14} className="text-gray-400 shrink-0" />
                <span className="text-xs text-gray-400 font-medium italic">Discover premium drops...</span>
                <div className="ml-auto flex items-center gap-1">
                  <span className="text-[9px] text-gray-300 bg-white border border-gray-100 px-1.5 py-0.5 rounded font-mono shadow-sm">
                    CTRL K
                  </span>
                </div>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/shop?category=${cat.toLowerCase()}`}
                  className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-gray-100 text-gray-400 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
                >
                  {cat}
                </Link>
              ))}
            </div>

          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

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
              <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-black rounded-full overflow-hidden shadow-lg border border-gray-100">
                    <img 
                      src="/logo.jpeg" 
                      alt="Logo" 
                      className="h-full w-full object-cover" 
                    />
                  </div>
                  <span className="font-black text-sm tracking-widest italic text-black">NAVIGATION</span>
                </div>
                <button 
                  onClick={() => setMenuOpen(false)}
                  className="h-10 w-10 bg-white rounded-full shadow-sm flex items-center justify-center active:scale-90 transition-transform"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Quick Search</p>
                  <button
                    onClick={() => { setMenuOpen(false); setSearchOpen(true); }}
                    className="w-full flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-400 shadow-inner"
                  >
                    <Search size={20} />
                    <span className="text-sm font-bold">Search items...</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Account & Personal</p>
                  {isSignedIn ? (
                    <div className="grid grid-cols-1 gap-2">
                      <Link 
                        href="/orders" 
                        onClick={() => setMenuOpen(false)} 
                        className="flex items-center gap-3 text-lg font-bold text-black bg-gray-50 p-4 rounded-2xl active:scale-95 shadow-sm transition-all"
                      >
                        <Package size={20} className="text-gray-400" /> My Orders
                      </Link>
                      <Link 
                        href="/wishlist" 
                        onClick={() => setMenuOpen(false)} 
                        className="flex items-center gap-3 text-lg font-bold text-black bg-gray-50 p-4 rounded-2xl active:scale-95 shadow-sm transition-all"
                      >
                        <Heart size={20} className="text-gray-400" /> Favorites
                      </Link>
                    </div>
                  ) : (
                    <SignInButton mode="modal">
                      <button onClick={() => setMenuOpen(false)} className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase text-xs shadow-lg active:scale-95 transition-all">
                        Login / Register
                      </button>
                    </SignInButton>
                  )}
                </div>

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
                        <span className="text-gray-200 group-hover:text-black transition-colors transform group-hover:translate-x-1 duration-300">→</span>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                   {categories.map(cat => (
                     <Link key={cat} href={`/shop?category=${cat.toLowerCase()}`} onClick={() => setMenuOpen(false)} className="shrink-0 px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-black uppercase shadow-sm font-bold">{cat}</Link>
                   ))}
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-50">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block text-sm font-bold text-gray-500 uppercase tracking-widest hover:text-black transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-auto p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
                {mounted && isAdmin && (
                  <Link 
                    href="/admin/dashboard" 
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-3 w-full bg-amber-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-amber-200 active:scale-95 transition-all"
                  >
                    <LayoutDashboard size={16} /> Admin Dashboard
                  </Link>
                )}
                
                {mounted && isSignedIn && user && (
                  <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-md">
                    <UserButton afterSignOutUrl="/" />
                    <div className="flex flex-col overflow-hidden text-black">
                      <span className="text-xs font-black truncate">{user.fullName}</span>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Active Profile</span>
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