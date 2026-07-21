/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    webpackBuildWorker: false,
    workerThreads: false,
    cpus: 1,
    serverComponentsExternalPackages: ["pdf-parse"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Security headers
  async headers() {
    // Content-Security-Policy — only allow trusted origins for each resource type
    const csp = [
      "default-src 'self'",
      // Scripts: self + Google Analytics + Vercel Analytics + inline (for JSON-LD & gtag)
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com",
      // Styles: self + Google Fonts
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts: self + Google Fonts CDN
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + data URIs + Google Analytics + Unsplash (portfolio images)
      "img-src 'self' data: blob: https://www.google-analytics.com https://images.unsplash.com https://res.cloudinary.com",
      // Connections: self + analytics endpoints + Persona KYC
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://vitals.vercel-insights.com https://generativelanguage.googleapis.com https://*.withpersona.com https://withpersona.com",
      // Frames: allow Persona KYC iframe
      "frame-src 'self' https://withpersona.com https://*.withpersona.com",
      "frame-ancestors 'self'",
      // Objects / base
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          // Existing headers (kept)
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "X-Frame-Options",           value: "SAMEORIGIN" },
          { key: "X-XSS-Protection",          value: "1; mode=block" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",        value: "camera=(self \"https://withpersona.com\"), microphone=(self \"https://withpersona.com\"), geolocation=()" },
          // New: HSTS — force HTTPS for 1 year (only set on production via Vercel)
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // New: Content Security Policy
          { key: "Content-Security-Policy",   value: csp },
          // New: Cross-origin isolation
          { key: "Cross-Origin-Opener-Policy",   value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "X-DNS-Prefetch-Control",       value: "on" },
        ],
      },
      // Cache static images aggressively
      {
        source: "/images/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    if (config.cache && !dev) {
      config.cache = false;
    }
    // pdf-parse uses canvas which is a native module — mark as external
    if (isServer) {
      config.externals = [...(config.externals || []), { canvas: "canvas" }];
    }
    return config;
  },
};

export default nextConfig;
