import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

// Import env files to validate at build time. Use jiti so we can load .ts files in here.
await createJiti(fileURLToPath(import.meta.url)).import("./lib/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
