import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React from 'react';
import type { Metadata } from 'next';

import '@/styles/global.css';
import BaseLayout from './BaseLayout';

export const metadata: Metadata = {
  metadataBase: new URL('https://partyguham.com'),
  title: '파티구함(PartyGuham) | 함께할 파티 찾기',
  description: '신규 파티를 빠르게 찾고, 함께할 사람을 모집하세요. 파티 구해? 파티구함!',

  openGraph: {
    title: '파티구함(PartyGuham) | 함께할 파티 찾기',
    description: '신규 파티를 빠르게 찾고, 함께할 사람을 모집하세요.',
    url: 'https://partyguham.com/',
    siteName: '파티구함 | PartyGuham',
    images: [
      {
        url: '/images/og.png',
        width: 1200,
        height: 630,
        alt: '파티구함(PartyGuham) 미리보기',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },

  // Twitter 카드(공유 일관성)
  twitter: {
    card: 'summary_large_image',
    title: '파티구함(PartyGuham) | 함께할 파티 찾기',
    description: '신규 파티를 빠르게 찾고, 함께할 사람을 모집하세요.',
    images: ['/images/og.png'],
  },

  icons: { icon: '/images/favicon.png' },

  // URL 신호 보강
  alternates: {
    canonical: 'https://partyguham.com/',
    languages: {
      ko: 'https://partyguham.com/',
      // en: 'https://partyguham.com/en', // 다국어 도입 시 해제
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <meta name="google-adsense-account" content="ca-pub-8724037414945960" />
      </head>
      <body suppressHydrationWarning>
        <BaseLayout>
          <main>{children}</main>
        </BaseLayout>
      </body>
    </html>
  );
}