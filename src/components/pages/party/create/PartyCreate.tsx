'use client';
import React, { useState } from 'react';
import styled from '@emotion/styled';

import { Balloon, Input, Square, Txt } from '@/components/_atoms';
import { PageHeader } from '@/components/_molecules';
import { SContainer, SFlexColumnFull, SFlexRowFull } from '@/styles/components';

export default function PartyCreate() {
  const [isVisibleBalloon, setIsVisibleBalloon] = useState(true);

  return (
    <SContainer>
      <PageHeader title="파티 생성하기" />
      <PartyCreateContainer>
        <Square width="390px" height="293px" radiusKey="base" backgroundColor="grey300" shadowKey="none"></Square>
        {isVisibleBalloon && (
          <Balloon
            width="163px"
            height="30px"
            onClose={() => {
              setIsVisibleBalloon(false);
            }}
            style={{
              marginTop: '20px',
            }}
          >
            <Txt fontSize={14} fontColor="white">
              <Txt fontSize={14} fontColor="primaryGreen">
                4:3 비율
              </Txt>
              이 가장 예뻐요
            </Txt>
          </Balloon>
        )}
        <SFlexRowFull style={{ gap: 20, marginTop: 54 }}>
          <SFlexColumnFull>
            <Txt fontSize={20} fontWeight="bold" style={{ marginBottom: 4 }}>
              파티명
            </Txt>
            <Txt fontSize={16} style={{ marginBottom: 20 }}>
              직관적인 파티명을 사용하시면 조회 수가 올라가요.
            </Txt>
            <Input placeholder="15자 이내로 입력해 주세요" shadow="shadow1" />
          </SFlexColumnFull>
          <SFlexColumnFull>
            <Txt fontSize={20} fontWeight="bold" style={{ marginBottom: 4 }}>
              파티 유형
            </Txt>
            <Txt fontSize={16} style={{ marginBottom: 20 }}>
              파티가 목표로 하는 유형을 선택해 주세요.
            </Txt>
            <Input placeholder="미정" shadow="shadow1" />
          </SFlexColumnFull>
        </SFlexRowFull>
        <SFlexColumnFull style={{ marginTop: 120 }}>
          <Txt fontSize={20} fontWeight="bold" style={{ marginBottom: 4 }}>
            파티 소개 글
          </Txt>
          <Txt fontSize={16} style={{ marginBottom: 20 }}>
            파티의 방향성, 참고사항 등을 자유롭게 적어 주세요.
          </Txt>
        </SFlexColumnFull>
      </PartyCreateContainer>
    </SContainer>
  );
}

const PartyCreateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 51.25rem;
  height: 100vh;
  margin-top: calc(3.125rem + 3.5rem);
`;
