'use client';

import type { TextareaHTMLAttributes } from 'react';
import { forwardRef, useState } from 'react';
import styled from '@emotion/styled';

import { padding, palette, radius, shadow } from '@/styles';

import Txt from '../txt';

type OwnProps = {
  height: string;
  radius: keyof typeof radius;
  padding: keyof typeof padding;
  inputState: 'warn' | 'success' | 'default';
  placeholder: string;
  shadow: keyof typeof shadow;
  borderColor?: keyof typeof palette;
  value: string;
  maxCount: number;
  clearAll: boolean;
  bottomMessage: string;
  onClear: (value: any) => void;
};

export type Props = Partial<OwnProps> & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'type' | 'size'>;

const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      value,
      onClear,
      height = 'base',
      radius = 'base',
      padding = 'horizontalBase',
      inputState = 'default',
      shadow,
      borderColor,
      bottomMessage,
      placeholder,
      maxCount,
      clearAll = true,
      disabled,
      ...textareaAttributes
    },
    ref,
  ) => {
    const [isInputClicked, setIsInputClicked] = useState<boolean>(false);

    return (
      <InputWrapper>
        <InputContainer
          height={height}
          padding={padding}
          radius={radius}
          shadow={shadow}
          borderColor={borderColor}
          inputState={inputState}
          disabled={disabled}
        >
          <STextArea
            ref={ref}
            value={value}
            onFocus={() => setIsInputClicked(true)}
            onBlur={() => setIsInputClicked(false)}
            placeholder={isInputClicked ? '' : placeholder || undefined}
            disabled={disabled}
            {...textareaAttributes}
          />
          {maxCount && (
            <Txt
              fontWeight="normal"
              fontColor="grey400"
              fontSize={14}
              style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}
            >
              {value?.length} / {maxCount}
            </Txt>
          )}
        </InputContainer>
        {clearAll && <ClearButton onClick={() => onClear && onClear(value)}>전체 삭제</ClearButton>}
        {inputState && <Message inputState={inputState}>{bottomMessage}</Message>}
      </InputWrapper>
    );
  },
);

const inputState = {
  success: palette.greenDark100,
  warn: palette.failRed,
  default: palette.grey200,
};

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div<Props>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: ${props => props.height};
  padding: ${props => padding[props.padding || 'horizontalBase']};
  border-radius: ${props => radius[props.radius || 'base']};
  border-color: ${props =>
    props.inputState ? inputState[props.inputState] : props.borderColor ? palette[props.borderColor] : 'transparent'};
  background-color: ${props => props.disabled && palette.grey100};
  border-width: 1px;
  border-style: solid;
  box-shadow: ${props => (props.shadow ? shadow[props.shadow] : 'none')};
`;

const STextArea = styled.textarea<Props>`
  width: 100%;
  border: none;
  outline: none;
  height: 100%;
  font-size: 16px;
  font-weight: normal;
  background-color: ${props => props.disabled && palette.grey100};
  resize: none;
  white-space: pre-wrap;
  ::placeholder {
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }
`;

const ClearButton = styled.div`
  text-align: right;
  margin-top: 5px;
  margin-right: 15px;
  color: ${palette.grey400};
  font-size: 14px;
  cursor: pointer;
`;

const Message = styled.div<Props>`
  color: ${props => inputState[props.inputState || 'success']};
  margin: ${props => (props.inputState ? '8px 0 0 20px' : '0 0 0 20px')};
  font-size: 14px;
`;

export default TextArea;
