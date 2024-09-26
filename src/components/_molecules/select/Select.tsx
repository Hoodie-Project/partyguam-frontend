'use client';
import React, { memo, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';

import { Txt } from '@/components/_atoms';
import type { fontWeight } from '@/styles';
import { palette, radius, shadow, size } from '@/styles';

import Options from './Options';

interface Props {
  height?: keyof typeof size.height;
  placeholder: string;
  value?: string;
  onClick: (e: React.MouseEvent<HTMLLIElement>, id: number) => void; // id를 받도록 수정
  options?: {
    id: number;
    label: string;
  }[];

  fontWeight?: keyof typeof fontWeight;
  fontSize?: number;
  fontColor?: keyof typeof palette;

  selectRadius?: keyof typeof radius;
  optionRadius?: keyof typeof radius;

  selectStyle?: React.CSSProperties;
  optionStyle?: React.CSSProperties;
}

function Select({
  height = 'l',
  placeholder,
  value,
  onClick,
  options,
  fontWeight = 'normal',
  fontSize = 16,
  fontColor = 'black',
  selectRadius = 'base',
  optionRadius = 'base',
  selectStyle,
  optionStyle,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const isValid: boolean = value !== undefined && value.length > 0;

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

  const handleOptionClick = (e: React.MouseEvent<HTMLLIElement>, id: number) => {
    onClick(e, id); // 옵션 선택시 `onClick` 호출
    setIsOpen(false); // 옵션 선택 후 드롭다운 닫기
  };

  return (
    <PickerWrapper ref={pickerRef}>
      <PickerDropDown
        height={height}
        selectRadius={selectRadius}
        isValid={isValid}
        style={selectStyle}
        onClick={() => setIsOpen(prev => !prev)}
      >
        {!value ? (
          <Txt fontWeight={fontWeight} fontSize={fontSize} fontColor="grey400">
            {placeholder}
          </Txt>
        ) : (
          <Txt fontWeight={fontWeight} fontSize={fontSize} fontColor={fontColor}>
            {value}
          </Txt>
        )}
        {isOpen ? <KeyboardArrowUpRoundedIcon fontSize="medium" /> : <KeyboardArrowDownRoundedIcon fontSize="medium" />}
      </PickerDropDown>
      {isOpen && (
        <Options
          options={options}
          onClick={handleOptionClick} // `handleOptionClick`을 전달
          setIsOpen={setIsOpen}
          height={height}
          optionRadius={optionRadius}
          optionStyle={optionStyle}
        />
      )}
    </PickerWrapper>
  );
}

export default memo(Select);

const PickerWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const PickerDropDown = styled.div<{
  height: keyof typeof size.height;
  isValid: boolean;
  selectRadius?: keyof typeof radius;
}>`
  width: 100%;
  height: ${props => size.height[props.height || 'base']};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 17px 20px;
  color: ${palette.grey300};
  background: #ffffff;
  border-radius: ${({ selectRadius: radiusProp }) => radius[radiusProp!] || radius.base};
  border: ${({ isValid }) => `1px solid ${isValid ? palette.greenDark100 : palette.grey200}`};
  box-shadow: ${shadow.shadow1};
`;
