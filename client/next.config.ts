import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
        pathname: "/**",
      },
    ],
  },
  // Skip prerendering for pages with dynamic behavior
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
