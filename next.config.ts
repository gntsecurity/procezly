/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // ✅ Enables static export for Cloudflare Pages
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
};

export default nextConfig;
