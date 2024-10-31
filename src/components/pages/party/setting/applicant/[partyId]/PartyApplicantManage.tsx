'use client';
import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';

import { PageHeader } from '@/components/_molecules';
import { Party모집공고관리, Party모집공고별지원자관리 } from '@/components/features/party';
import { SContainer } from '@/styles/components';

type PageParams = {
  partyId: string;
};

function PartyApplicantManage({ partyId }: PageParams) {
  const searchParams = useSearchParams();
  const mainPoisition = searchParams.get('main');
  const subPoisition = searchParams.get('sub');

  // 모집 공고 페이지와 모집 공고별 지원자 리스트 페이지
  const pageType = useMemo(() => {
    if (mainPoisition && subPoisition) return '모집공고별지원자';
    return '모집공고';
  }, [mainPoisition, subPoisition]);

  return (
    <SContainer>
      {/* <FloatingMenu menu={PARTY_SETTING_MENU(partyId)} /> */}
      <PageHeader title="지원자 관리" />
      {pageType === '모집공고' && <Party모집공고관리 partyId={partyId} />}
      {pageType === '모집공고별지원자' && <Party모집공고별지원자관리 partyId={partyId} />}
    </SContainer>
  );
}

export default PartyApplicantManage;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  margin-top: 50px;
`;
