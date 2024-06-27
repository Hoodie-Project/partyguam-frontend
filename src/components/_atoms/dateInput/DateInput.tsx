/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import 'react-datepicker/dist/react-datepicker.css';

import { useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { format, isValid, parse } from 'date-fns';

import { DATE_REGEX, INVALID_BIRTHDAY } from '@/constants';

import type { Props as InputProps } from '../input';
import Input from '../input';

import CustomHeader from './CustomHeader';

type OwnProps = {
  minDate?: Date;
  maxDate?: Date;
  selectDate?: Date | null;
  setSelectDate: (date: Date | null) => void;
};
type DateInputProps = OwnProps & InputProps;

export default function DateInput({ minDate, maxDate, selectDate, setSelectDate, onClear, ...props }: DateInputProps) {
  const dateValidate: { inputState?: 'default' | 'warn' | 'success'; bottomMessage?: string } = useMemo(() => {
    if (!selectDate) {
      return { inputState: 'default' };
    }

    const formattedDate = format(selectDate, 'yyyy-MM-dd');
    const isValid =
      DATE_REGEX.test(formattedDate) &&
      selectDate &&
      minDate &&
      maxDate &&
      selectDate >= minDate &&
      selectDate <= maxDate;

    return isValid ? { inputState: 'success' } : { inputState: 'warn', bottomMessage: INVALID_BIRTHDAY };
  }, [selectDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = parse(e.target.value, 'yyyy-MM-dd', new Date());
    if (isValid(newDate) && DATE_REGEX.test(e.target.value)) {
      setSelectDate(newDate);
    } else {
      setSelectDate(null);
    }
  };

  return (
    <DatePicker
      selected={selectDate}
      maxDate={maxDate}
      minDate={minDate}
      dateFormat="yyyy-MM-dd"
      placeholderText="ex. 2000-01-01"
      onChange={date => setSelectDate(date)}
      dayClassName={date => (date.getDate() === selectDate?.getDate() ? 'selectedDay' : 'unselectedDay')}
      customInput={
        <Input
          onChange={handleInputChange}
          inputState={dateValidate.inputState}
          bottomMessage={dateValidate.bottomMessage}
          value={selectDate ? format(selectDate, 'yyyy-MM-dd') : ''}
          onClear={onClear}
          {...props}
        />
      }
      renderCustomHeader={props => <CustomHeader {...props} />}
      showDisabledMonthNavigation
      shouldCloseOnSelect
    />
  );
}
