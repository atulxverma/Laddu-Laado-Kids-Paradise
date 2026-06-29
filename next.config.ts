import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Yeh sahi tarika hai external packages declare karne ka
  serverExternalPackages: ["@prisma/client"],
  
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
};

export default nextConfig;