import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

import { Txt } from '@/components/_atoms';

function MotionSection({ children }: { children: React.ReactNode }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <ScrollPage ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </ScrollPage>
  );
}
/**
 * !TODO
 * 스크롤 감지시 애니메이션
 */
export default function DetailProfileSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  // const [lastInViewRef, lastInView] = useInView({ threshold: 0.7 });

  // 스크롤 위임: 안쪽 스크롤 최상단에서 바깥쪽으로 넘기기
  useEffect(() => {
    const el = scrollRef.current;

    const handleWheel = (e: WheelEvent) => {
      if (!el) return;

      const isAtTop = el.scrollTop === 0;
      const isScrollingUp = e.deltaY < 0;
      // const isScrollingDown = e.deltaY > 0;

      // 스크롤 위로 넘기기
      if (isAtTop && isScrollingUp) {
        window.scrollBy({ top: -100, behavior: 'smooth' });
        e.preventDefault();
      }

      // ❗️ 아래 섹션 진입 막기
      // if (!lastInView && isScrollingDown) {
      //   e.preventDefault();
      // }
    };

    el?.addEventListener('wheel', handleWheel, { passive: false });
    return () => el?.removeEventListener('wheel', handleWheel);
    // }, [lastInView]);
  }, []);

  return (
    <ScrollContainer ref={scrollRef}>
      <StickyHeader>
        <Txt fontWeight="bold" fontSize={60} style={{ lineHeight: '140%' }}>
          세부프로필
        </Txt>
        <Txt fontWeight="normal" fontSize={24} style={{ lineHeight: '140%', marginTop: '24px' }}>
          세부프로필 작성하고
          <br />
          나와 맞는 파티원을 구해보세요!
        </Txt>
      </StickyHeader>

      <MotionSection>
        <Image src="/images/landing/landing_detailprofile_1.png" alt="스크린1" width={1412} height={508} />
      </MotionSection>

      <MotionSection>
        <Image src="/images/landing/landing_detailprofile_2.png" alt="스크린2" width={1412} height={508} />
      </MotionSection>

      <MotionSection>
        {/* <div ref={lastInViewRef}> */}
        <Image src="/images/landing/landing_detailprofile_3.png" alt="스크린3" width={1412} height={508} />
        {/* </div> */}
      </MotionSection>
    </ScrollContainer>
  );
}

const ScrollContainer = styled.div`
  height: 1184px;
  scroll-snap-type: y mandatory;
  overflow-y: auto;
  /*  스크롤바 숨김 처리 */
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
`;

const StickyHeader = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
  padding: 136px 0 124px;
  text-align: center;
`;

const ScrollPage = styled.section`
  height: 100%;
  scroll-snap-align: start;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding-top: 200px;
`;
