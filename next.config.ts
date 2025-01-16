import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['raw.githubusercontent.com'], // Add the hostname here
  },
};

module.exports = nextConfig;
