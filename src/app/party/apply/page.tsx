import React from 'react';
import dynamic from 'next/dynamic';

const PartyApply = dynamic(() => import('@/components/pages/party/apply/PartyApply'), { ssr: false });

export default function PartyApplyPage() {
  return (
    <>
      <PartyApply />
    </>
  );
}
