import type { ReactNode } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';

interface MenuItemType {
  label: string | ReactNode;
  href?: string;
  onClick?: () => void;
}

interface PositionStyle {
  position?: 'absolute' | 'fixed' | 'relative';
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

interface Props {
  isVisible?: boolean;
  menuList: MenuItemType[];
  onToggle?: (visible: boolean) => void;
  positionStyle?: PositionStyle;
  menuItemstyle?: React.CSSProperties;
  dropDownStyle?: React.CSSProperties;
}

export default function DropdownV2({
  isVisible = false,
  menuList,
  onToggle,
  menuItemstyle,
  dropDownStyle,
  positionStyle = {},
}: Props) {
  const [isInternalVisible, setIsInternalVisible] = useState(isVisible);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsInternalVisible(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (!isInternalVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsInternalVisible(false);
        onToggle?.(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isInternalVisible, onToggle]);

  if (!isInternalVisible) return null;

  return (
    <DropdownMenu ref={dropdownRef} style={{ ...dropDownStyle, ...positionStyle }} onClick={e => e.stopPropagation()}>
      <MenuGroup>
        {menuList.map((item, index) => (
          <MenuItem
            style={menuItemstyle}
            key={index}
            onClick={e => {
              e.stopPropagation();
              if (item.onClick) item.onClick();
              setIsInternalVisible(false);
              onToggle?.(false);
            }}
          >
            {item.href ? <a href={item.href}>{item.label}</a> : item.label}
          </MenuItem>
        ))}
      </MenuGroup>
    </DropdownMenu>
  );
}

const DropdownMenu = styled.div`
  position: absolute;
  background-color: white;
  border: 1px solid #11c9a7;
  border-radius: 12px;
  z-index: 9999;
  width: 120px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.04);
`;

const MenuGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const MenuItem = styled.div`
  padding: 11px 20px;
  color: #111;
  cursor: pointer;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: -0.025em;
  text-align: left;

  a {
    color: inherit;
    text-decoration: none;
  }
`;
