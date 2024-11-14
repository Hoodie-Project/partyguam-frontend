import React from 'react';
import dynamic from 'next/dynamic';

const HomeParty = dynamic(() => import('@/components/pages/home/party'), { ssr: false });

export default function HomePartyPage() {
  return (
    <>
      <HomeParty />
    </>
  );
}
