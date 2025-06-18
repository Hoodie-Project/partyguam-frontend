import React from 'react';
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
        <video src="/video/landing2.mp4" autoPlay muted loop playsInline style={{ width: '100%' }} />
      </VideoContainer>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
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
