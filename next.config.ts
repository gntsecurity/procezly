// next.config.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  experimental: {
    serverActions: {},
  },
  images: {
    unoptimized: true, // Required for static exports if using next/image
  },
  reactStrictMode: true,
};

export default nextConfig;
