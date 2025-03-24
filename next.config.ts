/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // ✅ Enables static export for Cloudflare Pages
  reactStrictMode: true,
};

export default nextConfig;
