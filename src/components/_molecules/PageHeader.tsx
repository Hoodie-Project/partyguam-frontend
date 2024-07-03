'use client';
import React from 'react';
import styled from '@emotion/styled';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

import { Txt } from '@/components/_atoms';
import { palette } from '@/styles';

type Props = {
  title: string;
  hrefLabel: string;
  onClickHref: () => void;
  onClickIcon: () => void;
  icon: JSX.Element;
};
export default function PageHeader({ onClickHref, hrefLabel, title, icon, onClickIcon }: Partial<Props>) {
  return (
    <PageHeaderContainer>
      <GoBackBtn onClick={onClickHref}>
        {hrefLabel && <ArrowBackIosNewRoundedIcon />}
        <Txt fontColor="grey500" fontWeight="bold" style={{ marginTop: '2px', marginLeft: '10px' }}>
          {hrefLabel}
        </Txt>
      </GoBackBtn>
      <Txt fontSize={20} fontWeight="bold" style={{ textAlign: 'center' }}>
        {title}
      </Txt>
      {icon && <IconContainer onClick={onClickIcon}>{icon}</IconContainer>}
    </PageHeaderContainer>
  );
}

const PageHeaderContainer = styled.section`
  display: grid;
  position: fixed;
  background-color: white;
  grid-template-columns: 1fr 1fr 1fr;
  place-items: center;
  width: 100%;
  max-width: 77.75rem;
  height: 3.5rem;
  padding: 0.875rem 0px;
  justify-items: stretch;
  z-index: 1;
`;

const GoBackBtn = styled.button`
  display: flex;
  justify-items: center;
  align-items: center;
  gap: 10;
  background-color: transparent;
  font-weight: bold;
  font-size: 18px;
  color: ${palette.grey500};
`;

const IconContainer = styled.button`
  width: 26px;
  height: 26px;
  display: flex;
  justify-self: flex-end;
  align-items: center;
  background-color: transparent;
  cursor: pointer;
  color: ${palette.grey500};
`;
