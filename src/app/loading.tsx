

function ProductCardSkeleton() {

  return (
    <div className="group overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
      {/* Image */}
      <div className="aspect-square overflow-hidden rounded-t-[24px]">
        <div className="h-full w-full shimmer" />
      </div>

      <div className="space-y-3 p-4">

        <div className="h-3 w-20 rounded-full shimmer" />

        <div className="space-y-2">

          <div className="h-4 w-full rounded shimmer" />

          <div className="h-4 w-3/4 rounded shimmer" />

        </div>

        <div className="flex items-center gap-2">

          <div className="h-5 w-20 rounded shimmer" />

          <div className="h-4 w-12 rounded shimmer" />

        </div>

        <div className="flex gap-1">

          {Array.from({ length: 5 }).map((_, i) => (

            <div key={i} className="h-3 w-3 rounded-full shimmer" />

          ))}

        </div>

        <div className="mt-2 h-10 rounded-full shimmer" />

      </div>
      <div className="h-3 w-20 rounded-full shimmer" />

      <div className="space-y-2">
        <div className="h-4 w-full rounded shimmer" />
        <div className="h-4 w-3/4 rounded shimmer" />
      </div>

      <div className="flex items-center gap-2">
        <div className="h-5 w-20 rounded shimmer" />
        <div className="h-4 w-12 rounded shimmer" />
      </div>

      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-3 w-3 rounded-full shimmer"
          />
        ))}
      </div>

      <div className="mt-2 h-10 rounded-full shimmer" />
    </div>
  );
}

function SectionSkeleton() {
  return (
    <section className="mt-14">

      <div className="mb-7 flex items-center justify-between">

        <div className="space-y-3">
          <div className="h-3 w-24 rounded-full shimmer" />
          <div className="h-8 w-48 rounded shimmer" />
        </div>

        <div className="hidden h-10 w-24 rounded-full shimmer md:block" />

      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">

        {Array.from({ length: 4 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}

      </div>

    </section>
  );
}

export default function Loading() {
  return (
    <main className="min-h-screen bg-white">

      {/* HERO */}


      <section className="mx-auto max-w-7xl px-4 pt-3">

        <div className="relative overflow-hidden rounded-[42px]">

          <div className="aspect-[16/7] w-full shimmer" />

          <div className="absolute inset-0 flex items-end">

            <div className="p-8 md:p-14">

              <div className="mb-6 h-8 w-40 rounded-full shimmer" />

              <div className="space-y-4">

                <div className="h-14 w-[700px] max-w-full rounded shimmer" />

                <div className="h-14 w-[520px] max-w-full rounded shimmer" />

              </div>

              <div className="mt-8 space-y-3">

                <div className="h-5 w-96 max-w-full rounded shimmer" />

                <div className="h-5 w-60 rounded shimmer" />

              </div>

              <div className="mt-10 h-14 w-72 rounded-full shimmer" />

            </div>

          </div>

        </div>

      </section>

      {/* CATEGORY */}

      <section className="mx-auto mt-16 max-w-7xl px-4">

        <div className="mb-8">

          <div className="mb-3 h-3 w-24 rounded-full shimmer" />

          <div className="h-10 w-56 rounded shimmer" />

        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">

          {Array.from({ length: 4 }).map((_, i) => (

            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
            >

              <div className="mx-auto h-24 w-24 rounded-full shimmer" />

              <div className="mx-auto mt-5 h-5 w-28 rounded shimmer" />

              <div className="mx-auto mt-3 h-4 w-20 rounded shimmer" />

            </div>

          ))}

        </div>

      </section>

      <div className="mx-auto max-w-7xl px-4">

        <SectionSkeleton />

        <SectionSkeleton />
        <SectionSkeleton />

        <SectionSkeleton />

      </div>

      {/* NEWSLETTER */}

      <section className="mt-20 border-t border-neutral-200 bg-neutral-50">

        <div className="mx-auto max-w-7xl px-4 py-20">

          <div className="mx-auto max-w-3xl text-center">

            <div className="mx-auto h-4 w-28 rounded-full shimmer" />

            <div className="mx-auto mt-6 h-12 w-96 max-w-full rounded shimmer" />

            <div className="mx-auto mt-4 h-4 w-80 max-w-full rounded shimmer" />

            <div className="mx-auto mt-2 h-4 w-64 max-w-full rounded shimmer" />

            <div className="mx-auto mt-10 flex max-w-xl gap-3">

              <div className="h-14 flex-1 rounded-full shimmer" />

              <div className="h-14 w-36 rounded-full shimmer" />

            </div>

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="border-t border-neutral-200 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-16">

          <div className="grid gap-12 md:grid-cols-4">

            <div className="space-y-4">

              <div className="h-8 w-36 rounded shimmer" />

              <div className="space-y-2">

                <div className="h-4 w-full rounded shimmer" />

                <div className="h-4 w-5/6 rounded shimmer" />

                <div className="h-4 w-3/4 rounded shimmer" />

              </div>

            </div>

            {Array.from({ length: 3 }).map((_, i) => (

              <div key={i} className="space-y-4">

                <div className="h-5 w-24 rounded shimmer" />

                {Array.from({ length: 5 }).map((_, j) => (

                  <div
                    key={j}
                    className="h-4 w-32 rounded shimmer"
                  />

                ))}

              </div>

            ))}

          </div>

          <div className="mt-16 border-t border-neutral-200 pt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="h-4 w-56 rounded shimmer" />

            <div className="flex gap-3">

              {Array.from({ length: 5 }).map((_, i) => (

                <div
                  key={i}
                  className="h-10 w-10 rounded-full shimmer"
                />

              ))}

            </div>

          </div>

        </div>

      </footer>

      {/* <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }

          100% {
            background-position: 200% 0;
          }
        }
      `}</style> */}

    </main>
  );
}