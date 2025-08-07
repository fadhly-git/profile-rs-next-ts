// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pastikan static file serving berjalan normal
  async rewrites() {
    return [];
  },
  // Optimize image handling
  images: {
    loader: 'cloudinary',
    domains: ['localhost'],
    path: '/uploads/',
  },

  // Ensure static files are served properly
  trailingSlash: false,
};

export default nextConfig;