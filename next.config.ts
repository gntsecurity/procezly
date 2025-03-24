/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = withPWA({
  reactStrictMode: true,
  output: "export", // ✅ Ensures static export for Cloudflare Pages
  trailingSlash: true, // ✅ Helps Cloudflare recognize routes correctly
});

module.exports = nextConfig;
