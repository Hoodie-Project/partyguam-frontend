import React from 'react';
import styled from '@emotion/styled';

import { palette, radius, shadow } from '@/styles/themes';

type OwnProps = {
  width: string;
  height: string;
  radiusKey?: keyof typeof radius;
  shadowKey: keyof typeof shadow;
  backgroundColor: keyof typeof palette;
  borderColor?: keyof typeof palette;
  children?: React.ReactNode;
  position?: string;
};

export type Props = OwnProps & React.HTMLAttributes<HTMLDivElement>;

export default function Square({
  width,
  height,
  radiusKey = 'none',
  shadowKey,
  backgroundColor,
  borderColor = 'transparent',
  children,
  position = 'center',
  ...divAttributes
}: Props) {
  return (
    <SquareContainer
      width={width}
      height={height}
      radiusKey={radiusKey}
      shadowKey={shadowKey}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      position={position}
      {...divAttributes}
    >
      {children}
    </SquareContainer>
  );
}

const SquareContainer = styled.div<{
  width: string;
  height: string;
  radiusKey: keyof typeof radius;
  shadowKey: keyof typeof shadow;
  backgroundColor: keyof typeof palette;
  borderColor?: keyof typeof palette;
  position?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ position }) => position};
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  border-radius: ${({ radiusKey }) => radius[radiusKey]};
  background-color: ${({ backgroundColor }) => palette[backgroundColor]};
  box-shadow: ${({ shadowKey }) => shadow[shadowKey]};
  ${props => props.borderColor && `border: 1px solid ${palette[props.borderColor]}`};
`;
