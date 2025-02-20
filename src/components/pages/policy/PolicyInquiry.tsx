'use client';
import React from 'react';

import { PolicyLayout, SContainer, SemiTItle, SMargin, Text } from '@/styles/components';

import PolicyNav from './PolicyNav';

function PolicyInquiry() {
  return (
    <SContainer>
      <PolicyLayout>
        <PolicyNav />
        <SemiTItle>궁금하신 부분이나, 건의하실 내용은 언제든 아래로 문의해 주세요.</SemiTItle>
        <SMargin margin="20px 0px 0px 0px" />
        <SemiTItle>이메일</SemiTItle>
        <SMargin margin="4px 0px 0px 0px" />
        <Text>hoodiev.team@gmail.com</Text>
      </PolicyLayout>
    </SContainer>
  );
}

export default PolicyInquiry;
