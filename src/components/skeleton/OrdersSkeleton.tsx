export default function OrdersSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 animate-pulse">
      {/* Heading */}
      <div className="space-y-3 mb-8">
        <div className="h-9 w-52 rounded bg-gray-300" />
        <div className="h-4 w-40 rounded bg-gray-200" />
      </div>

      {/* Orders */}
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-100 bg-white p-5"
          >
            {/* Top */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-3">
                <div className="h-5 w-40 rounded bg-gray-300" />
                <div className="h-4 w-56 rounded bg-gray-200" />
              </div>

              <div className="h-8 w-28 rounded-full bg-gray-200" />
            </div>

            {/* Product */}
            <div className="mt-6 flex gap-4">
              <div className="h-24 w-24 rounded-xl bg-gray-200 shrink-0" />

              <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 rounded bg-gray-300" />
                <div className="h-4 w-40 rounded bg-gray-200" />
                <div className="h-4 w-28 rounded bg-gray-200" />
                <div className="h-5 w-24 rounded bg-gray-300" />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="h-11 w-40 rounded-xl bg-gray-300" />
              <div className="h-11 w-36 rounded-xl bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}