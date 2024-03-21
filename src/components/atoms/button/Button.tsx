'use client';

import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import styled from '@emotion/styled';

import Txt from '../txt';

type OwnProps = {
  height: 'base' | 's' | 'm' | 'xs' | 'xxs';
  width: 'base' | 's';
  color: 'white' | 'primary';
  radius: 's' | 'base';
  label?: string;
};

export type Props = Partial<OwnProps> & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      height = 'base',
      width = 'base',
      color = 'primary',
      radius = 'base',
      label = 'default label',
      disabled,
      ...buttonAttributes
    },
    ref,
  ) => {
    return (
      <SquareButton
        height={height}
        width={width}
        color={color}
        radius={radius}
        disabled={disabled}
        ref={ref}
        {...buttonAttributes}
      >
        <Txt
          fontSize={18}
          fontWeight={color === 'primary' ? 'bold' : 'normal'}
          color={disabled ? 'var(--grey400)' : color === 'white' ? 'var(--grey500)' : 'var(--black)'}
        >
          {label}
        </Txt>
      </SquareButton>
    );
  },
);

const sizes = {
  base: { width: 'var(--square-button-width-base)', height: 'var(--button-height-base)' },
  m: { width: 'var(--square-button-width-m)', height: 'var(--button-height-m)' },
  s: { width: 'var(--square-button-width-s)', height: 'var(--button-height-s)' },
  xs: { height: 'var(--button-height-xs)' },
  xxs: { height: 'var(--button-height-xxs)' },
};

const colors = {
  primary: 'var(--primary-green)',
  white: 'var(--white)',
};

const radius = {
  base: 'var(--radius-base)',
  s: 'var(--radius-s)',
};

const SquareButton = styled.button<Props>`
  width: ${props => sizes[props.width || 'base'].width};
  height: ${props => sizes[props.height || 'base'].height};
  background-color: ${props => (props.disabled ? 'var(--green-light400)' : colors[props.color || 'primary'])};

  border-radius: ${props => radius[props.radius || 'base']};
  border-color: ${props =>
    props.disabled ? 'var(--green-light200)' : props.color === 'white' ? 'var(--grey200)' : 'var(--primary-green)'};
  border-width: 1px;
  border-style: solid;

  box-shadow: var(--shadow-1);
`;

export default Button;
