import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

export type ModalData = {
  children?: ReactNode;
  onCancel?: () => unknown;
  onSubmit?: () => unknown;
};

export interface ModalContext {
  openModal: (modalData: ModalData) => unknown;
  closeModal: () => unknown;
  isOpen: boolean;
  modalData: ModalData;
}

const ModalContext = createContext<ModalContext | null>(null);

function useModalContext() {
  const context = useContext(ModalContext);
  if (context == null) {
    throw new Error('Cannot find <ModalContext>');
  }

  return context;
}

export { ModalContext, useModalContext };
