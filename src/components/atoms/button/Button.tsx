'use client';

import type { ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import styled from '@emotion/styled';

import Txt from '../txt';

type OwnProps = {
  height: 'base' | 's' | 'm' | 'xs' | 'xxs';
  width: 'base' | 's' | 'm' | 'l';
  color: 'white' | 'primary' | 'disabled' | 'yellow';
  radius: 's' | 'base';
  shadow?: 'none';
  border?: 'none';
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
      shadow,
      border,
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
        border={border}
        shadow={shadow}
        {...buttonAttributes}
      >
        <Txt
          fontSize={18}
          fontWeight={color === 'primary' ? 'bold' : 'normal'}
          color={disabled ? '--grey400' : color === 'white' ? '--grey500' : '--black'}
        >
          {label}
        </Txt>
      </SquareButton>
    );
  },
);

const sizes = {
  base: { width: 'var(--square-button-width-base)', height: 'var(--button-height-base)' },
  l: { width: 'var(--square-button-width-l)' },
  m: { width: 'var(--square-button-width-m)', height: 'var(--button-height-m)' },
  s: { width: 'var(--square-button-width-s)', height: 'var(--button-height-s)' },
  xs: { height: 'var(--button-height-xs)' },
  xxs: { height: 'var(--button-height-xxs)' },
};

const colors = {
  primary: 'var(--primary-green)',
  white: 'var(--white)',
  yellow: 'var(--kakao-btn)',
  disabled: 'var(--green-light200)',
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
    props.border === 'none'
      ? 'transparent'
      : props.disabled
        ? 'var(--green-light200)'
        : props.color === 'white'
          ? 'var(--grey200)'
          : 'var(--primary-green)'};
  border-width: 1px;
  border-style: solid;

  box-shadow: ${props => (props.shadow === 'none' ? 'none' : 'var(--shadow-2)')};
  flex-shrink: 0;
`;

export default Button;
