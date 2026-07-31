import ProductGridSkeleton from "@/components/skeleton/ProductGridSkeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-white pb-20 pt-8 md:pt-10">
      <div className="max-w-7xl mx-auto px-4">


        <div className="space-y-3 mb-8">
          <div className="h-3 w-36 rounded bg-neutral-200 animate-pulse" />
          <div className="h-10 w-72 rounded bg-neutral-200 animate-pulse" />
          <div className="h-4 w-80 rounded bg-neutral-200 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-8">

          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-neutral-100 animate-pulse"
            />
          ))}

        </div>

        <ProductGridSkeleton count={10} />
      </div>
    </main>
  );
}