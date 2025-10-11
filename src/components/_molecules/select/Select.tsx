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

type OptionType = {
  id: number;
  label: string;
};

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

  isSelectedIcon?: boolean;
  selectStyle?: React.CSSProperties;
  optionStyle?: React.CSSProperties;
  eachOptionStyle?: React.CSSProperties;

  children?: React.ReactNode;
  // MultiOptions 전용 props
  parentOptions?: { id: number; label: string }[] | null;
  selectedParentOptions?: { id: number; label: string }[] | null;
  selectedOptions?: { id: number; label: string }[] | null;
  chipData?: {
    id: number;
    parentLabel?: string;
    label: string;
  }[];
  handleParentOptionSelect?: (parentOption: OptionType) => void;
  handleOptionToggle?: (option: OptionType) => void;
  handleRemoveChip?: (id: number) => void; // remove chip
  handleClickReset?: () => void;
  handleClickSubmit?: () => void;
  // 열릴 떄 값 초기화
  handleOpenReset?: () => void;
  isSubmitted?: boolean; // 적용하기 버튼 눌러서 닫힌 것인지 flag
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
  isSelectedIcon = false,
  selectStyle,
  optionStyle,
  eachOptionStyle,
  parentOptions,
  selectedParentOptions = [],
  selectedOptions = [],
  chipData = [],
  handleParentOptionSelect,
  handleOptionToggle,
  handleRemoveChip,
  handleClickReset,
  handleClickSubmit,
  handleOpenReset,
  isSubmitted,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const isValid: boolean = value !== undefined && value.length > 0;

  const handleClickOutside = (e: MouseEvent) => {
    if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
      setIsOpen(false);
      // if (optionsType === 'multi' && !isSubmitted) {
      //   handleClickReset?.(); // 값 초기화
      // }
    }
  };

  useEffect(() => {
    // if (optionsType === 'multi') return;
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
        <IconWrapper>
          {isOpen ? (
            <KeyboardArrowUpRoundedIcon fontSize="medium" style={{color: isSelectedIcon ? '#11C9A7' : '#999999'}}/>
          ) : (
            <KeyboardArrowDownRoundedIcon fontSize="medium" style={{color: isSelectedIcon ? '#11C9A7' : '#999999'}}/>
          )}
        </IconWrapper>
      </PickerDropDown>
      {isOpen && optionsType === 'basic' && (
        <Options
          options={options}
          onClick={handleOptionClick}
          setIsOpen={setIsOpen}
          height={height}
          optionRadius={optionRadius}
          optionStyle={optionStyle}
          eachOptionStyle={eachOptionStyle}
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
          selectedOptions={selectedOptions}
          chipData={chipData}
          handleParentOptionSelect={handleParentOptionSelect}
          handleOptionToggle={handleOptionToggle}
          handleClickReset={handleClickReset}
          handleClickSubmit={handleClickSubmit}
          handleRemoveChip={handleRemoveChip}
          handleOpenReset={handleOpenReset}
        />
      )}
    </PickerWrapper>
  );
}

export const SelectComponent = memo(Select);

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

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* 아이콘의 이벤트를 부모로 전달 */
`;
