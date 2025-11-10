import React from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';

import { Txt } from '@/components/_atoms';

export default function PartySection() {
  return (
    <SectionContainer>
      <Header>
        <Txt fontWeight="bold" fontSize={60} style={{ lineHeight: '140%' }}>
          파티 페이지
        </Txt>
        <Txt fontWeight="normal" fontSize={24} style={{ lineHeight: '140%', marginTop: '24px' }}>
          프로젝트 시작 전에
          <br />
          어떤 파티인지 자세히 알 수 있어요!
        </Txt>
      </Header>
      <VideoContainer>
        <Image src="https://partyguham.s3.ap-northeast-2.amazonaws.com/assets/images/party-motion.gif" alt="랜딩 페이지 프리뷰" width={1920} height={1080} unoptimized />
      </VideoContainer>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
  width: 100%;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 124px 0 50px;
`;

const VideoContainer = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
`;
