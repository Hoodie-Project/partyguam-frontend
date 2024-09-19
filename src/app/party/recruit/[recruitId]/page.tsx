import React from 'react';
import dynamic from 'next/dynamic';

const PartyRecruitDetail = dynamic(() => import('@/components/pages/party/recruit/[recruitId]/index'), {
  ssr: false,
});

type PageProps = {
  params: {
    recruitId: string;
  };
};

export default function PartyHomePage({ params }: PageProps) {
  const { recruitId } = params;

  return <PartyRecruitDetail recruitId={recruitId} />;
}
