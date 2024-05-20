import React from 'react';
import { useRouter } from 'next/navigation';

import KakaoIcon from '@/assets/icon/kakao-icon.svg';
import { Button, Txt } from '@/components/atoms';

export default function KaKaoLogin() {
  const { push } = useRouter();

  const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
  const handleKakaoLogin = () => {
    const kakaoAuthUrl = isDev
      ? `${process.env.NEXT_PUBLIC_API_DEV_HOST}/users/kakao/login`
      : `${process.env.NEXT_PUBLIC_API_HOST}/users/kakao/login`;
    push(kakaoAuthUrl);
  };

  return (
    <Button
      onClick={handleKakaoLogin}
      width="l"
      height="s"
      backgroudColor="kakaoBtn"
      shadow="none"
      borderColor="transparent"
      style={{ display: 'flex', alignItems: 'center', textAlign: 'left', paddingLeft: '32px' }}
    >
      <KakaoIcon />
      <Txt fontSize={14} fontWeight="bold" style={{ marginLeft: '12px' }}>
        카카오톡 로그인
      </Txt>
    </Button>
  );
}
