// Next.js configuration with optional bundle analyzer
// Clean Code: clear naming, single responsibility (config + enhancement wrapper)
// OCP: analyzer enabled via env var without changing core config
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
}

// Wrap with analyzer only when requested to avoid overhead
const withAnalyzer = () => {
  try {
    // Lazy require so dev envs without analyzer don't fail
    // DIP: depend on abstraction (env flag) instead of hard coupling always-on analyzer
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const bundleAnalyzer = require('@next/bundle-analyzer')({
      enabled: process.env.ANALYZE === '1',
      openAnalyzer: false,
    })
    return bundleAnalyzer(nextConfig)
  } catch (e) {
    // Analyzer not installed yet (e.g., initial install) — fall back gracefully
    return nextConfig
  }
}

module.exports = withAnalyzer()
