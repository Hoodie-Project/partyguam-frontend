'use client';
import React from 'react';
import styled from '@emotion/styled';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

import { Txt } from '@/components/_atoms';
import { radius, size } from '@/styles';

type OptionType = {
  id: number;
  label: string;
};

type Props = {
  parentOptions?: OptionType[] | null; // parentOptions가 존재하면 depth가 2인 UI라는 것
  options?: OptionType[] | null; // option list들
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>; // option컴포넌트 닫게 하는 것
  height?: keyof typeof size.height; // select height

  optionRadius?: keyof typeof radius;
  optionStyle?: React.CSSProperties;

  // 부모 필터 option List 관리 -> 직무필터시 왼쪽 UI를 위한
  selectedParentOptions?: { id: number; label: string }[] | null;
  setSelectedParentOptions?: React.Dispatch<React.SetStateAction<{ id: number; label: string }[] | null>>;

  // 선택한 option list들 관리
  selectedOptions?: { id: number; label: string }[] | null;
  setSelectedOptions?: React.Dispatch<React.SetStateAction<{ id: number; label: string }[] | null>>;
};

export default function MultiOptions({
  parentOptions,
  options,
  setIsOpen,
  height,
  optionRadius = 'base',
  optionStyle,
  selectedParentOptions = [],
  setSelectedParentOptions,
  selectedOptions = [],
  setSelectedOptions,
}: Props) {
  const handleParentOptionSelect = (parentOption: OptionType) => {
    if (setSelectedParentOptions) {
      if (selectedParentOptions?.[0]?.id === parentOption.id) {
        setSelectedParentOptions([]); // 같은 옵션 클릭 시 선택 해제
      } else {
        setSelectedParentOptions([parentOption]); // 다른 옵션 선택 시 해당 옵션으로 교체
      }
    }
  };

  // Options는 다중 선택 가능하게 설정
  const handleOptionToggle = (option: OptionType) => {
    if (selectedOptions?.some(selected => selected.id === option.id)) {
      setSelectedOptions && setSelectedOptions(selectedOptions.filter(selected => selected.id !== option.id));
    } else {
      setSelectedOptions && setSelectedOptions([...(Array.isArray(selectedOptions) ? selectedOptions : []), option]);
    }
  };

  const handleReset = () => {
    setSelectedOptions && setSelectedOptions([]);
    setSelectedParentOptions && setSelectedParentOptions([]);
  };

  const handleApply = () => {
    setIsOpen?.(false);
  };

  return (
    <SelectMultiOptions top={height} optionRadius={optionRadius} style={optionStyle}>
      <OptionGroupWrapper>
        {parentOptions && (
          <OptionGroup style={{ width: '160px' }}>
            {parentOptions.map((parentOption, index) => (
              <OptionItem
                key={parentOption.id}
                onClick={() => handleParentOptionSelect(parentOption)}
                style={{
                  borderRadius: index === 0 ? '16px 0px 0px 0px' : '0px 0px 0px 0px',
                  justifyContent: 'space-between',
                  backgroundColor: selectedParentOptions?.[0]?.id === parentOption.id ? '#DDFCF6' : 'transparent',
                }}
              >
                <Txt
                  fontWeight={selectedParentOptions?.[0]?.id === parentOption.id ? 'semibold' : 'normal'}
                  fontSize={16}
                  style={{ marginTop: '2px' }}
                >
                  {parentOption.label}
                </Txt>
                <ArrowForwardIosRoundedIcon
                  style={{
                    width: '16px',
                    color: selectedParentOptions?.[0]?.id === parentOption.id ? 'black' : 'D4D4D4',
                  }}
                />
              </OptionItem>
            ))}
          </OptionGroup>
        )}
        <OptionGroup style={{ width: parentOptions ? '240px' : '100%' }}>
          {options?.map((option, index) => (
            <OptionItem
              key={option.id}
              onClick={() => handleOptionToggle(option)}
              style={{
                borderRadius:
                  parentOptions && index === 0
                    ? '0px 16px 0px 0px'
                    : index === 0
                      ? '16px 16px 0px 0px'
                      : '0px 0px 0px 0px',
              }}
            >
              {selectedOptions?.some(selected => selected.id === option.id) ? (
                <CheckCircleRoundedIcon style={{ color: '#21ECC7' }} />
              ) : (
                <CheckCircleOutlineRoundedIcon style={{ color: '#D4D4D4' }} />
              )}

              <Txt
                fontWeight={selectedOptions?.some(selected => selected.id === option.id) ? 'semibold' : 'normal'}
                fontSize={16}
                style={{ marginTop: '2px' }}
              >
                {option.label}
              </Txt>
            </OptionItem>
          ))}
        </OptionGroup>
      </OptionGroupWrapper>
      <Border />
      {/* chip component container */}
      <ActionButtons>
        <CircleButton buttonType="초기화" onClick={handleReset}>
          초기화
        </CircleButton>
        <CircleButton buttonType="적용하기" onClick={handleApply}>
          적용하기
        </CircleButton>
      </ActionButtons>
    </SelectMultiOptions>
  );
}

const SelectMultiOptions = styled.div<{ top?: keyof typeof size.height; optionRadius?: keyof typeof radius }>`
  position: absolute;
  width: auto;
  top: ${({ top = 'base' }) => `calc(${size.height[top]} + 10px)`};
  left: 0;
  border-radius: ${props => props.optionRadius && radius[props.optionRadius]};
  background-color: #ffffff;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.04);

  border: 1px solid #11c9a7;
`;

const OptionGroupWrapper = styled.div`
  width: 100%;
  height: 260px;
  display: flex;
  flex-direction: row;
`;

const OptionGroup = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

const OptionItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 15px 20px;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const Border = styled.div`
  width: 100%;
  height: 1px;
  border: 1px solid #e5e5ec;
`;
const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 8px 12px;
`;

const CircleButton = styled.button<{ buttonType: '초기화' | '적용하기'; isDisable?: boolean }>`
  background-color: ${({ buttonType, isDisable }) =>
    buttonType === '초기화' ? 'white' : isDisable ? '#DDFCF6' : '#21ecc7'};
  border: ${({ isDisable }) => (isDisable ? '1px solid #AEF8EB' : '1px solid #21ecc7')};
  border-radius: 999px;
  padding: 9.5px 12px;
  color: ${({ isDisable }) => (isDisable ? '#999999' : 'black')};
  font-size: 12px;
`;
