'use client';

import type { HTMLAttributes } from 'react';
import styled from '@emotion/styled';

import { fontWeight, palette } from '@/styles';

type OwnProps = {
  fontWeight: keyof typeof fontWeight;
  fontColor: keyof typeof palette | string;
  fontSize: number;
  textDecoration: 'underline' | 'none';
  onClick: () => void;
};

export type Props = Partial<OwnProps> & Omit<HTMLAttributes<HTMLSpanElement>, 'as'>;

export default function Txt({
  fontWeight = 'normal',
  fontColor = 'black',
  fontSize = 18,
  textDecoration = 'none',
  onClick,
  ...spanAttributes
}: Props) {
  return (
    <Span
      fontWeight={fontWeight}
      fontColor={fontColor}
      fontSize={fontSize}
      onClick={onClick}
      textDecoration={textDecoration}
      {...spanAttributes}
    />
  );
}

const Span = styled.span<Props>`
  font-weight: ${props => (props.fontWeight ? fontWeight[props.fontWeight] : fontWeight.normal)};
  font-size: ${props => `${props.fontSize}px`};
  color: ${props =>
    typeof props.fontColor === 'string'
      ? props.fontColor.startsWith('#')
        ? props.fontColor
        : palette[props.fontColor as keyof typeof palette]
      : palette.black};
  cursor: ${props => props.onClick && 'pointer'};
  white-space: 'pre-wrap';
  text-decoration: ${props => props.textDecoration};
  text-underline-offset: 2px;
`;
