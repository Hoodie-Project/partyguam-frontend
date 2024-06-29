'use client';
import React from 'react';
import styled from '@emotion/styled';

import { Square } from '@/components/_atoms';
import type { Props as SquareProps } from '@/components/_atoms/square';
import type { chip } from '@/styles';
import { fontWeight, palette } from '@/styles';

type ChipProps = {
  chipWidth: string;
  chipHeight: string;
  chipFontSize: number;
  chipFontWeight: keyof typeof fontWeight;
  chipFontColor: keyof typeof palette;
  chipSize: keyof typeof chip;
  chipLabel: string;
  chipColor: keyof typeof palette;
};

type Props = SquareProps &
  Partial<ChipProps> & {
    titleText: React.ReactNode;
    contentText?: React.ReactNode;
  };

export function TipBoxArea({
  width,
  height,
  radiusKey,
  shadowKey,
  backgroundColor,
  borderColor,

  chipWidth,
  chipHeight,
  chipFontColor,
  chipFontSize,
  chipFontWeight,
  chipColor,
  chipLabel,
  chipSize,

  titleText,
  contentText,
}: Props) {
  return (
    <SquareArea
      width={width || '100%'}
      height={height || '100%'}
      radiusKey={radiusKey}
      shadowKey={shadowKey || 'none'}
      backgroundColor={backgroundColor || 'white'}
      borderColor={borderColor}
    >
      <TipWrapper>
        <TipTitleArea>
          <Chip
            chipWidth={chipWidth}
            chipHeight={chipHeight}
            chipColor={chipColor}
            chipFontColor={chipFontColor}
            chipFontSize={chipFontSize}
            chipFontWeight={chipFontWeight}
            chipSize={chipSize}
          >
            {chipLabel}
          </Chip>
          {titleText}
        </TipTitleArea>
        <TipContentArea>{contentText}</TipContentArea>
      </TipWrapper>
    </SquareArea>
  );
}

const SquareArea = styled(Square)`
  padding: 1.25rem;
`;

const TipWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const TipTitleArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;
`;

const TipContentArea = styled.div`
  margin-top: 4px;
`;

const Chip = styled.div<Partial<ChipProps>>`
  width: ${({ chipWidth }) => chipWidth || 'auto'};
  height: ${({ chipHeight }) => chipHeight || 'auto'};
  background-color: ${({ chipColor }) => (chipColor ? palette[chipColor] : 'primaryGreen')};
  color: ${({ chipFontColor }) => (chipFontColor ? palette[chipFontColor] : 'white')};
  font-size: ${({ chipFontSize }) => chipFontSize || 14}px;
  font-weight: ${({ chipFontWeight }) => (chipFontWeight ? fontWeight[chipFontWeight] : 'normal')};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border-radius: 50px;
`;
