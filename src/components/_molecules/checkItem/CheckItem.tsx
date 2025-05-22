'use client';
import React, { memo } from 'react';
import styled from '@emotion/styled';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

import { Square, Txt } from '@/components/_atoms';
import { palette } from '@/styles/themes';

type OwnProps = {
  label: string;
  isClick: boolean;
  clickBackground: keyof typeof palette;
  defaultBackground: keyof typeof palette;
  clickBorder: keyof typeof palette;
  defaultBorder: keyof typeof palette;
  pointer?: boolean;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export type Props = OwnProps & React.HTMLAttributes<HTMLDivElement>;

function CheckItem({
  label,
  isClick,
  clickBackground,
  defaultBackground,
  clickBorder,
  defaultBorder,
  pointer,
  ...divAttributes
}: Props) {
  return (
    <Square
      width="100%"
      height="56px"
      radiusKey="base"
      shadowKey="shadow1"
      backgroundColor={isClick ? clickBackground : defaultBackground}
      borderColor={isClick ? clickBorder : defaultBorder}
      position="flex-start"
      {...divAttributes}
      style={pointer ? { cursor: 'pointer' } : { cursor: 'not-allowed' }}
    >
      <LabelDiv isClick={isClick} style={pointer ? { cursor: 'pointer' } : { cursor: 'not-allowed' }}>
        {isClick ? <CheckCircleRoundedIcon fontSize="medium" /> : <CheckCircleOutlineRoundedIcon fontSize="medium" />}
        <Txt
          fontSize={16}
          fontWeight={isClick ? 'bold' : 'normal'}
          fontColor="black"
          style={pointer ? { cursor: 'pointer' } : { cursor: 'not-allowed' }}
        >
          {label}
        </Txt>
      </LabelDiv>
    </Square>
  );
}

const LabelDiv = styled.div<{ isClick: boolean }>`
  margin: 16.15px 20px;
  display: flex;
  gap: 6px;
  align-items: center;
  color: ${props => (props.isClick ? `${palette.greenDark100}` : `${palette.grey200}`)};
  cursor: pointer;
`;

export default memo(CheckItem);
