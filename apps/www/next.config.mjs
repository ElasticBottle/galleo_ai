import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
await createJiti(fileURLToPath(import.meta.url)).import("./lib/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // For posthog
  rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_BACKEND_URL,
      },
    ];
  },
  // For posthog: This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      { hostname: "localhost" },
      { hostname: "randomuser.me" },
      // For brand image
      { hostname: "upload.wikimedia.org" },
      { hostname: "i0.wp.com" },
      { hostname: "encrypted-tbn0.gstatic.com" },
      { hostname: "media.licdn.com" },
    ],
  },
};

export default nextConfig;
