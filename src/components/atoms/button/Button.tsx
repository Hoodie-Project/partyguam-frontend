'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import styled from '@emotion/styled';

import { button, palette, radius, shadow } from '@/styles';

type OwnProps = {
  height: keyof typeof button.height;
  width: keyof typeof button.width;
  backgroudColor: keyof typeof palette;
  radius: keyof typeof radius;
  shadow?: keyof typeof shadow;
  borderColor?: keyof typeof palette;
  children?: ReactNode;
};

export type Props = Partial<OwnProps> & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>;

const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      height = 'base',
      width = 'base',
      backgroudColor = 'primaryGreen',
      radius = 'base',
      shadow,
      borderColor,
      children,
      disabled,
      ...buttonAttributes
    },
    ref,
  ) => {
    return (
      <SquareButton
        height={height}
        width={width}
        backgroudColor={backgroudColor}
        radius={radius}
        disabled={disabled}
        ref={ref}
        borderColor={borderColor}
        shadow={shadow}
        {...buttonAttributes}
      >
        {children}
      </SquareButton>
    );
  },
);

const SquareButton = styled.button<Props>`
  width: ${props => button.width[props.width || 'base']};
  height: ${props => button.height[props.height || 'base']};

  background-color: ${props =>
    props.disabled ? palette.greenLight400 : palette[props.backgroudColor || 'transparent']};

  border-radius: ${props => radius[props.radius || 'base']};
  border-color: ${props =>
    props.disabled ? palette.greenLight200 : props.borderColor ? palette[props.borderColor] : 'transparent'};

  border-width: 1px;
  border-style: solid;

  box-shadow: ${props => (props.shadow ? shadow[props.shadow] : 'none')};
  flex-shrink: 0;
`;

export default Button;
