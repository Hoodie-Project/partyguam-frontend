import React from 'react';

import GoogleIcon from '@/assets/icon/google-icon.svg';
import { Button, Txt } from '@/components/atoms';

export default function GoogleLogin() {
  return (
    <Button
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
