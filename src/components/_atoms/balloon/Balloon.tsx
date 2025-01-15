import React from 'react';
import styled from '@emotion/styled';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { palette } from '@/styles/themes';

type OwnProps = {
  children: React.ReactNode;
  onClose: () => void;
  width?: string;
  height?: string;
  iconStyle?: React.CSSProperties;
};

type Props = OwnProps & React.HTMLAttributes<HTMLDivElement>;

export default function Balloon({ children, onClose, width, height, iconStyle, ...divAttributes }: Props) {
  // const handleClickCloseIcon = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
  //   e.preventDefault();
  //   onClose();
  // };

  return (
    <BalloonWrapper width={width} height={height} {...divAttributes}>
      {children}

      <CloseRoundedIcon
        onClick={onClose}
        sx={
          iconStyle ?? {
            width: '12px',
            height: '12px',
            cursor: 'pointer',
            fill: 'white',
            marginLeft: '4px',
            zIndex: 10,
          }
        }
      />
    </BalloonWrapper>
  );
}

const BalloonWrapper = styled.div<{ width?: string; height?: string }>`
  display: flex;
  flex-direction: row;
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
  box-shadow: 0px 2px 10px -1px rgba(17, 17, 17, 0.16);
  pointer-events: auto;
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
`;
