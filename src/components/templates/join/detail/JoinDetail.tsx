'use client';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { SContainer } from '@/styles/components/join';

import JoinHeader from '../JoinHeader';

export default function JoinDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const detailNum = searchParams.get('num');
  const hrefLabel = detailNum !== '1' ? '뒤로가기' : '';

  return (
    <SContainer>
      <JoinHeader
        title="세부 프로필"
        hrefLabel={hrefLabel}
        onClickHref={() => {
          router.push(`/join/detail?num=${Number(detailNum) - 1}`);
        }}
      />
    </SContainer>
  );
}
