'use client';

import 'react-datepicker/dist/react-datepicker.css';

import { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { format, parse, startOfDay } from 'date-fns';

import type { Props } from '../input';
import Input from '../input';

import CustomHeader from './CustomHeader';

export default function DateInput(props: Props) {
  const [selectDate, setSelectDate] = useState<Date | null>(null);
  const REGEX = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

  const minDate = new Date('1900-01-01');
  const maxDate = startOfDay(new Date());

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const parsedDate = parse(value, 'yyyy-MM-dd', new Date());

    if (REGEX.test(value) && parsedDate >= minDate && parsedDate <= maxDate) {
      if (format(parsedDate, 'yyyy-MM-dd') === value) {
        setSelectDate(parsedDate);
        return;
      }
    } else {
      setSelectDate(null);
    }
  };

  const inputState = useMemo(() => {
    if (!selectDate) {
      return 'default';
    }

    const formattedDate = format(selectDate, 'yyyy-MM-dd');
    const isValid = REGEX.test(formattedDate) && selectDate && selectDate >= minDate && selectDate <= maxDate;

    return isValid ? 'success' : 'warn';
  }, [selectDate]);

  return (
    <DatePicker
      selected={selectDate}
      maxDate={startOfDay(new Date())} /** 오늘 이후 날짜 선택 불가 */
      dateFormat="yyyy-MM-dd"
      placeholderText="ex. 2000-01-01"
      onChange={date => setSelectDate(date)}
      dayClassName={date => (date.getDate() === selectDate?.getDate() ? 'selectedDay' : 'unselectedDay')}
      customInput={
        <Input
          inputState={inputState}
          value={selectDate ? format(selectDate, 'yyyy-MM-dd') : ''}
          onChange={handleInputChange}
          onClear={date => setSelectDate(null)}
          {...props}
        />
      }
      renderCustomHeader={props => <CustomHeader {...props} />}
      showDisabledMonthNavigation
      shouldCloseOnSelect
    />
  );
}
