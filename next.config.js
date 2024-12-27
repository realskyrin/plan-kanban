const withPWA = require('next-pwa')({
  dest: 'public', // 指定 PWA 的输出目录
  register: true, // 是否注册 PWA
  skipWaiting: true, // 是否跳过等待
  disable: process.env.NODE_ENV === 'development' // 是否禁用 PWA
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = withPWA(nextConfig)