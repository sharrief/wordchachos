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
      {
        source: '/privacy',
        destination: '/privacy.html',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
