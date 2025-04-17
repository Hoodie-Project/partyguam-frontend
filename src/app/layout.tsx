import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React from 'react';
import type { Metadata } from 'next';

import '@/styles/global.css';

import BaseLayout from './BaseLayout';

export const metadata: Metadata = {
  title: 'PartyGuam',
  description: '파티 구해? partyguam!',
  icons: {
    icon: '/images/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <head>
        <meta name="google-adsense-account" content="ca-pub-8724037414945960" />
      </head>
      <body suppressHydrationWarning={true}>
        <BaseLayout>
          <main>{children}</main>
        </BaseLayout>
      </body>
    </html>
  );
}
