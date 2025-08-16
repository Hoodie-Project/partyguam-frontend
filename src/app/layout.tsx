import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React from 'react';
import type { Metadata } from 'next';

import '@/styles/global.css';

import BaseLayout from './BaseLayout';

export const metadata: Metadata = {
  metadataBase: new URL('https://partyguham.com'),
  title: '파티구함 | PartyGuham',
  description: '신규 파티를 빠르게 찾고, 함께할 사람을 모집하세요. 파티 구해? 파티구함!',
  openGraph: {
    title: '파티구함 | PartyGuham',
    description: '신규 파티를 빠르게 찾고, 함께할 사람을 모집하세요.',
    url: 'https://partyguham.com/',
    siteName: '파티구함',
    images: [{ url: '/images/og.png', width: 1200, height: 630 }],
    locale: 'ko_KR',
    type: 'website',
  },
  icons: { icon: '/images/favicon.png' },
  alternates: {
    canonical: 'https://partyguham.com/',
    languages: {
      ko: 'https://partyguham.com/',
    },
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
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
