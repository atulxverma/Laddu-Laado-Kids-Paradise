export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-10 w-64 rounded bg-gray-200" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-xl bg-gray-200"
            />
          ))}
        </div>
      </div>
    </div>
  );
}