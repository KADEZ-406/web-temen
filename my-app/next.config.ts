import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  productionBrowserSourceMaps: false,
  // Turbopack is enabled by default in Next.js 16
  // Empty config to silence the warning
  turbopack: {},
};

export default nextConfig;
