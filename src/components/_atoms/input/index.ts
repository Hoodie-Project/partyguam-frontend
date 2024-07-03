'use client';
import { MemoizedInput as InputComponent } from './Input';
import TextArea from './TextArea';

const Input = Object.assign(InputComponent, {
  TextArea,
});

export default Input;

export * from './Input';
