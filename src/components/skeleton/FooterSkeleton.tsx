export default function FooterSkeleton() {
  return (
    <footer className="border-t border-gray-200 bg-white animate-pulse">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Desktop */}
        <div className="hidden md:grid grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-5">
            <div className="h-8 w-40 rounded-lg bg-gray-200" />

            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-gray-200" />
              <div className="h-3 w-5/6 rounded bg-gray-200" />
              <div className="h-3 w-2/3 rounded bg-gray-200" />
            </div>

            <div className="flex gap-3 pt-2">
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div className="h-10 w-10 rounded-full bg-gray-200" />
              <div className="h-10 w-10 rounded-full bg-gray-200" />
            </div>
          </div>

          {/* Column 1 */}
          <div className="space-y-4">
            <div className="h-5 w-28 rounded bg-gray-200" />

            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-3 w-24 rounded bg-gray-200"
              />
            ))}
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div className="h-5 w-32 rounded bg-gray-200" />

            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-3 w-28 rounded bg-gray-200"
              />
            ))}
          </div>

          {/* Newsletter */}
          <div className="space-y-5">
            <div className="h-5 w-36 rounded bg-gray-200" />

            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-gray-200" />
              <div className="h-3 w-4/5 rounded bg-gray-200" />
            </div>

            <div className="h-12 w-full rounded-xl bg-gray-200" />

            <div className="h-12 w-36 rounded-xl bg-gray-300" />
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden space-y-8">
          <div className="space-y-4">
            <div className="h-8 w-36 rounded-lg bg-gray-200" />

            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-gray-200" />
              <div className="h-3 w-5/6 rounded bg-gray-200" />
            </div>
          </div>

          {[1, 2, 3].map((section) => (
            <div key={section} className="space-y-3">
              <div className="h-5 w-24 rounded bg-gray-200" />

              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-3 w-28 rounded bg-gray-200"
                />
              ))}
            </div>
          ))}

          <div className="space-y-4">
            <div className="h-12 w-full rounded-xl bg-gray-200" />
            <div className="h-12 w-full rounded-xl bg-gray-300" />
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="h-10 w-10 rounded-full bg-gray-200" />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="h-3 w-52 rounded bg-gray-200" />

          <div className="flex gap-3">
            <div className="h-8 w-12 rounded bg-gray-200" />
            <div className="h-8 w-12 rounded bg-gray-200" />
            <div className="h-8 w-12 rounded bg-gray-200" />
            <div className="h-8 w-12 rounded bg-gray-200" />
          </div>
        </div>
      </div>
    </footer>
  );
}