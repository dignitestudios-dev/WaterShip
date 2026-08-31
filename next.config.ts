import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["s3bucketwatership.s3.us-east-2.amazonaws.com"],
  },
  reactCompiler: true,
};

export default nextConfig;
