'use client';
import React from 'react';

import { FloatingMenu } from '@/components/features';
import { MYPAGE_MENU } from '@/constants';
import { SContainer } from '@/styles/components';

function MyApply() {
  return (
    <SContainer>
      <FloatingMenu menu={MYPAGE_MENU()} />
    </SContainer>
  );
}

export default MyApply;
