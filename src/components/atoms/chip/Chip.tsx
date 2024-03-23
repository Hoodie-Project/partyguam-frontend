'use client';
import type { ReactNode } from 'react';
import React from 'react';
import styled from '@emotion/styled';

import Txt from '../txt';

type OwnProps = {
  chipType: 'filled' | 'outlined';
  size: 'xsmall' | 'small' | 'medium' | 'large';
  chipColor: string;

  label: string;
  fontWeight: 'normal' | 'bold' | 'semibold';
  fontColor: string;

  onClick: () => void;
  onIconClick: () => void;
  icon: JSX.Element;
  children: ReactNode;
};

export type Props = Partial<OwnProps> & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

export default function Chip({
  chipType = 'filled',
  size = 'medium',
  chipColor = 'var(--primary-green)',
  label,
  icon,
  onClick,
  onIconClick,
  fontWeight = 'normal',
  fontColor,
}: Props) {
  return (
    <ChipContainer chipType={chipType} size={size} chipColor={chipColor} onClick={onClick}>
      <Txt fontWeight={fontWeight} color={fontColor} fontSize={chipSizeMap[`${size}`].fontsize}>
        {label}
      </Txt>
      {icon && <IconContainer onClick={onIconClick}>{icon}</IconContainer>}
    </ChipContainer>
  );
}

const chipSizeMap = {
  xsmall: {
    fontsize: 12,
    height: '24px',
    padding: '8px',
  },
  small: {
    fontsize: 14,
    height: '36px',
    padding: '12px',
  },
  medium: {
    fontsize: 16,
    height: '48px',
    padding: '16px',
  },
  large: {
    fontsize: 18,
    height: '56px',
    padding: '16px',
  },
};

const ChipContainer = styled.button<{
  chipType: OwnProps['chipType'];
  size: OwnProps['size'];
  chipColor?: OwnProps['chipColor'];
}>`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  border: ${({ chipType, chipColor }) => (chipType === 'outlined' ? `1px solid ${chipColor}` : 'none')};
  background-color: ${({ chipColor }) => `${chipColor}`};
  height: ${({ size }) => chipSizeMap[`${size}`].height};
  padding-right: ${({ size }) => chipSizeMap[`${size}`].padding};
  padding-left: ${({ size }) => chipSizeMap[`${size}`].padding};
  color: var(--black);
  cursor: pointer;
`;

const IconContainer = styled.span`
  margin-left: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
