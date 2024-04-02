'use client';

import React from 'react';
import styled from '@emotion/styled';

import Portal from '@/components/atoms/portal';
import { zIndex } from '@/styles';

type Props = {
  onClick?: () => void;
};

export default function Dimmer({ onClick }: Props) {
  return (
    <Portal>
      <DimmerContainer onClick={onClick} />
    </Portal>
  );
}

const DimmerContainer = styled.div<{ onClick?: () => void }>`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: ${zIndex.dimmerIndex};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
`;
