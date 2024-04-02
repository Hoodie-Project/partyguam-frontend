'use client';

import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import styled from '@emotion/styled';

import { fontWeight, palette } from '@/styles';

type OwnProps = {
  fontWeight: keyof typeof fontWeight;
  fontColor: keyof typeof palette;
  fontSize: number;
  onClick: () => void;
};

export type Props = Partial<OwnProps> & Omit<HTMLAttributes<HTMLSpanElement>, 'as'>;

const Txt = forwardRef<HTMLSpanElement, Props>(
  ({ fontWeight = 'normal', fontColor = 'black', fontSize = 18, onClick, ...spanAttributes }, ref) => {
    return (
      <Span fontWeight={fontWeight} fontColor={fontColor} fontSize={fontSize} onClick={onClick} {...spanAttributes} />
    );
  },
);

export default Txt;

const Span = styled.span<Props>`
  font-weight: ${props => (props.fontWeight ? fontWeight[props.fontWeight] : fontWeight.normal)};
  font-size: ${props => `${props.fontSize}px`};
  color: ${props => (props.fontColor ? palette[props.fontColor] : palette.black)};
  cursor: ${props => props.onClick && 'pointer'};
`;
