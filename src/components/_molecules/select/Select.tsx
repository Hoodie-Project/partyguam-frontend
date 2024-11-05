'use client';
import React, { memo, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';

import { Txt } from '@/components/_atoms';
import type { fontWeight } from '@/styles';
import { palette, radius, shadow, size } from '@/styles';

import MultiOptions from './MultiOptions';
import Options from './Options';

interface Props {
  height?: keyof typeof size.height;
  placeholder: string;
  value?: string;
  onClick?: (e: React.MouseEvent<HTMLLIElement>, id: number) => void; // id를 받도록 수정
  optionsType?: 'basic' | 'multi';
  options?: {
    // 기본 option
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
  children?: React.ReactNode;
  // MultiOptions 전용 props
  parentOptions?: { id: number; label: string }[] | null;
  selectedParentOptions?: { id: number; label: string }[] | null;
  setSelectedParentOptions?: React.Dispatch<React.SetStateAction<{ id: number; label: string }[] | null>>;
  selectedOptions?: { id: number; label: string }[] | null;
  setSelectedOptions?: React.Dispatch<React.SetStateAction<{ id: number; label: string }[] | null>>;
  // 초기화, 적용하기 button handler
  handleClickReset?: () => void;
  handleClickSubmit?: () => void;
}

function Select({
  height = 'l',
  placeholder,
  value,
  onClick,
  optionsType = 'basic',
  options,
  fontWeight = 'normal',
  fontSize = 16,
  fontColor = 'black',
  selectRadius = 'base',
  optionRadius = 'base',
  selectStyle,
  optionStyle,
  children,

  // MultiOptions 전용 props
  parentOptions,
  selectedParentOptions = [],
  setSelectedParentOptions,
  selectedOptions = [],
  setSelectedOptions,
  handleClickReset,
  handleClickSubmit,
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
    onClick?.(e, id); // 옵션 선택시 `onClick` 호출
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
      {isOpen && optionsType === 'basic' && (
        <Options
          options={options}
          onClick={handleOptionClick}
          setIsOpen={setIsOpen}
          height={height}
          optionRadius={optionRadius}
          optionStyle={optionStyle}
        />
      )}
      {isOpen && optionsType === 'multi' && (
        <MultiOptions
          parentOptions={parentOptions}
          options={options}
          setIsOpen={setIsOpen}
          height={height}
          optionRadius={optionRadius}
          optionStyle={optionStyle}
          selectedParentOptions={selectedParentOptions}
          setSelectedParentOptions={setSelectedParentOptions}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          handleClickReset={handleClickReset}
          handleClickSubmit={handleClickSubmit}
        />
      )}
    </PickerWrapper>
  );
}

export const SelectComponent = memo(Select);

const PickerWrapper = styled.div`
  position: relative;
  width: auto;
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
