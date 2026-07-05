import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["10.52.128.167"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "brfwzlhjryvyifpgyryp.supabase.co",
      },
    ],
  },
};

export default nextConfig;
