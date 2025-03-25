import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {}, // this is still good
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
