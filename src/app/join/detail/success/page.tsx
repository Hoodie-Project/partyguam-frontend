import React from 'react';
import dynamic from 'next/dynamic';

const JoinDetailSuccess = dynamic(() => import('@/components/templates/join/detail/JoinDetailSuccess'), { ssr: false });

export default function JoinDetailSuccessPage() {
  return (
    <>
      <JoinDetailSuccess />
    </>
  );
}
