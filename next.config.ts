import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    serverActions: {}, // Fix: Should be an object, not a boolean
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /functions\/.*\.ts$/,
      use: "null-loader",
    });
    return config;
  },
};

export default nextConfig;
