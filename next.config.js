/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    config.cache = false;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      kerberos: false,
      snappy: false,
      aws4: false,
      'mongodb-client-encryption': false,
      '@aws-sdk/credential-providers': false,
      '@mongodb-js/zstd': false,
    };
    return config;
  },
};

module.exports = nextConfig;