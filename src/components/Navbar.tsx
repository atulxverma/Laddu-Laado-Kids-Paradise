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
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">

        {/* ── TOP BAR (logo + nav + icons) ── hides on scroll */}
        <motion.div
          animate={{
            y: scrolled ? -80 : 0,
            opacity: scrolled ? 0 : 1,
          }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className={`bg-white border-b border-gray-100 ${scrolled ? "pointer-events-none" : ""
            }`}
        >
          <div className="max-w-7xl mx-auto px-3 md:px-6 h-14 md:h-16 flex items-center justify-between gap-2">

            {/* LEFT: Hamburger + Logo */}
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-all active:scale-90 shrink-0"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <Link href="/" className="flex items-center gap-2.5 group min-w-0">
                <div className="h-9 w-9 md:h-10 md:w-10 shrink-0 rounded-full overflow-hidden shadow-md border border-gray-100 group-hover:scale-110 transition-transform duration-500 bg-white">
                  <img src="/logo.jpeg" alt="Laddu Laado" className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-black text-[17px] md:text-xl tracking-tighter uppercase italic whitespace-nowrap">
                    LADDU LAADO
                  </span>
                  <span className="hidden md:block text-[7px] font-black text-gray-400 uppercase tracking-[0.25em] mt-1">
                    Premium Kids Paradise
                  </span>
                </div>
              </Link>
            </div>

            {/* CENTER: Nav links desktop */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-black transition-all relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* RIGHT: Icons + Auth */}
            <div className="flex items-center gap-1 md:gap-1.5 shrink-0">
              <button onClick={() => setSearchOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                <Search size={18} />
              </button>

              <Link href="/wishlist" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                <Heart size={18} />
                {mounted && wishlist.items.length > 0 && (
                  <span className="absolute top-1 right-1 h-3.5 w-3.5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white">
                    {wishlist.items.length}
                  </span>
                )}
              </Link>

              <Link href="/cart" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                <ShoppingBag size={18} />
                {mounted && cartCount > 0 && (
                  <span className="absolute top-1 right-1 h-3.5 w-3.5 bg-black text-white text-[8px] font-black rounded-full flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="flex items-center gap-2 border-l border-gray-200 pl-2 md:pl-3 ml-1">
                {mounted && (
                  <>
                    {isSignedIn ? (
                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <Link href="/admin/dashboard"
                            className="hidden lg:flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full text-[9px] font-black uppercase border border-amber-200 hover:bg-amber-100 transition-all"
                          >
                            <LayoutDashboard size={11} /> Panel
                          </Link>
                        )}
                        <UserButton afterSignOutUrl="/">
                          <UserButton.MenuItems>
                            <UserButton.Link label="My Orders" labelIcon={<Package size={14} />} href="/orders" />
                            <UserButton.Link label="Wishlist" labelIcon={<Heart size={14} />} href="/wishlist" />
                          </UserButton.MenuItems>
                        </UserButton>
                      </div>
                    ) : (
                      <SignInButton mode="modal">
                        <button className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-4 md:px-5 py-2 rounded-full hover:opacity-80 transition-all shadow-md active:scale-95 whitespace-nowrap">
                          Login
                        </button>
                      </SignInButton>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── SECOND BAR — search bar line ──
            Desktop: always visible below top bar, slides up when scrolled
            On scroll: becomes fixed at top with glassmorphism
        */}
        <motion.div
          animate={{
            y: scrolled ? -64 : 0,
          }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className={`hidden md:block border-b transition-colors duration-300 ${scrolled
            ? "bg-white/60 backdrop-blur-2xl border-white/20 shadow-lg"
            : "bg-white/90 backdrop-blur-md border-gray-100"
            }`}
        >
          <div className="max-w-7xl mx-auto px-6 h-11 flex items-center justify-between gap-6">

            {/* Gender filters */}
            <div className="flex items-center gap-6 shrink-0">
              <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-black hover:opacity-60 transition-opacity">
                Categories <ChevronDown size={11} className="text-gray-400" />
              </button>
              <div className="h-3.5 w-[1px] bg-gray-200" />
              {genderFilters.map((filter) => (
                <Link key={filter.label} href={filter.href}
                  className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 hover:text-black transition-all"
                >
                  {filter.label}
                </Link>
              ))}
            </div>

            {/* Search bar */}
            <div className="flex-1 flex justify-center px-6">
              <button
                onClick={() => setSearchOpen(true)}
                className={`flex items-center gap-3 w-full max-w-md rounded-xl px-4 py-1.5 transition-all border ${scrolled
                  ? "bg-white/50 backdrop-blur-md border-white/30 hover:bg-white/80"
                  : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                  }`}
              >
                <Search size={13} className="text-gray-400 shrink-0" />
                <span className="text-xs text-gray-400 font-medium italic">Discover premium drops...</span>
                <div className="ml-auto">
                  <span className="text-[9px] text-gray-300 bg-white border border-gray-100 px-1.5 py-0.5 rounded font-mono">CTRL K</span>
                </div>
              </button>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 shrink-0">
              {categories.map((cat) => (
                <Link key={cat} href={`/shop?category=${cat.toLowerCase()}`}
                  className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border transition-all hover:bg-black hover:text-white hover:border-black ${scrolled ? "border-gray-200/50 text-gray-500 bg-white/20" : "border-gray-100 text-gray-400"
                    }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── MOBILE: compact sticky bar shown when scrolled ── */}
        <AnimatePresence>
          {scrolled && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="fixed top-0 left-0 right-0 z-[55] md:hidden bg-white/70 backdrop-blur-2xl border-b border-white/20 shadow-md"
            >
              <div className="px-3 h-11 flex items-center gap-2">
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 hover:bg-gray-100/80 rounded-full">
                  <Menu size={18} />
                </button>
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex-1 flex items-center gap-2 bg-white/50 backdrop-blur-md border border-white/30 rounded-xl px-3 py-1.5"
                >
                  <Search size={13} className="text-gray-400" />
                  <span className="text-xs text-gray-400 font-medium italic">Search...</span>
                </button>
                <Link href="/cart" className="relative p-1.5">
                  <ShoppingBag size={18} className="text-gray-700" />
                  {mounted && cartCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 h-3.5 w-3.5 bg-black text-white text-[8px] font-black rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </header>

      <div className="h-16 md:h-28" />

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-[70] w-[280px] bg-white shadow-2xl flex flex-col md:hidden"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-full overflow-hidden border border-gray-100">
                    <img src="/logo.jpeg" alt="Logo" className="h-full w-full object-cover" />
                  </div>
                  <span className="font-black text-sm italic text-black uppercase whitespace-nowrap">LADDU LAADO</span>
                </div>
                <button onClick={() => setMenuOpen(false)} className="h-9 w-9 bg-gray-100 rounded-full flex items-center justify-center">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
                <button
                  onClick={() => { setMenuOpen(false); setSearchOpen(true) }}
                  className="w-full flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-gray-400"
                >
                  <Search size={18} />
                  <span className="text-sm font-medium">Search items...</span>
                </button>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Account</p>
                  {isSignedIn ? (
                    <>
                      <Link href="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-sm font-bold text-black bg-gray-50 p-3.5 rounded-2xl">
                        <Package size={18} className="text-gray-400" /> My Orders
                      </Link>
                      <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-sm font-bold text-black bg-gray-50 p-3.5 rounded-2xl">
                        <Heart size={18} className="text-gray-400" /> Wishlist
                      </Link>
                    </>
                  ) : (
                    <SignInButton mode="modal">
                      <button onClick={() => setMenuOpen(false)} className="w-full bg-black text-white py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest">
                        Login / Register
                      </button>
                    </SignInButton>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Shop</p>
                  {genderFilters.map((filter) => (
                    <Link key={filter.label} href={filter.href} onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between text-base font-black italic border-b border-gray-100 py-3"
                    >
                      {filter.label}
                      <span className="text-gray-300">→</span>
                    </Link>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <Link key={cat} href={`/shop?category=${cat.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                      className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-[10px] font-black uppercase"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-100 space-y-3">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                      className="block text-sm font-bold text-gray-500 uppercase tracking-widest"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 space-y-3">
                {mounted && isAdmin && (
                  <Link href="/admin/dashboard" onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-amber-600 text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest"
                  >
                    <LayoutDashboard size={14} /> Admin Dashboard
                  </Link>
                )}
                {mounted && isSignedIn && user && (
                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <UserButton afterSignOutUrl="/" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-black truncate text-black">{user.fullName}</span>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase">Active</span>
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