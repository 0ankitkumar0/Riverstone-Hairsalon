import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN mobile devices to connect to Next.js dev server & HMR
  allowedDevOrigins: [
    "10.246.181.106",
    "10.246.181.106:3000",
    "localhost",
    "localhost:3000",
  ],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
