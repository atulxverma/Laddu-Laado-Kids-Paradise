export default function ProductTableSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-52 rounded bg-gray-300" />
          <div className="h-4 w-72 rounded bg-gray-200" />
        </div>

        <div className="h-11 w-40 rounded-xl bg-gray-300" />
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="h-11 flex-1 rounded-xl bg-gray-200" />
        <div className="h-11 w-full md:w-48 rounded-xl bg-gray-200" />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
        {/* Table Head */}
        <div className="grid grid-cols-6 gap-4 border-b border-gray-100 px-6 py-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-4 rounded bg-gray-300" />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: 8 }).map((_, row) => (
          <div
            key={row}
            className="grid grid-cols-6 items-center gap-4 border-b border-gray-100 px-6 py-5"
          >
            {/* Product */}
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-lg bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-28 rounded bg-gray-300" />
                <div className="h-3 w-20 rounded bg-gray-200" />
              </div>
            </div>

            {/* Category */}
            <div className="h-4 w-20 rounded bg-gray-200" />

            {/* Price */}
            <div className="h-4 w-16 rounded bg-gray-300" />

            {/* Stock */}
            <div className="h-8 w-16 rounded-full bg-gray-200" />

            {/* Status */}
            <div className="h-8 w-20 rounded-full bg-gray-200" />

            {/* Actions */}
            <div className="flex gap-2">
              <div className="h-9 w-9 rounded-lg bg-gray-200" />
              <div className="h-9 w-9 rounded-lg bg-gray-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-10 w-10 rounded-lg bg-gray-200"
          />
        ))}
      </div>
    </div>
  );
}