import React from 'react';
import dynamic from 'next/dynamic';

const MyApply = dynamic(() => import('@/components/pages/my/apply'), { ssr: false });

export default function MyApplyPage() {
  return (
    <>
      <MyApply />
    </>
  );
}
