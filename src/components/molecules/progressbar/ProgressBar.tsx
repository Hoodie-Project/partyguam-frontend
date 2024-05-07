'use client';

import React from 'react';
import styled from '@emotion/styled';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

import { Txt } from '@/components/atoms';
import { palette } from '@/styles';

interface Props {
  currentStep: boolean; // 현재 스템
  prevStep: boolean; // 이전 스템
  completed: boolean; // check 여부
  label: string;
  stepNum: number;
  isFinal?: boolean;
}
export default function ProgressBar({ currentStep, prevStep, completed, label, stepNum, isFinal }: Props) {
  return (
    <ProgressWrapper>
      <ProgressEdge isValid={currentStep || prevStep || completed}>
        {completed ? (
          <CheckRoundedIcon style={{ width: '1.25rem', height: '1.25rem' }} />
        ) : (
          <Txt fontWeight="bold" fontSize={16} fontColor={currentStep || prevStep || completed ? 'black' : 'grey400'}>
            {stepNum}
          </Txt>
        )}
      </ProgressEdge>
      <Txt fontWeight="bold" fontSize={14} fontColor={currentStep || prevStep || completed ? 'black' : 'grey400'}>
        {label}
      </Txt>
      {!isFinal && <ProgressLine isValid={prevStep || completed} />}
    </ProgressWrapper>
  );
}

const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ProgressEdge = styled.div<{ isValid: boolean }>`
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  margin-right: 10px;
  background-color: ${props => (props.isValid ? `${palette.primaryGreen}` : `${palette.grey100}`)};
`;

const ProgressLine = styled.div<{ isValid: boolean }>`
  background-color: ${props => (props.isValid ? `${palette.primaryGreen}` : `${palette.grey100}`)};
  width: 28px;
  height: 4px;
  margin: 0 5px;
`;
