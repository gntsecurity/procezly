import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // required for dynamic routes
  experimental: {
    serverActions: {},
  },
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/icons/{{member}}",
    },
  },
  webpack(config) {
    config.optimization.splitChunks = {
      chunks: "all",
      maxSize: 24000000, // ⚠️ Cloudflare Pages max file size = 25 MiB
    };
    return config;
  },
};

export default nextConfig;
