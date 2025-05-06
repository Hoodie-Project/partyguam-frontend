import React from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

import { Txt } from '@/components/_atoms';

export default function PartySection() {
  // const containerRef = useRef<HTMLDivElement>(null);
  // const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });

  // const translateY = useTransform(scrollYProgress, [0, 1], [0, -500]); // 조절 필요

  return (
    // <SectionContainer ref={containerRef}>
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
      <Image alt="파티페이지" src="/images/landing/deviceImage.png" width={1600} height={982} />

      {/* <DeviceWrapper>
        <DeviceFrame>
          <DeviceImage src="/images/landing/Device_Macbook_Pro.png" alt="디바이스 프레임" width={800} height={550} />
          <MotionImage
            style={{ y: translateY }}
            src="/images/landing/landing_partypage.png"
            alt="디바이스 내 스크롤 이미지"
            width={676}
            height={430 * 2}
          />
        </DeviceFrame>
      </DeviceWrapper> */}
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 1559px;
  background-color: #ffffff;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: 124px 0;
`;

const DeviceWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 80px;
  position: relative;
`;

const DeviceFrame = styled.div`
  position: relative;
  width: 800px;
  height: 550px;
`;

const DeviceImage = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
`;

const MotionImage = styled(motion.img)`
  position: absolute;
  top: 60px;
  left: 62px;
  width: 676px;
  height: auto;
  z-index: 1;
  object-fit: cover;
`;
