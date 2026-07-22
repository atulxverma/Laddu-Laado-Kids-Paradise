import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="group animate-pulse">
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Image */}
        <div className="aspect-[3/4] w-full bg-gray-200" />

        {/* Content */}
        <div className="space-y-3 p-4">
          {/* Category */}
          <div className="h-3 w-20 rounded-full bg-gray-200" />

          {/* Product Name */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-3/4 rounded bg-gray-200" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="h-3 w-16 rounded bg-gray-200" />
            <div className="h-3 w-8 rounded bg-gray-200" />
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <div className="h-5 w-20 rounded bg-gray-300" />
            <div className="h-4 w-14 rounded bg-gray-200" />
          </div>

          {/* Button */}
          <div className="pt-2">
            <div className="h-11 w-full rounded-xl bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}