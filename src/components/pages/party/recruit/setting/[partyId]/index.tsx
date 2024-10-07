'use client';
import React from 'react';

import { PageHeader } from '@/components/_molecules';
import { FloatingMenu } from '@/components/features';
import { PARTY_SETTING_MENU } from '@/constants';
import { SContainer } from '@/styles/components';

type PageParams = {
  partyId: string;
};

function PartyRecruitSetting({ partyId }: PageParams) {
  return (
    <SContainer>
      <PageHeader title="모집 편집" />
      <FloatingMenu menu={PARTY_SETTING_MENU(partyId)} />
    </SContainer>
  );
}

export default PartyRecruitSetting;
