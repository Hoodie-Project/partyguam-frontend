import React from 'react';
import styled from '@emotion/styled';

import { palette, radius, size } from '@/styles';

type OptionType = {
  id: number;
  label: string;
};

type Props = {
  options?: OptionType[];
  onClick: (e: React.MouseEvent<HTMLLIElement>, id: number) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  height?: keyof typeof size.height;

  optionRadius?: keyof typeof radius;
  optionStyle?: React.CSSProperties;
  eachOptionStyle?: React.CSSProperties;
};

// 기본 option ->
export default function Options({
  options,
  onClick,
  setIsOpen,
  height,
  optionRadius = 'base',
  eachOptionStyle,
  optionStyle,
}: Props) {
  const handleOptionClick = (e: React.MouseEvent<HTMLLIElement>, option: OptionType) => {
    onClick(e, option.id);
    setIsOpen(false);
  };

  return (
    <SelectOptions top={height} optionRadius={optionRadius} style={optionStyle}>
      {options &&
        options.map(option => (
          <SelectOption key={option.id} onClick={e => handleOptionClick(e, option)} style={eachOptionStyle}>
            {option.label}
          </SelectOption>
        ))}
    </SelectOptions>
  );
}

const SelectOptions = styled.ul<{ top?: keyof typeof size.height; optionRadius?: keyof typeof radius }>`
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100%;
  top: ${props => size.height[props.top || 'base']};
  margin-top: 5px;
  height: auto;
  max-height: 16.5rem;
  overflow-y: scroll;
  background-color: white;
  border-radius: ${({ optionRadius: radiusProp }) => radius[radiusProp!] || radius.base};
  clip-path: ${({ optionRadius: radiusProp }) => `inset(0 round ${radius[radiusProp!] || radius.base})`};

  z-index: 10;
  border: 1px solid ${palette.greenDark100};

  ::-webkit-scrollbar {
    display: none;
    width: 8px;
  }
  &:hover {
    ::-webkit-scrollbar {
      display: initial;
    }
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 999px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(33, 236, 199, 0.3);
    border-radius: 999px;
  }
`;

const SelectOption = styled.li`
  padding: 10px;
  border-bottom: 1px solid ${palette.grey200};
  &:hover {
    background-color: #d9d9d9;
  }

  &:last-child {
    border-bottom: none;
  }
`;
