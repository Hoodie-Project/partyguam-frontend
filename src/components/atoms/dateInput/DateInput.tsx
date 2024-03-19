'use client';

import 'react-datepicker/dist/react-datepicker.css';

import { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { format, isValid, parse } from 'date-fns';

import type { Props } from '../input';
import Input from '../input';

import CustomHeader from './CustomHeader';

export default function DateInput(props: Props) {
  const [selectDate, setSelectDate] = useState<Date | null>(null);
  const regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (regex.test(value)) {
      const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
      if (isValid(parsedDate)) {
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
    return regex.test(formattedDate) ? 'success' : 'warn';
  }, [selectDate]);

  return (
    <DatePicker
      selected={selectDate}
      dateFormat="yyyy-MM-dd"
      shouldCloseOnSelect
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
    />
  );
}
