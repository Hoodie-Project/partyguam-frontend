'use client';

import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import styled from '@emotion/styled';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { padding, palette, radius, shadow, size } from '@/styles';
import { svgSizeMap } from '@/utils/svg';

import Txt from '../txt';

type OwnProps = {
  height: keyof typeof size.height;
  radius: keyof typeof radius;
  padding: keyof typeof padding;
  inputState: 'warn' | 'success' | 'default';
  placeholder: string;
  shadow: keyof typeof shadow;
  borderColor?: keyof typeof palette;
  value: string;
  maxCount: number;
  bottomMessage: string;
  onClear: (value: any) => void;
};

export type Props = Partial<OwnProps> & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>;

const Input = forwardRef<HTMLInputElement, Props>(
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
      disabled,
      ...inputAttributes
    },
    ref,
  ) => {
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
          <TextInput ref={ref} value={value} placeholder={placeholder} disabled={disabled} {...inputAttributes} />
          {value && maxCount && (
            <Txt
              fontWeight="normal"
              fontColor="grey400"
              fontSize={14}
              style={{ display: 'inline-block', width: '60px', marginLeft: '16px' }}
            >
              {value?.length} / {maxCount}
            </Txt>
          )}
          {value && (
            <CancelOutlinedIcon
              onClick={onClear}
              sx={{
                width: `${svgSizeMap['s'].size}`,
                strokeWidth: `${svgSizeMap['s'].strokeWidth}`,
                cursor: 'pointer',
              }}
            />
          )}
        </InputContainer>
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
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: ${props => size.height[props.height || 'base']};
  padding: ${props => padding[props.padding || 'horizontalBase']};
  border-radius: ${props => radius[props.radius || 'base']};
  border-color: ${props =>
    props.inputState ? inputState[props.inputState] : props.borderColor ? palette[props.borderColor] : 'transparent'};
  background-color: ${props => props.disabled && palette.grey100};
  border-width: 1px;
  border-style: solid;
  box-shadow: ${props => (props.shadow ? shadow[props.shadow] : 'none')};
`;

const TextInput = styled.input<Props>`
  width: 100%;
  font-size: 16px;
  font-weight: normal;
  background-color: ${props => props.disabled && palette.grey100};
`;

const Message = styled.div<Props>`
  color: ${props => inputState[props.inputState || 'success']};
  margin: ${props => (props.inputState ? '8px 0 0 20px' : '0 0 0 20px')};
  font-size: 14px;
`;

export default Input;
