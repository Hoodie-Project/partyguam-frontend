import React from 'react';
import dynamic from 'next/dynamic';

const PartyCreate = dynamic(() => import('@/components/pages/party/setting/[partyId]/PartyEdit'), { ssr: false });

export default function PartyCreatePage() {
  return (
    <>
      <PartyCreate />
    </>
  );
}
