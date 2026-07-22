export default function HeroSkeleton() {
  return (
    <section className="w-full animate-pulse">
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          bg-gray-200
          h-[220px]
          sm:h-[300px]
          md:h-[420px]
          lg:h-[560px]
        "
      >
        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-xl space-y-5">
              {/* Tag */}
              <div className="h-4 w-28 rounded-full bg-gray-300" />

              {/* Heading */}
              <div className="space-y-3">
                <div className="h-10 w-full rounded-lg bg-gray-300 md:h-14" />
                <div className="h-10 w-4/5 rounded-lg bg-gray-300 md:h-14" />
              </div>

              {/* Description */}
              <div className="space-y-2 pt-2">
                <div className="h-4 w-full rounded bg-gray-300" />
                <div className="h-4 w-5/6 rounded bg-gray-300" />
                <div className="h-4 w-2/3 rounded bg-gray-300" />
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <div className="h-12 w-36 rounded-xl bg-gray-300" />
                <div className="h-12 w-28 rounded-xl bg-gray-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-3 w-3 rounded-full bg-gray-300"
            />
          ))}
        </div>

        {/* Arrows - Desktop */}
        <div className="hidden md:flex">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-gray-300" />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-gray-300" />
        </div>
      </div>
    </section>
  );
}