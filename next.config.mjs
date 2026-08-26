/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "**.clerk.com",
      },
      {
        protocol: "https",
        hostname: "**.clerk.accounts.dev",
      },
    ],
  },
  turbopack: {
    root: process.cwd(),
  },
  // Fix for 404 errors on Vercel
  trailingSlash: false,
  // Disable ESLint during builds for now
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checks during builds for now
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
