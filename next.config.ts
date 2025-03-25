import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // Allows dynamic routes + API functions
  experimental: {
    serverActions: {}, // You already noted this is good
  },
  modularizeImports: {
    // Tree-shake Lucide icons
    "lucide-react": {
      transform: "lucide-react/icons/{{member}}",
    },
  },
  webpack(config) {
    config.optimization.splitChunks = {
      chunks: "all",
      maxSize: 24000000, // Stay under Cloudflare 25 MiB file limit
    };
    return config;
  },
};

export default nextConfig;
