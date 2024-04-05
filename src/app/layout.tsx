import React from 'react';
import type { Metadata } from 'next';

import '@/styles/global.css';
import { Modal } from '@/components/molecules';
import ModalContextProvider from '@/contexts/ModalContext/ModalProvider';

import Header from './Header';

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
      <body>
        <ModalContextProvider>
          <Header />
          <Modal />
          {children}
        </ModalContextProvider>
      </body>
    </html>
  );
}
