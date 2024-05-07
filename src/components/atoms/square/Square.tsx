import React from 'react';
import styled from '@emotion/styled';

import { palette, radius, shadow } from '@/styles/themes';

type OwnProps = {
  width: string;
  height: string;
  radiusKey?: keyof typeof radius;
  shadowKey: keyof typeof shadow;
  backgroundColor: keyof typeof palette;
  children?: React.ReactNode;
};

export type Props = OwnProps & React.HTMLAttributes<HTMLDivElement>;

export default function Square({
  width,
  height,
  radiusKey = 'none',
  shadowKey,
  backgroundColor,
  children,
  ...divAttributes
}: Props) {
  return (
    <SquareContainer
      width={width}
      height={height}
      radiusKey={radiusKey}
      shadowKey={shadowKey}
      backgroundColor={backgroundColor}
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
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  border-radius: ${({ radiusKey }) => radius[radiusKey]};
  background-color: ${({ backgroundColor }) => palette[`${backgroundColor}`]};
  box-shadow: ${({ shadowKey }) => shadow[`${shadowKey}`]};
`;
