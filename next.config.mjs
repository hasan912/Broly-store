/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable image optimization
    unoptimized: false,
    // Optimize image formats
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Enable SWR caching for faster subsequent loads
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
  // Compression
  compress: true,
  // Production source maps (disabled for smaller bundle)
  productionBrowserSourceMaps: false,
  // Optimized exports
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
