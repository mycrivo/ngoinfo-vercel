import type { NextConfig } from "next";
import path from "path";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // unsafe-eval for Next.js dev, unsafe-inline for Next.js runtime
      "style-src 'self' 'unsafe-inline'", // unsafe-inline required for Next.js
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join("; ")
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload"
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "X-Frame-Options",
    value: "DENY"
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin"
  },
  {
    key: "Permissions-Policy",
    value: "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()"
  }
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  headers: async () => [
    {
      source: "/:path*",
      headers: securityHeaders
    }
  ],
  experimental: { typedRoutes: true },
  webpack: (config) => {
    // Ensure webpack resolves the path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "."),
      "@features": path.resolve(__dirname, "features"),
      "@ui": path.resolve(__dirname, "ui"),
      "@lib": path.resolve(__dirname, "lib"),
      "@services": path.resolve(__dirname, "services"),
      "@types": path.resolve(__dirname, "types"),
    };
    return config;
  },
};

export default nextConfig;


