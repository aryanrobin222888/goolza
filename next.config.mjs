/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Compression ──────────────────────────────────────────────────────────────
  compress: true,

  // ── Remove X-Powered-By header (minor security + perf) ───────────────────────
  poweredByHeader: false,

  // ── Production console removal (reduces JS bundle noise) ─────────────────────
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  // ── Tree-shake large icon/animation libraries ─────────────────────────────────
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // ── Image Optimization ────────────────────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // 24h
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;

