'use client';
import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

import type { fontWeight } from '@/styles';
import { palette, radius, shadow, size } from '@/styles';

import Txt from '../../atoms/txt';

import Options from './Options';

interface Props {
  height?: keyof typeof size.height;
  placeholder: string;
  value?: string;
  onClick: (e: React.MouseEvent<HTMLLIElement>) => void;
  options?: {
    id: number;
    label: string;
  }[];

  fontWeight?: keyof typeof fontWeight;
  fontSize?: number;
  fontColor?: keyof typeof palette;
}

export default function Select({
  height = 'l',
  placeholder,
  value,
  onClick,
  options,
  fontWeight = 'normal',
  fontSize = 16,
  fontColor = 'black',
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <PickerWrapper ref={pickerRef}>
      <PickerDropDown height={height} onClick={() => setIsOpen(prev => !prev)}>
        {!value ? (
          <Txt fontWeight={fontWeight} fontSize={fontSize} fontColor="grey400">
            {placeholder}
          </Txt>
        ) : (
          <Txt fontWeight={fontWeight} fontSize={fontSize} fontColor={fontColor}>
            {value}
          </Txt>
        )}
        <KeyboardArrowDownRoundedIcon fontSize="medium" />
      </PickerDropDown>
      {isOpen && <Options options={options} onClick={onClick} setIsOpen={setIsOpen} height={height} />}
    </PickerWrapper>
  );
}

const PickerWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const PickerDropDown = styled.div<{ height: keyof typeof size.height }>`
  width: 100%;
  height: ${props => size.height[props.height || 'base']};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 17px 20px;
  color: ${palette.grey300};
  background: #ffffff;
  border-radius: ${radius.base};
  border: 1px solid ${palette.grey200};
  box-shadow: ${shadow.shadow1};
`;
