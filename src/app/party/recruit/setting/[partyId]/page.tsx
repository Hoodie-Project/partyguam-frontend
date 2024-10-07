import React from 'react';
import dynamic from 'next/dynamic';

const PartyRecruitSetting = dynamic(() => import('@/components/pages/party/recruit/setting/[partyId]'), {
  ssr: false,
});

type PageProps = {
  params: {
    partyId: string;
  };
};

export default function PartyRecruitSettingPage({ params }: PageProps) {
  const { partyId } = params;

  return <PartyRecruitSetting partyId={partyId} />;
}
