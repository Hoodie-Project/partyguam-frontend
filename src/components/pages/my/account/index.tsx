'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';

import { fetchGetUsersMeOauth } from '@/apis/auth';
import GoogleIcon from '@/assets/icon/google-icon.svg';
import KakaoIcon from '@/assets/icon/kakao-icon.svg';
import { Square, Txt } from '@/components/_atoms';
import { PageHeader } from '@/components/_molecules';
import { FloatingMenu } from '@/components/features';
import { MYPAGE_MENU } from '@/constants';
import { SContainer, SFlexColumn } from '@/styles/components';

function MyAccount() {
  const [isKakaoConnected, setIsKakaoConnected] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchGetUsersMeOauth();
        if (res.includes('kakao')) setIsKakaoConnected(true);
        if (res.includes('google')) setIsGoogleConnected(true);
      } catch (err) {
        console.log('fetchGetUsersMeOauth >> ', err);
      }
    })();
  }, []);

  const handleClickConnect = (isConnected: boolean) => {};

  return (
    <SContainer>
      <FloatingMenu menu={MYPAGE_MENU()} />
      <PageHeader title="계정 설정" />
      <MyAccountContainer>
        <Txt fontSize={24} fontWeight="bold">
          소셜 로그인 관리
        </Txt>
        <SquareWrapper>
          <Square
            width="100%"
            height="auto"
            shadowKey="shadow2"
            backgroundColor="white"
            radiusKey="base"
            style={{
              padding: '30px 24px',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <SFlexColumn>
              <AccountLabel>
                <KakaoIcon />
                <Txt fontSize={16} fontWeight="semibold">
                  카카오톡 계정
                </Txt>
              </AccountLabel>
              <Txt fontSize={14} fontColor="grey500" style={{ marginLeft: '28px' }}>
                유저이메일
              </Txt>
            </SFlexColumn>
            <CircleButton
              isConnected={isKakaoConnected}
              onClick={() => handleClickConnect(isKakaoConnected)}
              disabled={isKakaoConnected}
            >
              <Txt fontSize={14} fontColor="black" fontWeight="semibold">
                {isKakaoConnected ? '연결중' : '연결하기'}
              </Txt>
            </CircleButton>
          </Square>
          <Square
            width="100%"
            height="auto"
            shadowKey="shadow2"
            backgroundColor="white"
            radiusKey="base"
            style={{ padding: '30px 24px', display: 'flex', justifyContent: 'space-between' }}
          >
            <SFlexColumn>
              <AccountLabel>
                <GoogleIcon />
                <Txt fontSize={16} fontWeight="semibold">
                  구글 계정
                </Txt>
              </AccountLabel>
              <Txt fontSize={14} fontColor="grey500" style={{ marginLeft: '28px' }}>
                유저이메일
              </Txt>
            </SFlexColumn>
            <CircleButton
              isConnected={isGoogleConnected}
              onClick={() => handleClickConnect(isGoogleConnected)}
              disabled={isGoogleConnected}
            >
              <Txt fontSize={14} fontColor="black" fontWeight="semibold">
                {isGoogleConnected ? '연결중' : '연결하기'}
              </Txt>
            </CircleButton>
          </Square>
        </SquareWrapper>
        <ButtonWrapper>
          <TxtButton fontSize={16} fontWeight="semibold">
            로그아웃
          </TxtButton>
          <TxtButton
            fontSize={16}
            fontColor="failRed"
            fontWeight="semibold"
            onClick={() => router.push('/my/account-delete')}
          >
            회원탈퇴
          </TxtButton>
        </ButtonWrapper>
      </MyAccountContainer>
    </SContainer>
  );
}

export default MyAccount;

const MyAccountContainer = styled.div`
  width: 550px;
  height: 100vh;
  margin-top: 112px;
`;

const CircleButton = styled.button<{ isConnected?: boolean }>`
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ isConnected }) => (isConnected ? '#ffffff' : '#21ECC7')};
  border: 1px solid #21ecc7;
  border-radius: 999px;
  padding: 8px 0px;
  color: #111111;
  box-shadow: 0px 2px 6px -1px rgba(17, 17, 17, 0.08);
`;

const AccountLabel = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const SquareWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 22px;
  margin-bottom: 60px;
  gap: 12px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
`;

const TxtButton = styled(Txt)`
  cursor: pointer;
`;
