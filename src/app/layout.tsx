import type { Metadata } from 'next';
import '@/styles/index.css';
import React from 'react';

export const metadata: Metadata = {
  title: 'PartyGuam',
  description: '파티 구해? partyguam!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="kr">
      <body>{children}</body>
    </html>
  );
}
