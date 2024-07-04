/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { 
    serverComponentsExternalPackages: ['grammy'], 
  }, 
  distDir: 'build',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'dawid-food-ordering.s3.amazonaws.com',
      },
    ]
  }
}

module.exports = nextConfig
