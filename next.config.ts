import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: [
    'preview-chat-fc6bb029-0f49-49ef-8cae-182e9d272afa.space-z.ai',
    '.space-z.ai',
  ],
}

export default nextConfig
