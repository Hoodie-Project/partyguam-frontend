'use client';
import React, { useEffect } from 'react';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import { Txt } from '@/components/_atoms';
import { palette } from '@/styles';

type Props = {
  visible: boolean;
  onClose: () => void;
  label: string;
  icon: React.ReactNode;
  position: number;
};

function Toast({ visible, onClose, label, icon, position }: Props) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <ToastContainer position={position}>
      <IconContainer>{icon}</IconContainer>
      <Txt fontWeight="bold" fontSize={14} fontColor="white">
        {label}
      </Txt>
    </ToastContainer>
  );
}

export default Toast;

const slideUp = (position: number) => keyframes`
  from {
    bottom: 0px;
    opacity: 0;
  }
  to {
    bottom: ${position}px;
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const ToastContainer = styled.div<{ position: number }>`
  position: absolute;
  left: 50%;
  bottom: ${({ position }) => `${position}px`};
  transform: translateX(-50%);
  ${({ position }) => css`
    animation:
      ${slideUp(position)} 0.3s ease,
      ${fadeOut} 1s 2s ease;
  `}
  background-color: ${palette.grey600};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  width: 20.9375rem;
  height: 2.125rem;
  z-index: 1000;
`;

const IconContainer = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${palette.primaryGreen};
  margin-right: 2px;
`;
