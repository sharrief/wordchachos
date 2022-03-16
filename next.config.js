/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/wordle',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
