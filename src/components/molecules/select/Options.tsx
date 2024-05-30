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
};

export default function Options({ options, onClick, setIsOpen, height }: Props) {
  const handleOptionClick = (e: React.MouseEvent<HTMLLIElement>, option: OptionType) => {
    onClick(e, option.id);
    setIsOpen(false);
  };

  return (
    <SelectOptions top={height}>
      {options &&
        options.map(option => (
          <SelectOption key={option.id} onClick={e => handleOptionClick(e, option)}>
            {option.label}
          </SelectOption>
        ))}
    </SelectOptions>
  );
}

const SelectOptions = styled.ul<{ top?: keyof typeof size.height }>`
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
  border-radius: ${radius.base};
  z-index: 10;
  border: 1px solid ${palette.primaryGreen};

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
