'use client';

import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import styled from '@emotion/styled';

type OwnProps = {
  fontWeight: 'normal' | 'bold' | 'semibold';
  color: string;
  fontSize: number;
  onClick: () => void;
};

export type Props = Partial<OwnProps> & Omit<HTMLAttributes<HTMLSpanElement>, 'as'>;

const Txt = forwardRef<HTMLSpanElement, Props>(({ fontWeight, color, fontSize, onClick, ...spanAttributes }, ref) => {
  return <Span fontWeight={fontWeight} color={color} fontSize={fontSize} onClick={onClick} {...spanAttributes} />;
});

export default Txt;

const Span = styled.span<Props>`
  font-weight: ${props => (props.fontWeight === 'semibold' ? 600 : props.fontWeight)};
  font-size: ${props => `${props.fontSize}px`};
  color: ${props => `var(${props.color})`};
  cursor: ${props => props.onClick && 'pointer'};
`;
