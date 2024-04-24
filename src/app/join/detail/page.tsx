import React from 'react';
import dynamic from 'next/dynamic';

const JoinDetail = dynamic(() => import('@/components/templates/join/detail/JoinDetail'), { ssr: false });

export default function JoinDetailPage() {
  return (
    <>
      <JoinDetail />
    </>
  );
}
