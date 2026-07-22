export default function CartSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 animate-pulse">
      {/* Page Title */}
      <div className="h-9 w-40 rounded-lg bg-gray-300 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4"
            >
              {/* Product Image */}
              <div className="h-32 w-28 md:h-36 md:w-32 rounded-xl bg-gray-200 shrink-0" />

              {/* Product Details */}
              <div className="flex-1 space-y-3">
                <div className="h-5 w-3/4 rounded bg-gray-300" />

                <div className="h-4 w-28 rounded bg-gray-200" />

                <div className="h-4 w-20 rounded bg-gray-200" />

                <div className="h-6 w-24 rounded bg-gray-300" />

                <div className="flex items-center justify-between pt-3">
                  {/* Quantity */}
                  <div className="h-10 w-32 rounded-xl bg-gray-200" />

                  {/* Remove */}
                  <div className="h-9 w-9 rounded-full bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6 space-y-5">
          {/* Heading */}
          <div className="h-6 w-40 rounded bg-gray-300" />

          {/* Price Rows */}
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex justify-between items-center"
            >
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-4 w-16 rounded bg-gray-200" />
            </div>
          ))}

          <div className="border-t pt-5">
            <div className="flex justify-between items-center">
              <div className="h-5 w-20 rounded bg-gray-300" />
              <div className="h-5 w-24 rounded bg-gray-300" />
            </div>
          </div>

          {/* Coupon */}
          <div className="space-y-3">
            <div className="h-11 w-full rounded-xl bg-gray-200" />
            <div className="h-11 w-full rounded-xl bg-gray-300" />
          </div>

          {/* Checkout Button */}
          <div className="h-12 w-full rounded-xl bg-gray-300" />

          {/* Continue Shopping */}
          <div className="h-5 w-36 mx-auto rounded bg-gray-200" />
        </aside>
      </div>
    </div>
  );
}