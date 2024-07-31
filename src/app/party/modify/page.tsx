import React from 'react';
import dynamic from 'next/dynamic';

const PartyEdit = dynamic(() => import('@/components/pages/party/edit/PartyEdit'), { ssr: false });

export default function PartyModifyPage() {
  return (
    <>
      <PartyEdit />
    </>
  );
}
