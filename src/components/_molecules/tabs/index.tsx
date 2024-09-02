'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';
import styled from '@emotion/styled';

type TabsProps = {
  children: ReactNode;
  defaultIndex?: number;
};

type TabListProps = {
  children: ReactNode;
};

type TabProps = {
  children: ReactNode;
  index: number;
  width?: string;
};

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

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

function Tabs({ children, defaultIndex = 0 }: TabsProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex);

  return (
    <TabsContext.Provider value={{ selectedIndex, setSelectedIndex }}>
      <TabsContainer>{children}</TabsContainer>
    </TabsContext.Provider>
  );
}

function TabList({ children }: TabListProps) {
  return <TabListContainer>{children}</TabListContainer>;
}

function Tab({ children, index }: TabProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tab must be used within a Tabs component');
  }

  const { selectedIndex, setSelectedIndex } = context;
  const isActive = selectedIndex === index;

  return (
    <TabButton isActive={isActive} onClick={() => setSelectedIndex(index)} role="tab" aria-selected={isActive}>
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

const TabListContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 20px;
  border-bottom: 1px solid #e5e5ec;
`;

const TabButton = styled.button<{ isActive: boolean; width?: string }>`
  width: ${({ width }) => (width ? `${width}` : '85px')};
  cursor: pointer;
  background: none;
  border: none;
  padding: 20px 0px;
  font-size: 20px;
  font-weight: ${({ isActive }) => (isActive ? 600 : 500)};
  color: ${({ isActive }) => (isActive ? '#000' : '#666')};
  border-bottom: ${({ isActive }) => (isActive ? '3px solid #21ECC7' : '3px solid transparent')};

  &:hover {
    color: #000;
  }
`;

const TabPanelContainer = styled.div`
  padding: 10px;
`;

Tabs.TabList = TabList;
Tabs.Tab = Tab;
Tabs.TabPanels = TabPanels;
Tabs.TabPanel = TabPanel;

export default Tabs;
