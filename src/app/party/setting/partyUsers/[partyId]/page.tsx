import React from 'react';
import dynamic from 'next/dynamic';

const PartyUserManage = dynamic(
  () => import('@/components/pages/party/setting/partyUsers/[partyId]/PartyUsersManage'),
  { ssr: false },
);

type PageProps = {
  params: {
    partyId: string;
  };
};

export default function PartyUserManagePage({ params }: PageProps) {
  const { partyId } = params;

  return <PartyUserManage partyId={partyId} />;
}
