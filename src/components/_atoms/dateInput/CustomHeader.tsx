'use client';

import React from 'react';
import styled from '@emotion/styled';
import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { getMonth, getYear } from 'date-fns';

import { palette } from '@/styles';

interface CustomHeaderProps {
  date: Date;
  changeYear: (year: number) => void;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
}

export default function CustomHeader({
  date,
  changeYear,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: CustomHeaderProps) {
  const YEARS = Array.from({ length: getYear(new Date()) + 1 - 1990 }, (_, i) => getYear(new Date()) - i);
  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <CustomHeaderContainer>
      <div>
        <Month>{MONTHS[getMonth(date)]}</Month>
        <YearSelect value={getYear(date)} onChange={({ target: { value } }) => changeYear(+value)}>
          {YEARS.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </YearSelect>
      </div>
      <div>
        <MonthButton type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
          <ArrowBackIosNew fontSize="small" />
        </MonthButton>
        <MonthButton type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
          <ArrowForwardIos fontSize="small" />
        </MonthButton>
      </div>
    </CustomHeaderContainer>
  );
}

const CustomHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  margin-top: 4px;
  padding: 0 12px 0 24px;
`;

const Month = styled.span`
  font-size: 16px;
  font-weight: bold;
  margin-right: 4px;
`;

const YearSelect = styled.select`
  background-color: ${palette.white};
  color: ${palette.black};
  border: none;
  font-size: 16px;
  font-weight: bold;
  padding-right: 5px;
  cursor: pointer;
`;

const MonthButton = styled.button`
  width: 32px;
  height: 32px;
  padding: 5px;
  border-radius: 50%;
  background-color: ${palette.white};
  :nth-of-type(1) {
    margin-right: 8px;
  }
  &:hover {
    background-color: ${palette.primaryGreen};
  }

  &:disabled {
    cursor: not-allowed;

    svg {
      fill: #575757;
    }
  }
`;
