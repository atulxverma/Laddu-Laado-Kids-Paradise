export default function AdminDashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Heading */}
      <div className="space-y-3">
        <div className="h-9 w-60 rounded bg-gray-300" />
        <div className="h-4 w-72 rounded bg-gray-200" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-gray-100 bg-white p-6"
          >
            <div className="h-5 w-24 rounded bg-gray-200 mb-5" />

            <div className="h-10 w-20 rounded bg-gray-300 mb-4" />

            <div className="h-3 w-28 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="h-6 w-44 rounded bg-gray-300 mb-6" />

          <div className="h-80 rounded-xl bg-gray-200" />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="h-6 w-36 rounded bg-gray-300 mb-6" />

          <div className="h-80 rounded-xl bg-gray-200" />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="h-6 w-44 rounded bg-gray-300 mb-6" />

        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200" />

                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-gray-300" />
                  <div className="h-3 w-28 rounded bg-gray-200" />
                </div>
              </div>

              <div className="h-8 w-24 rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}