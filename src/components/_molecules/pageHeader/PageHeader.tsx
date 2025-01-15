'use client';
import React from 'react';
import styled from '@emotion/styled';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

import { Txt } from '@/components/_atoms';
import { palette } from '@/styles';

type Props = {
  title: string | JSX.Element;
  titleIcon?: JSX.Element; // 제목 옆 아이콘
  headerTooltip?: JSX.Element; // 아이콘에 달리는 툴팁
  hrefLabel: string;
  onClickTitleIcon?: () => void;
  onClickHref: () => void;
  onClickIcon: () => void;
  icon: JSX.Element;
};

export default function PageHeader({
  hrefLabel,
  title,
  titleIcon,
  headerTooltip,
  icon,
  onClickTitleIcon,
  onClickIcon,
  onClickHref,
}: Partial<Props>) {
  return (
    <PageHeaderContainer>
      <GoBackBtn onClick={onClickHref}>
        {hrefLabel && <ArrowBackIosNewRoundedIcon />}
        <Txt fontColor="grey500" fontWeight="bold" style={{ marginLeft: '10px' }}>
          {hrefLabel}
        </Txt>
      </GoBackBtn>
      <PageTitleContainer>
        {typeof title === 'string' ? (
          <Txt fontSize={20} fontWeight="bold">
            {title}
          </Txt>
        ) : (
          title
        )}
        {titleIcon && <IconContainer onClick={onClickTitleIcon}>{titleIcon}</IconContainer>}
        {headerTooltip}
      </PageTitleContainer>
      {icon && <IconContainer onClick={onClickIcon}>{icon}</IconContainer>}
    </PageHeaderContainer>
  );
}

const PageHeaderContainer = styled.section`
  display: grid;
  position: fixed;
  background-color: white;
  grid-template-columns: 1fr auto 1fr; /* 가운데 정렬을 위한 설정 */
  place-items: center;
  width: 100%;
  max-width: 77.75rem;
  height: 3.5rem;
  padding: 0.875rem 0px;
  justify-items: stretch;
  z-index: 1;
`;

const PageTitleContainer = styled.div`
  position: relative;
  margin: auto; /* 항상 가운데 위치 */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const GoBackBtn = styled.button`
  display: flex;
  justify-items: center;
  align-items: center;
  gap: 10px; /* 수정: 단위 추가 */
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
