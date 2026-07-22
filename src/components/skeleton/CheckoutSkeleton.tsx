export default function CheckoutSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 animate-pulse">
      <div className="h-9 w-44 rounded bg-gray-300 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <div className="h-6 w-40 rounded bg-gray-300 mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-12 rounded-xl bg-gray-200"
                />
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <div className="h-6 w-36 rounded bg-gray-300 mb-5" />

            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4"
                >
                  <div className="h-5 w-5 rounded-full bg-gray-200" />
                  <div className="h-5 w-40 rounded bg-gray-200" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <aside className="rounded-2xl border border-gray-100 bg-white p-6 h-fit space-y-5">
          <div className="h-6 w-40 rounded bg-gray-300" />

          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex justify-between"
            >
              <div className="h-4 w-28 rounded bg-gray-200" />
              <div className="h-4 w-16 rounded bg-gray-200" />
            </div>
          ))}

          <div className="border-t pt-5 flex justify-between">
            <div className="h-5 w-24 rounded bg-gray-300" />
            <div className="h-5 w-28 rounded bg-gray-300" />
          </div>

          <div className="h-12 w-full rounded-xl bg-gray-300" />
        </aside>
      </div>
    </div>
  );
}