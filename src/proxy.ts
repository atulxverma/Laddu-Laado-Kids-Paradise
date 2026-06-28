import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Strict path matching syntax for Clerk
const isPublicRoute = createRouteMatcher([
  "/",
  "/product/:id*", // Better safe pattern matching
  "/shop",
  "/shop/:path*",  // Explicitly matches /shop and any sub-routes safely
  "/about",
  "/faqs",
  "/sign-in(.*)",
  "/sign-up(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  // Safe runtime check guard
  if (req?.nextUrl && !isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Next.js recommended standard Clerk matching pattern regex
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
}