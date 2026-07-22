export default function NavbarSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white animate-pulse">
      {/* Main Navbar */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto h-16 px-4 md:px-6 flex items-center justify-between">
          {/* Mobile Menu */}
          <div className="md:hidden h-8 w-8 rounded-full bg-gray-200" />

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <div className="h-10 w-32 md:h-14 md:w-40 rounded-xl bg-gray-200" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="h-4 w-12 rounded bg-gray-200" />
            <div className="h-4 w-12 rounded bg-gray-200" />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="h-9 w-9 rounded-full bg-gray-200" />

            {/* Wishlist */}
            <div className="hidden md:block h-9 w-9 rounded-full bg-gray-200" />

            {/* Cart */}
            <div className="h-9 w-9 rounded-full bg-gray-200" />

            {/* Login */}
            <div className="hidden md:block h-10 w-24 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>

      {/* Desktop Second Bar */}
      <div className="hidden md:block border-b border-gray-100">
        <div className="max-w-7xl mx-auto h-11 px-6 flex items-center justify-between">
          <div className="flex gap-8">
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="h-3 w-16 rounded bg-gray-200" />
          </div>

          {/* Search Bar */}
          <div className="h-9 w-96 rounded-xl bg-gray-200" />
        </div>
      </div>

      {/* Mobile Category Bar */}
      <div className="md:hidden border-b border-gray-100">
        <div className="flex justify-around py-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2"
            >
              <div className="h-5 w-5 rounded-full bg-gray-200" />
              <div className="h-2 w-12 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[119px] md:h-28" />
    </header>
  );
}