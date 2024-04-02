'use client';

import React from 'react';
import styled from '@emotion/styled';

import { Dimmer, Portal } from '@/components/atoms';
import { useModalContext } from '@/contexts/ModalContext';
import { zIndex } from '@/styles';

export type Props = React.DOMAttributes<HTMLDivElement>;

export default function Modal({ ...divAttributes }: Props) {
  const { isOpen, modalData, closeModal } = useModalContext();
  const { children, onCancel } = modalData;

  if (!isOpen) {
    return <></>;
  }

  const onCancelInternal = () => {
    onCancel?.();
    closeModal();
  };

  return (
    <>
      <Dimmer onClick={onCancelInternal} />
      <Portal>
        <ModalContainer {...divAttributes}>{children}</ModalContainer>
      </Portal>
    </>
  );
}

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);
  width: auto;
  height: auto;
  z-index: ${zIndex.drawerIndex};
`;
