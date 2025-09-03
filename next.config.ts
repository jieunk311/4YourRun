import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@google/generative-ai'],
  },
  
  // Optimize for mobile networks
  compress: true,
  
  // Enable static optimization
  output: 'standalone',
  
  // Optimize images for mobile
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [375, 414, 768, 1024],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  
  // Bundle analyzer for production builds (only when not using Turbopack)
  webpack: (config, { dev, isServer }) => {
    // Skip webpack config when using Turbopack in development
    if (dev && process.env.TURBOPACK) {
      return config;
    }
    
    // Optimize bundle size for mobile
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            maxSize: 244000, // 244KB chunks for mobile
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            maxSize: 244000,
          },
        },
      };
    }
    
    return config;
  },
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
