import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix the workspace root warning
  outputFileTracingRoot: process.cwd(),
  
  // Ensure proper handling of app directory
  experimental: {
    // App Router is now stable and no longer experimental in Next.js 13.4+
  },
  
  // Optimize for production
  swcMinify: true,
  
  // Handle image optimization
  images: {
    domains: ['localhost', 'vercel.app'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Webpack configuration for edge functions
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
