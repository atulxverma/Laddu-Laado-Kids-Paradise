import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Build ke waqt Type errors ignore karo
    ignoreBuildErrors: true,
  },
  images: {
    // Cloudinary aur external images ke liye
    unoptimized: true,
  },
  // Experimental features agar use kar rahe ho toh (optional)
  experimental: {
    // serverActions: true, // Next 15 mein ye by default true hota hai
  }
};

export default nextConfig;