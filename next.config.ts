// next.config.js
import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/0199c4ae-4839-f4b6-4414-06632fe4312a',
        permanent: false,
      },
    ]
  },
}
 
export default nextConfig