
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Gzip / Brotli compression for responses
  compress: true,

  allowedDevOrigins: ['*.cloudworkstations.dev'],

  images: {
    // Modern image formats — browser picks the best one automatically
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Aggressive cache headers for static assets (_next/static/*)
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache public images, fonts and other static files for 7 days
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
