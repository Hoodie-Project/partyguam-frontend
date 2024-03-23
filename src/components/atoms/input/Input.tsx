'use client';

import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import styled from '@emotion/styled';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

import { svgSizeMap } from '@/utils/svg';

type OwnProps = {
  height: 'base' | 's' | 'xs' | 'xxs';
  radius: 'base' | 's';
  padding: 'base' | 's' | 'xs';
  inputState: 'warn' | 'success' | 'default';
  placeholder: string;
  value: string;
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
      padding = 'base',
      inputState = 'default',
      bottomMessage,
      placeholder,
      disabled,
      ...inputAttributes
    },
    ref,
  ) => {
    return (
      <InputWrapper>
        <InputContainer height={height} padding={padding} radius={radius} inputState={inputState} disabled={disabled}>
          <TextInput ref={ref} value={value} placeholder={placeholder} disabled={disabled} {...inputAttributes} />
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

const height = {
  base: 'var(--button-height-m)',
  s: 'var(--button-height-s)',
  xs: 'var(--button-height-xs)',
  xxs: 'var(--button-height-xxs)',
};

const padding = {
  base: 'var(--padding-horizontal-base)',
  s: 'var(--padding-horizontal-s)',
  xs: 'var(--padding-horizontal-xs)',
};

const inputState = {
  success: 'var(--green-dark100)',
  warn: 'var(--fail-red)',
  default: 'var(--grey200)',
};

const radius = {
  base: 'var(--radius-base)',
  s: 'var(--radius-s)',
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
  height: ${props => height[props.height || 'base']};
  padding: ${props => padding[props.padding || 'base']};
  border-radius: ${props => radius[props.radius || 'base']};
  border-color: ${props => inputState[props.inputState || 'default']};
  background-color: ${props => props.disabled && 'var(--grey100)'};
  border-width: 1px;
  border-style: solid;
  box-shadow: var(--shadow-2);
`;

const TextInput = styled.input<Props>`
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  background-color: ${props => props.disabled && 'var(--grey100)'};
`;

const Message = styled.div<Props>`
  color: ${props => inputState[props.inputState || 'success']};
  margin: ${props => (props.inputState ? '8px 0 0 20px' : '0 0 0 20px')};
  font-size: 14px;
`;

export default Input;
