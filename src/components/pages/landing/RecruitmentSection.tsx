import React, { useRef } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import styled from '@emotion/styled';

import { Txt } from '@/components/_atoms';

export default function RecruitmentSection() {
  const sliderRef = useRef<Slider | null>(null);

  const imageUrls = Array.from({ length: 24 }, (_, i) => `/images/landing/landing_recruit_${(i % 8) + 1}.png`);
  const sliderSettings = {
    infinite: true,
    speed: 5000,
    slidesToShow: 8,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 10,
    cssEase: 'linear',
    pauseOnHover: false,
    swipe: false,
  };
  return (
    <SectionContainer>
      <Header>
        <Txt fontWeight="bold" fontSize={60} style={{ lineHeight: '140%' }}>
          맞춤 모집공고
        </Txt>
        <Txt fontWeight="normal" fontSize={24} style={{ lineHeight: '140%', marginTop: '24px' }}>
          포지션과 성향에 맞는 공고를 추천해드려요
          <br />
          간편하게 파티를 고를 수 있어요
        </Txt>
      </Header>
      <StyledSlider ref={sliderRef} {...sliderSettings}>
        {imageUrls.map(url => (
          <ImageWrapper key={url}>
            <Image alt="맞춤모집공고" src={url} width={270} height={399} />
          </ImageWrapper>
        ))}
      </StyledSlider>
    </SectionContainer>
  );
}

const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  height: 967px;
  background-color: #ddfcf6;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 124px;
`;

const ImageWrapper = styled.div`
  width: 270px;
  height: 399px;
`;

const StyledSlider = styled(Slider)`
  margin-top: 124px;
  margin-bottom: 159px;
  max-width: 100vw;

  .slick-track {
    display: flex !important;
    flex-wrap: nowrap !important;
  }

  .slick-slide {
    width: 270px !important;
    height: 399px;
    margin: 0;
  }

  .slick-list {
    overflow: hidden;
  }

  //  .slick-list {
  //    /* 오른쪽 뿌연 효과 추가 */
  //   &::after {
  //      content: '';
  //      position: absolute;
  //      top: 0;
  //      right: 0;
  //      width: 200px;
  //      height: 100%;
  //      background: linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
  //      pointer-events: none; /* 클릭 이벤트 방지 */
  //    }
  //  }
`;