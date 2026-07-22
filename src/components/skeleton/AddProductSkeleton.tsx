export default function AddProductSkeleton() {
  return (
    <div className="max-w-5xl mx-auto animate-pulse space-y-8">
      {/* Heading */}
      <div className="space-y-2">
        <div className="h-8 w-56 rounded bg-gray-300" />
        <div className="h-4 w-72 rounded bg-gray-200" />
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 md:p-8 space-y-8">
        {/* Image Upload */}
        <div>
          <div className="h-5 w-28 rounded bg-gray-300 mb-4" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 bg-gray-100"
              />
            ))}
          </div>
        </div>

        {/* Product Name */}
        <div className="space-y-3">
          <div className="h-5 w-36 rounded bg-gray-300" />
          <div className="h-12 rounded-xl bg-gray-200" />
        </div>

        {/* Description */}
        <div className="space-y-3">
          <div className="h-5 w-32 rounded bg-gray-300" />
          <div className="h-36 rounded-xl bg-gray-200" />
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <div className="h-5 w-24 rounded bg-gray-300" />
              <div className="h-12 rounded-xl bg-gray-200" />
            </div>
          ))}
        </div>

        {/* Sizes */}
        <div className="space-y-3">
          <div className="h-5 w-20 rounded bg-gray-300" />

          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-10 w-14 rounded-lg bg-gray-200"
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
          <div className="h-12 w-full sm:w-32 rounded-xl bg-gray-200" />
          <div className="h-12 w-full sm:w-44 rounded-xl bg-gray-300" />
        </div>
      </div>
    </div>
  );
}