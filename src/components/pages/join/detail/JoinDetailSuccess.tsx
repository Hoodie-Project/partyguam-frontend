'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';

import { Button, Txt } from '@/components/_atoms';
import { SContainer } from '@/styles/components/common';

export default function JoinDetailSuccess() {
  const router = useRouter();

  return (
    <SContainer>
      <JoinSuccessWrapper>
        <Txt fontWeight="bold" fontSize={20}>
          세부 프로필 입력이 완료되었어요!
        </Txt>
        <Txt fontWeight="bold" fontSize={20}>
          파티에 참여해 볼까요?
        </Txt>
        <ButtonWrapper>
          <Button
            style={{ marginTop: '5.125rem' }}
            height="l"
            width="xl"
            backgroudColor="white"
            radius="base"
            borderColor="primaryGreen"
            shadow="shadow2"
          >
            <Txt fontWeight="bold" fontColor="black">
              프로필로 이동
            </Txt>
          </Button>
          <Button
            style={{ marginTop: '5.125rem' }}
            height="l"
            width="xl"
            backgroudColor="primaryGreen"
            radius="base"
            shadow="shadow2"
            onClick={() => {
              router.push('/');
            }}
          >
            <Txt fontWeight="bold" fontColor="black">
              확인
            </Txt>
          </Button>
        </ButtonWrapper>
      </JoinSuccessWrapper>
    </SContainer>
  );
}

const JoinSuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 19.1875rem 0rem 27.9375rem 0rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;
