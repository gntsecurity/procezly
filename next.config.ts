import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // ✅ required for dynamic routes & APIs
  experimental: {
    serverActions: {}, // ✅ you're good here
  },
  modularizeImports: {
    // ✅ optional optimization: reduces Lucide bundle size
    "lucide-react": {
      transform: "lucide-react/icons/{{member}}",
    },
  },
  webpack(config) {
    config.optimization.splitChunks = {
      chunks: "all",
      maxSize: 24000000, // ✅ stay under Cloudflare's 25 MiB limit
    };
    return config;
  },
};

export default nextConfig;
