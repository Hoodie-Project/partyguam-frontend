import React from 'react';
import dynamic from 'next/dynamic';

const MyParty = dynamic(() => import('@/components/pages/my/party'), { ssr: false });

export default function MyPartyPage() {
  return (
    <>
      <MyParty />
    </>
  );
}
