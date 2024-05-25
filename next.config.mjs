/** @type {import('next').NextConfig} */
import TerserPlugin from 'terser-webpack-plugin';

const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';
const nextConfig = {
  reactStrictMode: false,
  webpack: config => {
    config.optimization = {
      ...config.optimization,
      minimize: isProduction,
      minimizer: isProduction
        ? [
            new TerserPlugin({
              parallel: true,
              terserOptions: {
                format: {
                  comments: false,
                },
                compress: {
                  drop_console: true,
                },
              },
              extractComments: false,
            }),
          ]
        : [],
    };

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: `https://partyguam.net/dev/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
