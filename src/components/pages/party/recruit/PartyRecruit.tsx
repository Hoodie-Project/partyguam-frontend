'use client';
import React, { useState } from 'react';
import styled from '@emotion/styled';

import { Button, Txt } from '@/components/_atoms';
import { PageHeader, Select } from '@/components/_molecules';
import { SContainer, SFlexColumnFull, SFlexRowFull, SMargin } from '@/styles/components';

function PartyRecruit() {
  const [inputCount, setInputCount] = useState(1);
  return (
    <SContainer>
      <PageHeader title="파티원 모집하기" />
      <PartyRecruitContainer>
        <SFlexColumnFull>
          <SMargin margin="3.125rem 0rem 0rem 0rem" />
          <Txt fontSize={20} fontWeight="bold">
            모집 인원
          </Txt>
          <SMargin margin="0rem 0rem .25rem 0rem" />
          <Txt fontSize={16} style={{ marginBottom: 20 }}>
            포지션과 인원을 입력해 주세요.
          </Txt>
          <SFlexColumnFull style={{ gap: 20 }}>
            {[...Array(inputCount)].map((_, i) => (
              <SFlexRowFull key={i} style={{ justifyContent: 'space-between', gap: '20px' }}>
                <Select placeholder="직군" height="l" onClick={() => {}} />
                <Select placeholder="직무" height="l" onClick={() => {}} />
                <Select placeholder="인원수" height="l" onClick={() => {}} />
              </SFlexRowFull>
            ))}
          </SFlexColumnFull>
          <AddButton onClick={() => setInputCount(inputCount + 1)}>+</AddButton>
          <SMargin margin="1.25rem 0rem 0rem 0rem" />
        </SFlexColumnFull>
        <SFlexRowFull style={{ justifyContent: 'space-between' }}>
          <Button
            style={{ marginBottom: 60 }}
            height="l"
            width="base"
            backgroudColor="grey100"
            radius="base"
            shadow="shadow1"
            borderColor="grey200"
            onClick={() => {}}
          >
            <Txt fontWeight="bold" fontColor="grey400">
              취소
            </Txt>
          </Button>
          <Button
            style={{ marginBottom: 60 }}
            disabled={true}
            height="l"
            width="base"
            backgroudColor="primaryGreen"
            radius="base"
            shadow="shadow1"
            onClick={() => {}}
          >
            <Txt fontWeight="bold" fontColor={true ? 'grey400' : 'black'}>
              모집하기
            </Txt>
          </Button>
        </SFlexRowFull>
      </PartyRecruitContainer>
    </SContainer>
  );
}

export default PartyRecruit;

const PartyRecruitContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 820px;
  height: auto;
  margin-top: calc(50px + 56px);
`;

const AddButton = styled.button`
  width: 100%;
  height: 3.5rem;
  background-color: white;
  border: 1px solid #e5e5ec;
  border-radius: 16px;
  box-shadow: 0px 2px 6px -1px rgba(17, 17, 17, 0.08);
  margin-top: 20px;
`;
