import React from 'react';
import { useRouter } from 'next/navigation';

import KakaoIcon from '@/assets/icon/kakao-icon.svg';
import { Button, Txt } from '@/components/atoms';

export default function KaKaoLogin() {
  const { push } = useRouter();
  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_LOCAL_REDIRECT_URL}&response_type=code&nonce=${process.env.NEXT_PUBLIC_KAKAO_NONCE}`;
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
