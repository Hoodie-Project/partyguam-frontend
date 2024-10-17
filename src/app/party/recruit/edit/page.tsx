import React from 'react';
import dynamic from 'next/dynamic';

const PartyRecruitEdit = dynamic(() => import('@/components/pages/party/recruit/edit/PartyRecruitEdit'), {
  ssr: false,
});

export default function PartyRecruitEditPage() {
  return (
    <>
      <PartyRecruitEdit />
    </>
  );
}
