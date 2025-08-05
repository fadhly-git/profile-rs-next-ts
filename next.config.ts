import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Optimize untuk memory
  experimental: {
    cpus: 1,
  },
  // TypeScript config
  typescript: {
    // Ignore build errors jika ada
    ignoreBuildErrors: false,
  },
}

export default nextConfig