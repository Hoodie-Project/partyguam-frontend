import React from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';

import GooglePlayIcon from '@/assets/icon/google-play.svg';
import { Txt } from '@/components/_atoms';
import { SFlexColumn } from '@/styles/components';

export default function MobileSection() {
  return (
    <SectionContainer>
      <SectionWrapper>
        <SFlexColumn style={{ marginTop: '236px' }}>
          <Image src="/images/logo_white.png" alt="파티구함" width={444} height={165} />
          <Txt fontColor="white" fontWeight="semibold" fontSize={36} style={{ lineHeight: '140%', marginTop: '15px' }}>
            사이드프로젝트
            <br />
            파티원 구하고 싶을 땐?!
          </Txt>
          <CircleButton>
            <GooglePlayIcon /> Google Play
          </CircleButton>
        </SFlexColumn>
        <Image src="/images/landing/landing_phone.png" alt="파티구함모바일" width={446} height={900} />
      </SectionWrapper>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 900px;
  background-color: #21ecc7;
`;

const SectionWrapper = styled.div`
  width: 77.75rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const CircleButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  background-color: #ffffff;
  border-radius: 999px;
  width: 196px;
  height: 60px;
  color: #000000;
  font-weight: 600;
  font-size: 20px;
  line-height: 1;
  letter-spacing: -0.025em;
  margin-top: 26px;
`;
