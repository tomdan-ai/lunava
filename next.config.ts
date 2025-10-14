// next.config.js
import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  // Remove the redirects - we'll use the static file instead
  async headers() {
    return [
      {
        source: '/.well-known/(.*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600',
          },
        ],
      },
    ]
  },
}
 
export default nextConfig