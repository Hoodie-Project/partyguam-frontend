'use client';
import React from 'react';
import styled from '@emotion/styled';

import { SContainer } from '@/styles/components';

import AlarmSection from './AlarmSection';
import DetailProfileSection from './DetailProfileSection';
import MobileSection from './MobileSection';
import PartySection from './PartySection';
import RecruitmentSection from './RecruitmentSection';

export default function Landing() {
  return (
    <SContainer>
      <MainPageContentsWrapper>
        <MobileSection />
        <DetailProfileSection />
        <RecruitmentSection />
        <PartySection />
        <AlarmSection />
      </MainPageContentsWrapper>
    </SContainer>
  );
}

const MainPageContentsWrapper = styled.div`
  width: 100%;
  height: auto;
`;
