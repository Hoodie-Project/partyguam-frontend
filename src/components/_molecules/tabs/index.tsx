'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';
import styled from '@emotion/styled';

type TabsProps = {
  children: ReactNode;
  defaultIndex?: number;
  style?: React.CSSProperties;
};

type TabListProps = {
  children: ReactNode;
  borderNone?: boolean;
};

type TabProps = {
  children: ReactNode;
  index: number;
  width?: string;
  padding?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  handleClick?: () => void;
} & HTMLAttributes<HTMLButtonElement>;

type TabPanelsProps = {
  children: ReactNode;
};

type TabPanelProps = {
  children: ReactNode;
  index: number;
};

interface TabsContextProps {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

export const TabsContext = createContext<TabsContextProps | undefined>(undefined);

function Tabs({ children, defaultIndex = 0, style }: TabsProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex);

  return (
    <TabsContext.Provider value={{ selectedIndex, setSelectedIndex }}>
      <TabsContainer style={style}>{children}</TabsContainer>
    </TabsContext.Provider>
  );
}

function TabList({ children, borderNone }: TabListProps) {
  return <TabListContainer borderNone={borderNone}>{children}</TabListContainer>;
}

function Tab({ children, index, width, padding, handleClick, ...tabsAttributes }: TabProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab must be used within a Tabs component');
  }

  const { selectedIndex, setSelectedIndex } = context;
  const isActive = selectedIndex === index;

  return (
    <TabButton
      isActive={isActive}
      width={width}
      padding={padding}
      onClick={() => {
        if (handleClick) {
          handleClick();
        }
        setSelectedIndex(index);
      }}
      role="tab"
      aria-selected={isActive}
      {...tabsAttributes}
    >
      {children}
    </TabButton>
  );
}

function TabPanels({ children }: TabPanelsProps) {
  return <div>{children}</div>;
}

function TabPanel({ children, index }: TabPanelProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabPanel must be used within a Tabs component');
  }

  const { selectedIndex } = context;
  return selectedIndex === index ? <TabPanelContainer>{children}</TabPanelContainer> : null;
}

const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TabListContainer = styled.div<{ borderNone?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 20px;
  border-bottom: ${({ borderNone }) => (borderNone ? 'none' : '1px solid #e5e5ec')};
`;

const TabButton = styled.button<{
  isActive: boolean;
  width?: string;
  padding?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
}>`
  width: ${({ width }) => (width ? `${width}` : '85px')};
  cursor: pointer;
  background: none;
  border: none;
  font-size: 20px;
  font-weight: ${({ isActive }) => (isActive ? 600 : 500)};
  color: ${({ isActive }) => (isActive ? '#000' : '#999999')};
  border-bottom: ${({ isActive }) => (isActive ? '3px solid #21ECC7' : '3px solid transparent')};

  padding: ${({ padding }) =>
    padding
      ? `${padding.top || '20px'} ${padding.right || '0px'} ${padding.bottom || '20px'} ${padding.left || '0px'}`
      : '20px 0px'};

  &:hover {
    color: #000;
  }
`;

const TabPanelContainer = styled.div`
  padding: 5px;
`;

Tabs.TabList = TabList;
Tabs.Tab = Tab;
Tabs.TabPanels = TabPanels;
Tabs.TabPanel = TabPanel;

export default Tabs;
