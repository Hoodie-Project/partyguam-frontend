import React from 'react';
import dynamic from 'next/dynamic';

const JoinDetailSuccess = dynamic(() => import('@/components/_pages/join/detail/JoinDetailSuccess'), { ssr: false });

export default function JoinDetailSuccessPage() {
  return (
    <>
      <JoinDetailSuccess />
    </>
  );
}
