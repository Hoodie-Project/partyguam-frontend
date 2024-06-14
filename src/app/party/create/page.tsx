import React from 'react';
import dynamic from 'next/dynamic';

const PartyCreate = dynamic(() => import('@/components/templates/party/create/PartyCreate'), { ssr: false });

export default function PartyCreatePage() {
  return (
    <>
      <PartyCreate />
    </>
  );
}
