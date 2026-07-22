import ProductGridSkeleton from "./ProductGridSkeleton";

export default function WishlistSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 animate-pulse">
      {/* Heading */}
      <div className="flex items-end justify-between mb-8">
        <div className="space-y-3">
          <div className="h-9 w-52 rounded bg-gray-300" />
          <div className="h-4 w-44 rounded bg-gray-200" />
        </div>

        <div className="hidden md:block h-10 w-36 rounded-xl bg-gray-200" />
      </div>

      {/* Products */}
      <ProductGridSkeleton count={8} />

      {/* Bottom Button */}
      <div className="flex justify-center mt-10">
        <div className="h-12 w-56 rounded-xl bg-gray-300" />
      </div>
    </div>
  );
}