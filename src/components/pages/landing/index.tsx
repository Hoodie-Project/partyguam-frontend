'use client';
import React from 'react';
import styled from '@emotion/styled';

// import { SContainer } from '@/styles/components';

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
  height: 100%;
    overflow: hidden;

`;

const SContainer = styled.section`
  width: 100%;
  height: 100%;
  padding-top: 5.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
`;