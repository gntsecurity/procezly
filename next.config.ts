// next.config.ts
import withPWA from 'next-pwa'
import path from 'path'

const baseConfig = {
  output: 'export',
  experimental: {
    serverActions: {}, // already correct
  },
}

const nextConfig = withPWA({
  ...baseConfig,
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    swSrc: path.join(__dirname, 'public', 'service-worker.js'),
  },
})

export default nextConfig
