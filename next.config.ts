import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Allow local images from /public
    unoptimized: false,
  },
}

export default nextConfig
