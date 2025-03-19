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
    domains: ['localhost', 'www.nexus-tag.shop', 'nexus-tag.shop'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
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
    ],
  },
};

export default nextConfig;
