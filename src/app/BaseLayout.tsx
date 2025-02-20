import type { PropsWithChildren } from 'react';
import React from 'react';

import Modal from '@/components/_molecules/modal';

import Footer from './Footer';
import Header from './Header';
import Providers from './Providers';

export default function BaseLayout({ children }: PropsWithChildren) {
  return (
    <Providers>
      <Header />
      <Modal />
      <main>{children}</main>
      <Footer />
    </Providers>
  );
}
