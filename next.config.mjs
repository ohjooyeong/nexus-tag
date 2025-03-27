/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nexus-tag-storage.s3.amazonaws.com',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname: 'nexus-tag.vercel.app',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.nexus-tag.shop',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'nexus-tag.shop',
        pathname: '/**', // 모든 경로 허용
      },
    ],
  },
};

export default nextConfig;
