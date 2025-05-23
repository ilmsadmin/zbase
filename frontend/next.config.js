/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'localhost',
      // Add other domains as needed
    ],
  },
  // Remove any incorrect file references
}

module.exports = nextConfig
