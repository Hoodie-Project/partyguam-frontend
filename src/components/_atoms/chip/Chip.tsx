'use client';
import type { ReactNode } from 'react';
import React from 'react';
import styled from '@emotion/styled';

import type { fontWeight } from '@/styles';
import { chip, palette, shadow } from '@/styles';

import Txt from '../txt';

type OwnProps = {
  chipType: 'filled' | 'outlined';
  size: keyof typeof chip;
  fontWeight: keyof typeof fontWeight;
  chipColor: keyof typeof palette | string;
  fontColor: keyof typeof palette | string;
  shadow: keyof typeof shadow;

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
  fontColor = 'black',
  shadow = 'none',
  label,
  icon,
  closeButton,
  onClick,
  onIconClick,
  fontWeight = 'normal',
}: Props) {
  const handleOnclick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClick && onClick();
  };

  return (
    <ChipContainer chipType={chipType} size={size} chipColor={chipColor} shadow={shadow} onClick={handleOnclick}>
      {icon && <IconContainer onClick={onIconClick}>{icon}</IconContainer>}
      <Txt fontWeight={fontWeight} fontColor={fontColor} fontSize={chip[size].fontsize}>
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
  shadow: OwnProps['shadow'];
}>`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  border: 1px solid;
  border-color: ${({ chipType, chipColor }) =>
    chipType === 'outlined'
      ? typeof chipColor === 'string' && chipColor.startsWith('#')
        ? chipColor
        : palette[chipColor as keyof typeof palette] || 'transparent'
      : 'transparent'};

  background-color: ${({ chipType, chipColor }) =>
    chipType === 'outlined'
      ? 'transparent'
      : typeof chipColor === 'string' && chipColor.startsWith('#')
        ? chipColor
        : palette[chipColor as keyof typeof palette] || 'transparent'};
  height: ${({ size }) => chip[size].height};
  padding-right: ${({ size }) => chip[size].padding};
  padding-left: ${({ size }) => chip[size].padding};

  box-shadow: ${props => (props.shadow ? shadow[props.shadow] : 'none')};

  color: var(--black);
  cursor: pointer;
`;

const IconContainer = styled.span`
  margin-left: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;
