import React from 'react';
import dynamic from 'next/dynamic';

const PartyEdit = dynamic(() => import('@/components/pages/party/setting/[partyId]/PartyEdit'), { ssr: false });

type PageProps = {
  params: {
    partyId: string;
  };
};

export default function PartyEditPage({ params }: PageProps) {
  const { partyId } = params;

  return <PartyEdit partyId={partyId} />;
}
