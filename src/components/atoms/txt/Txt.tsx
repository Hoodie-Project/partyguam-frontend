'use client';

import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';
import styled from '@emotion/styled';

type OwnProps = {
  fontWeight: 'normal' | 'bold' | 'semibold';
  color: string;
  fontSize: number;
};

export type Props = Partial<OwnProps> & Omit<HTMLAttributes<HTMLSpanElement>, 'as'>;

const Txt = forwardRef<HTMLSpanElement, Props>(({ fontWeight, color, fontSize, ...spanAttributes }, ref) => {
  return <Span fontWeight={fontWeight} color={color} fontSize={fontSize} {...spanAttributes} />;
});

export default Txt;

const Span = styled.span<Props>`
  font-weight: ${props => (props.fontWeight === 'semibold' ? 600 : props.fontWeight)};
  font-size: ${props => `${props.fontSize}px`};
  color: ${props => `var(${props.color})`};
`;
