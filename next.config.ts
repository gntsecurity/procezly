/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = withPWA({
  reactStrictMode: true,
  output: "export", // ✅ Forces static export for Cloudflare Pages
  trailingSlash: true, // ✅ Helps Cloudflare recognize routes
  experimental: {
    appDir: true, // ✅ Required for Next.js App Router
  },
});

module.exports = nextConfig;
