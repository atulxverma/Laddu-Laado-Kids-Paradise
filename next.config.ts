/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Build ke waqt ESLint ignore karo
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Build ke waqt Type errors ignore karo
    ignoreBuildErrors: true,
  },
};

export default nextConfig;