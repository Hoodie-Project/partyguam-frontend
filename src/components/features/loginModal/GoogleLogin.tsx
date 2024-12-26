import React from 'react';
import { useRouter } from 'next/navigation';

import GoogleIcon from '@/assets/icon/google-icon.svg';
import { Button, Txt } from '@/components/_atoms';

const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
const BASE_URL = isDev ? process.env.NEXT_PUBLIC_API_DEV_HOST : process.env.NEXT_PUBLIC_API_HOST;

export default function GoogleLogin() {
  const { push } = useRouter();

  const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
  const handleGoogleLogin = () => {
    const googleAuthUrl = isDev
      ? `${process.env.NEXT_PUBLIC_API_DEV_HOST}/users/google/login`
      : `${process.env.NEXT_PUBLIC_API_HOST}/users/google/login`;
    push(googleAuthUrl);
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      width="l"
      height="s"
      backgroudColor="white"
      shadow="none"
      borderColor="grey200"
      style={{ display: 'flex', alignItems: 'center', textAlign: 'left', paddingLeft: '32px' }}
    >
      <GoogleIcon />
      <Txt fontSize={14} fontWeight="bold" style={{ marginLeft: '12px' }}>
        구글 로그인
      </Txt>
    </Button>
  );
}
