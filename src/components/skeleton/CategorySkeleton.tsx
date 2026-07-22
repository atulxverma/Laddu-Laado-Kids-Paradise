import ProductGridSkeleton from "./ProductGridSkeleton";

export default function CategorySkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 animate-pulse">
      {/* Breadcrumb */}
      <div className="h-4 w-44 rounded bg-gray-200 mb-6" />

      {/* Category Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div className="space-y-3">
          <div className="h-9 w-56 rounded bg-gray-300" />
          <div className="h-4 w-72 rounded bg-gray-200" />
        </div>

        <div className="h-10 w-36 rounded-xl bg-gray-200" />
      </div>

      <div className="flex gap-8">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-28 rounded-2xl border border-gray-100 bg-white p-5 space-y-7">
            {/* Filter Heading */}
            <div className="h-6 w-28 rounded bg-gray-300" />

            {/* Filter Sections */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="h-4 w-24 rounded bg-gray-300" />

                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3"
                  >
                    <div className="h-4 w-4 rounded bg-gray-200" />
                    <div className="h-3 flex-1 rounded bg-gray-200" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {/* Mobile Filter + Sort */}
          <div className="lg:hidden flex gap-3 mb-5">
            <div className="h-11 flex-1 rounded-xl bg-gray-200" />
            <div className="h-11 w-32 rounded-xl bg-gray-200" />
          </div>

          {/* Product Count */}
          <div className="h-4 w-32 rounded bg-gray-200 mb-6" />

          {/* Product Grid */}
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    </div>
  );
}