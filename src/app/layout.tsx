'use client';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@/styles/global.css';
import { Modal } from '@/components/_molecules';
import FormContextProvider from '@/contexts/FormContext/FormProvider';
import ModalContextProvider from '@/contexts/ModalContext/ModalProvider';

import Footer from './Footer';
import Header from './Header';

// export const metadata: Metadata = {
//   title: 'PartyGuam',
//   description: '파티 구해? partyguam!',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <html lang="kr">
      <body suppressHydrationWarning={true}>
        <QueryClientProvider client={queryClient}>
          <ModalContextProvider>
            <FormContextProvider>
              <Header />
              <Modal />
              <main>{children}</main>
              <Footer />
            </FormContextProvider>
          </ModalContextProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
