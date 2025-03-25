/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // automatically create a standalone folder that copies only the necessary files for a production deployment including select files in node_modules.
  reactStrictMode: true,
}

module.exports = nextConfig 