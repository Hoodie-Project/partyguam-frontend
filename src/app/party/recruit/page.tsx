import React from 'react';
import dynamic from 'next/dynamic';

const PartyRecruit = dynamic(() => import('@/components/pages/party/recruit/PartyRecruit'), { ssr: false });

export default function PartyCreatePage() {
  return (
    <>
      <PartyRecruit />
    </>
  );
}
