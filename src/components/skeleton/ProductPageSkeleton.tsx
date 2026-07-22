export default function ProductPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square w-full rounded-2xl bg-gray-200" />

          <div className="mt-4 grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-gray-200"
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-5">
          {/* Category */}
          <div className="h-4 w-24 rounded-full bg-gray-200" />

          {/* Title */}
          <div className="space-y-3">
            <div className="h-8 w-full rounded bg-gray-200" />
            <div className="h-8 w-3/4 rounded bg-gray-200" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="h-4 w-28 rounded bg-gray-200" />
            <div className="h-4 w-16 rounded bg-gray-200" />
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <div className="h-8 w-28 rounded bg-gray-300" />
            <div className="h-6 w-20 rounded bg-gray-200" />
          </div>

          {/* Description */}
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
            <div className="h-4 w-4/6 rounded bg-gray-200" />
          </div>

          {/* Size */}
          <div className="pt-3">
            <div className="h-4 w-20 rounded bg-gray-200 mb-3" />

            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-12 rounded-lg bg-gray-200"
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="pt-3">
            <div className="h-4 w-24 rounded bg-gray-200 mb-3" />

            <div className="h-11 w-32 rounded-xl bg-gray-200" />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-5">
            <div className="h-12 flex-1 rounded-xl bg-gray-300" />
            <div className="h-12 w-12 rounded-xl bg-gray-300" />
          </div>

          {/* Extra Info */}
          <div className="space-y-3 pt-6 border-t">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
            <div className="h-4 w-4/6 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}