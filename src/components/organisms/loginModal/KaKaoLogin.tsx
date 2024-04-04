import React from 'react';

import KakaoIcon from '@/assets/icon/kakao-icon.svg';
import { Button, Txt } from '@/components/atoms';

export default function KaKaoLogin() {
  return (
    <Button
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
