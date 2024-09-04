import React from 'react';
import dynamic from 'next/dynamic';

const PartyHome = dynamic(() => import('@/components/pages/party/[partyId]/index'), { ssr: false });

type PageProps = {
  params: {
    partyId: string;
  };
};

export default function PartyHomePage({ params }: PageProps) {
  const { partyId } = params;

  return <PartyHome partyId={partyId} />;
}
