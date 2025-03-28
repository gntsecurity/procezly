// next.config.ts
const nextConfig = {
  output: "export",
  experimental: {
    serverActions: {}, // Fix: Should be an object, not a boolean
  },
};

export default nextConfig;
