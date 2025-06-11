/** @type {import('next').NextConfig} */
import TerserPlugin from 'terser-webpack-plugin';

const isProduction = process.env.NEXT_PUBLIC_ENV === 'production';
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'partyguham.com',
      'lh3.googleusercontent.com',
      'partyguham-test.s3.ap-northeast-2.amazonaws.com',
      'partyguham.s3.ap-northeast-2.amazonaws.com',
    ],
    unoptimized: true,
  },
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
        source: '/api/:path*', // '/api/'로 시작하는 경로만 리다이렉트
        destination: 'https://partyguham.com/dev/api/:path*',
      },
    ];
  },
};

export default nextConfig;
