import React from 'react';
import styled from '@emotion/styled';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { palette } from '@/styles/themes';

type OwnProps = {
  children: React.ReactNode;
  onClose: () => void;
  width?: string;
  height?: string;
};

type Props = OwnProps & React.HTMLAttributes<HTMLDivElement>;

export default function Balloon({ children, onClose, width, height, ...divAttributes }: Props) {
  return (
    <BalloonWrapper width={width} height={height} {...divAttributes}>
      {children}
      <CloseRoundedIcon
        onClick={onClose}
        sx={{
          width: '12px',
          cursor: 'pointer',
          fill: 'white',
          marginLeft: '4px',
        }}
      />
    </BalloonWrapper>
  );
}

const BalloonWrapper = styled.div<{ width?: string; height?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${palette.grey500};
  color: white;
  border-radius: 20px;
  font-size: 14px;
  text-align: center;
  position: relative;
  width: ${props => props.width || 'auto'};
  height: ${props => props.height || 'auto'};

  &::after {
    content: '';
    position: absolute;
    top: -17px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent ${palette.grey500} transparent;
  }

  z-index: -1;
`;
