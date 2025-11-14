/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static optimization for pages that use client-side features
  output: 'standalone',
};

export default nextConfig;
