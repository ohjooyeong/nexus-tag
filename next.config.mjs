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
  },
};

export default nextConfig;
