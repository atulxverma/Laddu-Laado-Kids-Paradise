"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h2>Something went wrong.</h2>

      <button
        onClick={reset}
        className="mt-5 bg-black text-white px-5 py-2 rounded"
      >
        Try Again
      </button>
    </div>
  );
}