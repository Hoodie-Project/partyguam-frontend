'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';

import { Button, Txt } from '@/components/_atoms';
import { PageHeader } from '@/components/_molecules';
import { useAuthStore } from '@/stores/auth';
import { SContainer } from '@/styles/components';

export default function JoinSuccess() {
  const router = useRouter();

  const { login, logout } = useAuthStore(state => ({
    login: state.login,
    logout: state.logout,
  }));

  useEffect(() => {
    const accessToken = window.localStorage.getItem('accessToken');
    if (accessToken) {
      login();
    } else {
      logout();
    }
  }, [login, logout]);

  return (
    <SContainer>
      <PageHeader
        title="가입완료"
        hrefLabel="홈으로 가기"
        onClickHref={() => {
          router.push('/');
        }}
      />
      <JoinSuccessWrapper>
        <Txt fontWeight="bold" fontSize={20}>
          가입을 축하합니다!
        </Txt>

        <Txt fontWeight="bold" fontSize={20}>
          세부 프로필을 작성해 볼까요?
        </Txt>
        <Button
          style={{ marginTop: '5.125rem' }}
          height="base"
          width="base"
          backgroudColor="primaryGreen"
          radius="base"
          onClick={() => {
            router.push('/signup/detail?num=1');
          }}
        >
          <Txt fontWeight="bold" fontColor="black">
            작성하러 가기
          </Txt>
        </Button>
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
