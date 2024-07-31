import React from 'react';
import dynamic from 'next/dynamic';

const PartyCreate = dynamic(() => import('@/components/pages/party/edit/PartyEdit'), { ssr: false });

export default function PartyCreatePage() {
  return (
    <>
      <PartyCreate />
    </>
  );
}
