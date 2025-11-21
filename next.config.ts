// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pastikan static file serving berjalan normal
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*'
      }
    ];
  },
  output: 'standalone',
};

export default nextConfig;