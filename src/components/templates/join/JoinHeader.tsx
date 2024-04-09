import React from 'react';
import styled from '@emotion/styled';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

import { Txt } from '@/components/atoms';
import { palette } from '@/styles';

type Props = {
  title: string;
  hrefLabel: string;
  onClickHref: () => void;
  onClickJump: () => void;
};

export default function JoinHeader({ onClickHref, hrefLabel, title }: Partial<Props>) {
  return (
    <JoinHeaderContainer>
      <GoBackBtn onClick={onClickHref}>
        <ArrowBackIosNewRoundedIcon />
        <Txt fontColor="grey500" fontWeight="bold" style={{ marginTop: '2px', marginLeft: '10px' }}>
          {hrefLabel}
        </Txt>
      </GoBackBtn>
      <Txt fontSize={20} fontWeight="bold" style={{ textAlign: 'center' }}>
        {title}
      </Txt>
    </JoinHeaderContainer>
  );
}

const JoinHeaderContainer = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  place-items: center;
  width: 100%;
  height: 3.5rem;
  padding: 0.875rem 0px;
  justify-items: stretch;
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
