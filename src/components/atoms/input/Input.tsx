'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import XCircle from '@/assets/icon/x-circle.svg';
import styled from '@emotion/styled';
import { svgSizeMap } from '@/utils/svg';

type OwnProps = {
  height: 'base' | 's' | 'xs' | 'xxs';
  radius: 'base' | 's';
  padding: 'base' | 's' | 'xs';
  inputState: 'warn' | 'success' | 'default';

  value: string;
  bottomMessage: string;
  onClear: () => void;
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
      <>
        <InputContainer>
          <TextInput
            ref={ref}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            inputState={inputState}
            height={height}
            padding={padding}
            radius={radius}
            {...inputAttributes}
          />
          {value && (
            <XCircle
              onClick={onClear}
              width={svgSizeMap['s'].size}
              height={svgSizeMap['s'].size}
              stroke-width={svgSizeMap['s'].strokeWidth}
            />
          )}
        </InputContainer>
        {inputState && <Message inputState={inputState}>{bottomMessage}</Message>}
      </>
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

const InputContainer = styled.div<Props>`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: ${props => height[props.height || 'base']};
  padding: ${props => padding[props.padding || 'base']};
  border-radius: ${props => radius[props.radius || 'base']};
  border-color: ${props => inputState[props.inputState || 'default']};
  border-width: 1px;
  border-style: solid;
  box-shadow: var(--shadow-1);
`;

const TextInput = styled.input<Props>`
  width: 100%;
  font-size: 16px;
  font-weight: bold;
`;

const Message = styled.div<Props>`
  color: ${props => inputState[props.inputState || 'success']};
  margin: 8px 0 0 20px;
  font-size: 14px;
`;

export default Input;
