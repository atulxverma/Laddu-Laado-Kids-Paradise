"use client"

import Link from "next/link"
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Heart,
  LayoutDashboard,
  Package,
} from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs"
import SearchModal from "@/components/SearchModal"
import {
  syncCartWithDb,
  getDbCart,
} from "@/lib/actions"

import {
  Baby,
  Shirt,
  Sparkles,
} from "lucide-react"

const genderFilters = [
  {
    label: "Newborn",
    href: "/shop?ageGroup=0-2Y",
    icon: Baby,
  },
  {
    label: "Boys",
    href: "/shop?gender=Boy",
    icon: Shirt,
  },
  {
    label: "Girls",
    href: "/shop?gender=Girl",
    icon: Sparkles,
  },
]

const navLinks = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "FAQs",
    href: "/faqs",
  },
]

export default function Navbar() {
  const {
    user,
    isSignedIn,
    isLoaded,
  } = useUser()

  const cart = useCart()
  const wishlist = useWishlist()

  const cartHydrated = useRef(false)
  const previousUserId = useRef<string | null>(null)

  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const cartCount = cart.items.length

  const isAdmin =
    user?.primaryEmailAddress?.emailAddress ===
    process.env.NEXT_PUBLIC_ADMIN_EMAIL

  useEffect(() => {
    if (!isLoaded) return

    const initializeCart = async () => {
      if (!isSignedIn || !user?.id) {
        cartHydrated.current = false
        previousUserId.current = null

        cart.clearCart()
        wishlist.clearWishlist()

        localStorage.removeItem(
          "laddu-laado-auth-session"
        )

        return
      }

      const storedUserId =
        localStorage.getItem(
          "laddu-laado-auth-session"
        )

      if (
        storedUserId &&
        storedUserId !== user.id
      ) {
        cart.clearCart()
        wishlist.clearWishlist()
      }

      cartHydrated.current = false

      try {
        const dbCart = await getDbCart()

        const formatted = dbCart.map(
          (item: any) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,

            image:
              item.product.images?.[0]?.url ||
              "",

            size: item.size,
            quantity: item.quantity,

            color:
              item.product.color ||
              "Standard",

            category:
              item.product.category?.name ||
              "",

            stock: item.product.stock,
          })
        )

        cart.setItems(formatted)

        previousUserId.current = user.id

        localStorage.setItem(
          "laddu-laado-auth-session",
          user.id
        )
      } catch (error) {
        console.error(
          "Cart initialization error:",
          error
        )
      } finally {
        setTimeout(() => {
          cartHydrated.current = true
        }, 100)
      }
    }

    initializeCart()
  }, [
    isLoaded,
    isSignedIn,
    user?.id,
  ])

  useEffect(() => {
    if (
      !isLoaded ||
      !isSignedIn ||
      !user?.id ||
      !cartHydrated.current
    ) {
      return
    }

    if (
      previousUserId.current !== user.id
    ) {
      return
    }

    const timer = setTimeout(async () => {
      try {
        const result =
          await syncCartWithDb(
            cart.items.map((item) => ({
              id: item.id,
              size: item.size,
              quantity: item.quantity,
            }))
          )

        if (result?.error) {
          console.error(
            "Cart sync error:",
            result.error
          )
        }
      } catch (error) {
        console.error(
          "Cart sync failed:",
          error
        )
      }
    }, 800)

    return () => {
      clearTimeout(timer)
    }
  }, [
    cart.items,
    isLoaded,
    isSignedIn,
    user?.id,
  ])

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }

    handleScroll()

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    )

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      )
    }
  }, [])

  useEffect(() => {
    const down = (
      event: KeyboardEvent
    ) => {
      if (
        event.key.toLowerCase() === "k" &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()

        setSearchOpen(
          (current) => !current
        )
      }
    }

    document.addEventListener(
      "keydown",
      down
    )

    return () => {
      document.removeEventListener(
        "keydown",
        down
      )
    }
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow =
        "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">

        <motion.div
          animate={{
            y: scrolled ? -80 : 0,
            opacity: scrolled ? 0 : 1,
          }}
          transition={{
            duration: 0.35,
            ease: [0.4, 0, 0.2, 1],
          }}
          className={`bg-white border-b border-gray-100 ${scrolled
              ? "pointer-events-none"
              : ""
            }`}
        >
          <div
            className="
              max-w-7xl
              mx-auto
              px-3
              md:px-6
              h-16
              md:h-16
              flex
              items-center
              justify-between
            "
          >

            {/* MOBILE LEFT */}

            <div className="flex md:hidden items-center shrink-0">
              <button
                type="button"
                onClick={() =>
                  setMenuOpen(true)
                }
                aria-label="Open menu"
                className="
                  h-10
                  w-10
                  flex
                  items-center
                  justify-center
                  rounded-full
                  text-gray-700
                  active:scale-90
                  transition-all
                "
              >
                <Menu size={22} />
              </button>
            </div>

            {/* LOGO */}

            <Link
              href="/"
              className="
                absolute
                left-1/2
                -translate-x-1/2
                md:static
                md:translate-x-0
                flex
                items-center
                gap-2
                group
              "
            >
              <div
                className="
                  h-9
                  w-9
                  md:h-10
                  md:w-10
                  shrink-0
                  rounded-full
                  overflow-hidden
                  shadow-sm
                  border
                  border-gray-100
                  bg-white
                  group-hover:scale-105
                  transition-transform
                "
              >
                <img
                  src="/logo.jpeg"
                  alt="Laddu Laado"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="flex flex-col leading-none">
                <span
                  className="
                    font-black
                    text-[13px]
                    sm:text-[15px]
                    md:text-xl
                    tracking-tighter
                    uppercase
                    italic
                    whitespace-nowrap
                  "
                >
                  LADDU LAADO
                </span>

                <span
                  className="
                    hidden
                    md:block
                    text-[7px]
                    font-black
                    text-gray-400
                    uppercase
                    tracking-[0.25em]
                    mt-1
                  "
                >
                  Premium Kids Paradise
                </span>
              </div>
            </Link>

            {/* DESKTOP CENTER NAV */}

            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="
                    text-[11px]
                    font-black
                    uppercase
                    tracking-[0.2em]
                    text-gray-500
                    hover:text-black
                    transition-all
                    relative
                    group
                  "
                >
                  {link.label}

                  <span
                    className="
                      absolute
                      -bottom-1
                      left-0
                      w-0
                      h-0.5
                      bg-black
                      transition-all
                      group-hover:w-full
                    "
                  />
                </Link>
              ))}
            </nav>

            {/* MOBILE RIGHT */}

            <div className="flex md:hidden items-center gap-0.5 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setSearchOpen(true)
                }
                aria-label="Search"
                className="
                  h-10
                  w-10
                  flex
                  items-center
                  justify-center
                  rounded-full
                  text-gray-700
                  active:scale-90
                  transition-all
                "
              >
                <Search size={20} />
              </button>

              <Link
                href="/cart"
                aria-label="Cart"
                className="
                  relative
                  h-10
                  w-10
                  flex
                  items-center
                  justify-center
                  rounded-full
                  text-gray-700
                  active:scale-90
                  transition-all
                "
              >
                <ShoppingBag size={20} />

                {mounted &&
                  cartCount > 0 && (
                    <span
                      className="
                        absolute
                        top-0.5
                        right-0
                        min-w-[16px]
                        h-4
                        px-1
                        bg-black
                        text-white
                        text-[8px]
                        font-black
                        rounded-full
                        flex
                        items-center
                        justify-center
                        border
                        border-white
                      "
                    >
                      {cartCount > 99
                        ? "99+"
                        : cartCount}
                    </span>
                  )}
              </Link>
            </div>

            {/* DESKTOP RIGHT */}

            <div className="hidden md:flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() =>
                  setSearchOpen(true)
                }
                className="
                  p-2
                  text-gray-600
                  hover:bg-gray-100
                  rounded-full
                  transition-all
                "
              >
                <Search size={18} />
              </button>

              <Link
                href="/wishlist"
                className="
                  relative
                  p-2
                  text-gray-600
                  hover:bg-gray-100
                  rounded-full
                  transition-all
                "
              >
                <Heart size={18} />

                {mounted &&
                  wishlist.items.length >
                  0 && (
                    <span
                      className="
                        absolute
                        top-1
                        right-1
                        min-w-[14px]
                        h-3.5
                        px-0.5
                        bg-red-500
                        text-white
                        text-[8px]
                        font-black
                        rounded-full
                        flex
                        items-center
                        justify-center
                        border
                        border-white
                      "
                    >
                      {wishlist.items.length}
                    </span>
                  )}
              </Link>

              <Link
                href="/cart"
                className="
                  relative
                  p-2
                  text-gray-600
                  hover:bg-gray-100
                  rounded-full
                  transition-all
                "
              >
                <ShoppingBag size={18} />

                {mounted &&
                  cartCount > 0 && (
                    <span
                      className="
                        absolute
                        top-1
                        right-1
                        min-w-[14px]
                        h-3.5
                        px-0.5
                        bg-black
                        text-white
                        text-[8px]
                        font-black
                        rounded-full
                        flex
                        items-center
                        justify-center
                        border
                        border-white
                      "
                    >
                      {cartCount}
                    </span>
                  )}
              </Link>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  border-l
                  border-gray-200
                  pl-3
                  ml-1
                "
              >
                {mounted && (
                  <>
                    {isSignedIn ? (
                      <div className="flex items-center gap-2">
                        {isAdmin && (
                          <Link
                            href="/admin/dashboard"
                            className="
                              hidden
                              lg:flex
                              items-center
                              gap-1.5
                              bg-amber-50
                              text-amber-700
                              px-3
                              py-1.5
                              rounded-full
                              text-[9px]
                              font-black
                              uppercase
                              border
                              border-amber-200
                              hover:bg-amber-100
                              transition-all
                            "
                          >
                            <LayoutDashboard
                              size={11}
                            />

                            Panel
                          </Link>
                        )}

                        <UserButton afterSignOutUrl="/">
                          <UserButton.MenuItems>
                            <UserButton.Link
                              label="My Orders"
                              labelIcon={
                                <Package
                                  size={14}
                                />
                              }
                              href="/orders"
                            />

                            <UserButton.Link
                              label="Wishlist"
                              labelIcon={
                                <Heart
                                  size={14}
                                />
                              }
                              href="/wishlist"
                            />
                          </UserButton.MenuItems>
                        </UserButton>
                      </div>
                    ) : (
                      <SignInButton mode="modal">
                        <button
                          className="
                            text-[10px]
                            font-black
                            uppercase
                            tracking-widest
                            bg-black
                            text-white
                            px-5
                            py-2
                            rounded-full
                            hover:opacity-80
                            transition-all
                            shadow-md
                            active:scale-95
                            whitespace-nowrap
                          "
                        >
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

        {/* DESKTOP SECOND BAR */}

        <motion.div
          animate={{
            y: scrolled ? -64 : 0,
          }}
          transition={{
            duration: 0.35,
            ease: [0.4, 0, 0.2, 1],
          }}
          className={`hidden md:block border-b transition-colors duration-300 ${scrolled
              ? "bg-white/60 backdrop-blur-2xl border-white/20 shadow-lg"
              : "bg-white/90 backdrop-blur-md border-gray-100"
            }`}
        >
          <div
            className="
              max-w-7xl
              mx-auto
              px-6
              h-11
              flex
              items-center
              gap-10
            "
          >
            <div className="flex items-center gap-8 mx-auto">
              {genderFilters.map(
                (filter) => (
                  <Link
                    key={filter.label}
                    href={filter.href}
                    className="
                      text-[10px]
                      font-black
                      uppercase
                      tracking-[0.2em]
                      text-gray-500
                      hover:text-black
                      transition-all
                      relative
                      group
                    "
                  >
                    {filter.label}

                    <span
                      className="
                        absolute
                        -bottom-1
                        left-0
                        w-0
                        h-[2px]
                        bg-black
                        transition-all
                        group-hover:w-full
                      "
                    />
                  </Link>
                )
              )}
            </div>

            <div className="flex-1 flex justify-center px-6">
              <button
                type="button"
                onClick={() =>
                  setSearchOpen(true)
                }
                className={`flex items-center gap-3 w-full max-w-md rounded-xl px-4 py-1.5 transition-all border ${scrolled
                    ? "bg-white/50 backdrop-blur-md border-white/30 hover:bg-white/80"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                  }`}
              >
                <Search
                  size={13}
                  className="text-gray-400 shrink-0"
                />

                <span
                  className="
                    text-xs
                    text-gray-400
                    font-medium
                    italic
                    truncate
                  "
                >
                  Discover premium drops...
                </span>

                <div className="ml-auto">
                  <span
                    className="
                      text-[9px]
                      text-gray-300
                      bg-white
                      border
                      border-gray-100
                      px-1.5
                      py-0.5
                      rounded
                      font-mono
                      whitespace-nowrap
                    "
                  >
                    CTRL K
                  </span>
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        <div
          className="md:hidden bg-white border-b border-gray-200 overflow-x-auto no-scrollbar"
        >
          <div className="flex items-center justify-around min-w-full px-3 py-2">

            {genderFilters.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex flex-col items-center justify-center flex-1"
                >
                  <Icon
                    size={16}
                    strokeWidth={2}
                    className="text-gray-700 mx-auto"
                  />

                  <span className="
mt-1
text-[9px]
font-medium
text-gray-700
leading-none
whitespace-nowrap
">
                    {item.label}
                  </span>
                </Link>
              )
            })}

          </div>
        </div>

        {/* MOBILE SCROLLED NAVBAR */}

        <AnimatePresence>
          {scrolled && (
            <motion.div
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                duration: 0.25,
              }}
              className="
                fixed
                top-0
                left-0
                right-0
                z-[55]
                md:hidden
                bg-white
                backdrop-blur-2xl
                border-b
                border-gray-100
                shadow-sm
              "
            >
              <div
                className="
                  px-3
                  h-14
                  flex
                  items-center
                  justify-between
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setMenuOpen(true)
                  }
                  className="
                    h-10
                    w-10
                    flex
                    items-center
                    justify-center
                    rounded-full
                  "
                >
                  <Menu size={20} />
                </button>

                <Link
                  href="/"
                  className="
                    absolute
                    left-1/2
                    -translate-x-1/2
                    flex
                    items-center
                    gap-2
                  "
                >
                  <div
                    className="
                      h-8
                      w-8
                      rounded-full
                      overflow-hidden
                      border
                      border-gray-100
                    "
                  >
                    <img
                      src="/logo.jpeg"
                      alt="Laddu Laado"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <span
                    className="
                      text-[13px]
                      font-black
                      italic
                      tracking-tighter
                      whitespace-nowrap
                    "
                  >
                    LADDU LAADO
                  </span>
                </Link>

                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setSearchOpen(true)
                    }
                    className="
                      h-10
                      w-10
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Search size={19} />
                  </button>

                  <Link
                    href="/cart"
                    className="
                      relative
                      h-10
                      w-10
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <ShoppingBag
                      size={19}
                    />

                    {mounted &&
                      cartCount > 0 && (
                        <span
                          className="
                            absolute
                            top-0
                            right-0
                            min-w-[16px]
                            h-4
                            px-1
                            bg-black
                            text-white
                            text-[8px]
                            font-black
                            rounded-full
                            flex
                            items-center
                            justify-center
                          "
                        >
                          {cartCount}
                        </span>
                      )}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="h-16 md:h-28" />

      <SearchModal
        open={searchOpen}
        onClose={() =>
          setSearchOpen(false)
        }
      />

      {/* MOBILE DRAWER */}

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() =>
                setMenuOpen(false)
              }
              className="
                fixed
                inset-0
                z-[60]
                bg-black/50
                backdrop-blur-sm
                md:hidden
              "
            />

            <motion.aside
              initial={{
                x: "-100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className="
                fixed
                top-0
                left-0
                bottom-0
                z-[70]
                w-[280px]
                max-w-[85vw]
                bg-white
                shadow-2xl
                flex
                flex-col
                md:hidden
              "
            >
              <div
                className="
                  p-5
                  border-b
                  border-gray-100
                  flex
                  items-center
                  justify-between
                "
              >
                <Link
                  href="/"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="flex items-center gap-2.5"
                >
                  <div
                    className="
                      h-9
                      w-9
                      rounded-full
                      overflow-hidden
                      border
                      border-gray-100
                    "
                  >
                    <img
                      src="/logo.jpeg"
                      alt="Logo"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <span
                    className="
                      font-black
                      text-sm
                      italic
                      text-black
                      uppercase
                      whitespace-nowrap
                    "
                  >
                    LADDU LAADO
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="
                    h-9
                    w-9
                    bg-gray-100
                    rounded-full
                    flex
                    items-center
                    justify-center
                  "
                >
                  <X size={18} />
                </button>
              </div>

              <div
                className="
                  flex-1
                  overflow-y-auto
                  p-5
                  space-y-6
                  no-scrollbar
                "
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    setSearchOpen(true)
                  }}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    bg-gray-50
                    border
                    border-gray-100
                    rounded-2xl
                    px-4
                    py-3
                    text-gray-400
                  "
                >
                  <Search size={18} />

                  <span className="text-sm font-medium">
                    Search items...
                  </span>
                </button>

                <div className="space-y-2">
                  <p
                    className="
                      text-[10px]
                      font-black
                      text-gray-300
                      uppercase
                      tracking-widest
                    "
                  >
                    Account
                  </p>

                  {isSignedIn ? (
                    <>
                      <Link
                        href="/orders"
                        onClick={() =>
                          setMenuOpen(false)
                        }
                        className="
                          flex
                          items-center
                          gap-3
                          text-sm
                          font-bold
                          text-black
                          bg-gray-50
                          p-3.5
                          rounded-2xl
                        "
                      >
                        <Package
                          size={18}
                          className="text-gray-400"
                        />

                        My Orders
                      </Link>

                      <Link
                        href="/wishlist"
                        onClick={() =>
                          setMenuOpen(false)
                        }
                        className="
                          flex
                          items-center
                          justify-between
                          text-sm
                          font-bold
                          text-black
                          bg-gray-50
                          p-3.5
                          rounded-2xl
                        "
                      >
                        <div className="flex items-center gap-3">
                          <Heart
                            size={18}
                            className="text-gray-400"
                          />

                          Wishlist
                        </div>

                        {mounted &&
                          wishlist.items
                            .length > 0 && (
                            <span
                              className="
                                min-w-[20px]
                                h-5
                                px-1.5
                                bg-red-500
                                text-white
                                rounded-full
                                text-[9px]
                                font-black
                                flex
                                items-center
                                justify-center
                              "
                            >
                              {
                                wishlist.items
                                  .length
                              }
                            </span>
                          )}
                      </Link>
                    </>
                  ) : (
                    <SignInButton mode="modal">
                      <button
                        onClick={() =>
                          setMenuOpen(false)
                        }
                        className="
                          w-full
                          bg-black
                          text-white
                          py-3.5
                          rounded-2xl
                          font-black
                          uppercase
                          text-xs
                          tracking-widest
                        "
                      >
                        Login / Register
                      </button>
                    </SignInButton>
                  )}
                </div>

                <div className="space-y-1">
                  <p
                    className="
                      text-[10px]
                      font-black
                      text-gray-300
                      uppercase
                      tracking-widest
                      mb-2
                    "
                  >
                    Shop
                  </p>

                  {genderFilters.map(
                    (filter) => (
                      <Link
                        key={filter.label}
                        href={filter.href}
                        onClick={() =>
                          setMenuOpen(false)
                        }
                        className="
                          flex
                          items-center
                          justify-between
                          text-base
                          font-black
                          italic
                          border-b
                          border-gray-100
                          py-3
                        "
                      >
                        {filter.label}

                        <span className="text-gray-300">
                          →
                        </span>
                      </Link>
                    )
                  )}
                </div>

                <div
                  className="
                    pt-2
                    border-t
                    border-gray-100
                    space-y-3
                  "
                >
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() =>
                        setMenuOpen(false)
                      }
                      className="
                        block
                        text-sm
                        font-bold
                        text-gray-500
                        uppercase
                        tracking-widest
                      "
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div
                className="
                  p-5
                  border-t
                  border-gray-100
                  space-y-3
                "
              >
                {mounted &&
                  isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() =>
                        setMenuOpen(false)
                      }
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        w-full
                        bg-amber-600
                        text-white
                        py-3.5
                        rounded-2xl
                        text-xs
                        font-black
                        uppercase
                        tracking-widest
                      "
                    >
                      <LayoutDashboard
                        size={14}
                      />

                      Admin Dashboard
                    </Link>
                  )}

                {mounted &&
                  isSignedIn &&
                  user && (
                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        bg-gray-50
                        p-3
                        rounded-xl
                        border
                        border-gray-100
                      "
                    >
                      <UserButton afterSignOutUrl="/" />

                      <div
                        className="
                          flex
                          flex-col
                          overflow-hidden
                          min-w-0
                        "
                      >
                        <span
                          className="
                            text-xs
                            font-black
                            truncate
                            text-black
                          "
                        >
                          {user.fullName ||
                            "User"}
                        </span>

                        <span
                          className="
                            text-[10px]
                            font-bold
                            text-emerald-500
                            uppercase
                          "
                        >
                          Active
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}