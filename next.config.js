/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development'
          ? 'http://localhost:3001/:path*'
          : `${process.env.NEXT_PUBLIC_PROD_API_BASE_URL}/:path*` // 使用环境变量来配置生产环境 API 地址
      }
    ]
  }
}

module.exports = withPWA(nextConfig) 