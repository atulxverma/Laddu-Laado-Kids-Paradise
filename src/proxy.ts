import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/product/:path*",
  "/shop",
  "/shop/:path*",
  "/about",
  "/faqs",
  "/legal/:slug*",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (req?.nextUrl && !isPublicRoute(req)) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);

    await auth.protect({
      unauthenticatedUrl: signInUrl.toString(),
    });
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};