import React from 'react';
import styled from '@emotion/styled';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';

import { Txt } from '@/components/_atoms';

interface ToggleProps {
  isOn: boolean;
  labelOn?: string;
  labelOff?: string;
  onToggle?: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ isOn, labelOn = '공개', labelOff = '비공개', onToggle }) => {
  return (
    <ToggleContainer onClick={() => onToggle?.()}>
      <Txt fontSize={12} fontColor={isOn ? 'greenDark100' : 'grey400'}>
        {isOn ? labelOn : labelOff}
      </Txt>
      {isOn ? (
        <ToggleOnIcon style={{ width: '40px', height: '40px', color: '#21ECC7' }} />
      ) : (
        <ToggleOffOutlinedIcon style={{ width: '40px', height: '40px', color: '#999999' }} />
      )}
    </ToggleContainer>
  );
};

export default Toggle;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  cursor: pointer;
`;
