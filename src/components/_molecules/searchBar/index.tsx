'use client';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

import { palette } from '@/styles';

type SearchBarProps = {
  type: 'round' | 'line';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  searchBarStyle?: React.CSSProperties;
  searchInputStyle?: React.CSSProperties;
  iconSize?: number;
};

function SearchBar({
  type,
  placeholder,
  value,
  onChange,
  onClear,
  onKeyDown,
  searchBarStyle,
  searchInputStyle,
  iconSize,
}: SearchBarProps) {
  const [isInputClicked, setIsInputClicked] = useState<boolean>(false);

  return (
    <SearchContainer type={type} style={searchBarStyle}>
      <SearchIconWrapper>
        <SearchRoundedIcon />
      </SearchIconWrapper>
      <SearchInput
        type="text"
        onFocus={() => setIsInputClicked(true)}
        onBlur={() => setIsInputClicked(false)}
        placeholder={isInputClicked ? '' : placeholder || undefined}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        style={searchInputStyle}
      />
      {value && (
        <ClearIconWrapper onClick={onClear}>
          <HighlightOffRoundedIcon style={{ width: `${iconSize}px`, height: `${iconSize}px` }} />
        </ClearIconWrapper>
      )}
    </SearchContainer>
  );
}

export default SearchBar;

const SearchContainer = styled.div<{ type: 'round' | 'line' }>`
  display: flex;
  align-items: center;
  padding: ${({ type }) => (type === 'line' ? '8px 12px' : '8px 16px')};
  width: 100%;
  height: 100%;
  background-color: white;
  border: ${({ type }) => (type === 'line' ? 'none' : `1px solid ${palette.grey200}`)};
  border-radius: ${({ type }) => (type === 'round' ? '999px' : 0)};
  border-bottom: ${({ type }) => (type === 'line' ? `1px solid ${palette.grey400}` : `1px solid ${palette.grey200}`)};
`;

const SearchIconWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${palette.grey500};
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  margin-left: 8px;
  color: ${palette.black};
  background-color: transparent;
  &::placeholder {
    color: ${palette.grey500};
  }
`;

const ClearIconWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${palette.grey500};
  margin-left: 8px;
`;
