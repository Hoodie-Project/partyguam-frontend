'use client';

import { Modal } from '@/components/molecules';
import { Header } from '@/components/organisms';
import ModalContextProvider from '@/contexts/ModalContext/ModalProvider';

export default function Main() {
  return (
    <ModalContextProvider>
      <Header />
      <Modal />
    </ModalContextProvider>
  );
}
