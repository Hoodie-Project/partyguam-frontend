'use client';

import type { ReactNode } from 'react';
import React from 'react';
import styled from '@emotion/styled';

import { Dimmer, Portal } from '@/components/atoms';
import { zIndex } from '@/styles';

type Position = {
  top: string;
  left: string;
  right: string;
  bottom: string;
};

type OwnProps = {
  children: ReactNode;
  isOpen: boolean;
  position?: Partial<Position>;
};

export type Props = Partial<OwnProps> & React.DOMAttributes<HTMLDivElement>;

export default function Modal({ children, isOpen, position }: Props) {
  return (
    <>
      {isOpen && (
        <>
          <Dimmer />
          <Portal>
            <ModalContainer position={position}>{children}</ModalContainer>
          </Portal>
        </>
      )}
    </>
  );
}

const ModalContainer = styled.div<{ position?: Partial<Position> }>`
  position: fixed;
  top: ${({ position }) => position?.top};
  left: ${({ position }) => position?.left};
  right: ${({ position }) => position?.right};
  bottom: ${({ position }) => position?.bottom};

  width: auto;
  height: auto;
  z-index: ${zIndex.drawerIndex};
`;
