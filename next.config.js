/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.bsky.social',
        port: '',
        pathname: '/imgproxy/**',
      },
    ],
  },
}

module.exports = nextConfig
