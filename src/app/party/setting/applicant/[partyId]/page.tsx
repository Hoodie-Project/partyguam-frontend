import React from 'react';
import dynamic from 'next/dynamic';

const PartyApplicantManage = dynamic(
  () => import('@/components/pages/party/setting/applicant/[partyId]/PartyApplicantManage'),
  { ssr: false },
);

type PageProps = {
  params: {
    partyId: string;
  };
};

export default function PartyApplicantManagePage({ params }: PageProps) {
  const { partyId } = params;

  return <PartyApplicantManage partyId={partyId} />;
}
