import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // three / r3f ship ESM that occasionally needs transpiling in older toolchains
  transpilePackages: ["three"],
};

export default nextConfig;
