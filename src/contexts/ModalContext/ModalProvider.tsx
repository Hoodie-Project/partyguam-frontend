'use client';

import { type ReactNode, useState } from 'react';

import type { ModalData } from './ModalContext';
import { ModalContext } from './ModalContext';

export default function ModalContextProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalData>({});

  const openModal = ({ children, onCancel, onSubmit }: ModalData) => {
    setIsOpen(true);
    setModalData({
      children,
      onCancel,
      onSubmit,
    });
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalData({});
  };

  return <ModalContext.Provider value={{ isOpen, openModal, closeModal, modalData }}>{children}</ModalContext.Provider>;
}
