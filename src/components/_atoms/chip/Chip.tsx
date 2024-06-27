'use client';
import type { ReactNode } from 'react';
import React from 'react';
import styled from '@emotion/styled';

import type { fontWeight } from '@/styles';
import { chip, palette } from '@/styles';

import Txt from '../txt';

type OwnProps = {
  chipType: 'filled' | 'outlined';
  size: keyof typeof chip;
  fontWeight: keyof typeof fontWeight;
  chipColor: keyof typeof palette;
  fontColor: keyof typeof palette;

  label: string;
  onClick: () => void;
  onIconClick: () => void;
  icon: JSX.Element;
  closeButton: JSX.Element;
  children: ReactNode;
};

export type Props = Partial<OwnProps> & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

export default function Chip({
  chipType = 'filled',
  size = 'medium',
  chipColor = 'primaryGreen',
  label,
  icon,
  closeButton,
  onClick,
  onIconClick,
  fontWeight = 'normal',
  fontColor,
}: Props) {
  const handleOnclick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick && onClick();
  };
  return (
    <ChipContainer chipType={chipType} size={size} chipColor={chipColor} onClick={handleOnclick}>
      {icon && <IconContainer onClick={onIconClick}>{icon}</IconContainer>}
      <Txt fontWeight={fontWeight} color={fontColor} fontSize={chip[`${size}`].fontsize}>
        {label}
      </Txt>
      {closeButton}
    </ChipContainer>
  );
}

const ChipContainer = styled.button<{
  chipType: OwnProps['chipType'];
  size: OwnProps['size'];
  chipColor?: OwnProps['chipColor'];
}>`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid;
  border-color: ${({ chipType, chipColor }) => (chipType === 'outlined' ? palette[`${chipColor || `white`}`] : 'none')};
  background-color: ${({ chipType, chipColor }) =>
    chipType === 'outlined' ? 'transparent' : palette[`${chipColor || `white`}`]};
  height: ${({ size }) => chip[`${size}`].height};
  padding-right: ${({ size }) => chip[`${size}`].padding};
  padding-left: ${({ size }) => chip[`${size}`].padding};
  color: var(--black);
  cursor: pointer;
`;

const IconContainer = styled.span`
  margin-left: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
