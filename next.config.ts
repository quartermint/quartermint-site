import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/*': ['./content/**/*'],
  },
};

export default nextConfig;
