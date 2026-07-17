import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-7xl font-black">404</h1>
      <p className="mt-3 text-gray-500">
        Page not found
      </p>

      <Link
        href="/"
        className="mt-6 rounded-full bg-black px-6 py-3 text-white"
      >
        Back Home
      </Link>
    </div>
  );
}