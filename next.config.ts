import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Ensures Next.js exports static files
  distDir: '.next', // Default Next.js build directory
  trailingSlash: true, // Ensures all routes work properly
  reactStrictMode: true, // Recommended for better debugging
};

export default nextConfig;
