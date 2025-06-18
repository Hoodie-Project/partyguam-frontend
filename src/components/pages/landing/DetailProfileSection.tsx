import React from 'react';
import styled from '@emotion/styled';

import { Txt } from '@/components/_atoms';

export default function DetailProfileSection() {
  return (
    <Container>
      <Header>
        <Txt fontWeight="bold" fontSize={60} style={{ lineHeight: '140%' }}>
          세부프로필
        </Txt>
        <Txt fontWeight="normal" fontSize={24} style={{ lineHeight: '140%', marginTop: '24px' }}>
          세부프로필 작성하고
          <br />
          나와 맞는 파티원을 구해보세요!
        </Txt>
      </Header>

      <VideoContainer>
        <video src="/video/landing1.mp4" autoPlay muted loop playsInline style={{ width: '100%' }} />
      </VideoContainer>
    </Container>
  );
}

const Container = styled.div`
  height: auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 136px 0px 50px;
  text-align: center;
`;

const VideoContainer = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
`;
