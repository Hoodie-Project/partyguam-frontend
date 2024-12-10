'use client';
import React, { useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import type { PartiesResponse } from '@/apis/home';
import { fetchParties } from '@/apis/home';
import { Chip, Square, Txt } from '@/components/_atoms';
import { useModalContext } from '@/contexts/ModalContext';
import { useAuthStore } from '@/stores/auth';

import LoginModal from '../loginModal';

function HomePartyCardList() {
  const [page, setPage] = useState<number>(1);
  const [partyList, setPartyList] = useState<PartiesResponse | null>(null);
  const router = useRouter();
  const sliderRef = useRef<Slider | null>(null); // Slider를 참조할 Ref
  const { isLoggedIn } = useAuthStore();
  const { openModal } = useModalContext();

  useEffect(() => {
    // [GET] 파티 목록 조회
    const fetchPartyList = async () => {
      const response = await fetchParties({
        page: 1,
        limit: 6,
        sort: 'createdAt',
        order: 'DESC',
      });

      setPartyList(response);
    };

    fetchPartyList();
  }, []);

  const handleNext = () => {
    sliderRef.current?.slickNext(); // 다음 슬라이드로 이동
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev(); // 이전 슬라이드로 이동
  };
  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    cssEase: 'linear',
    afterChange: (index: number) => setPage(index + 1),
  };

  const handleClickPartyCard = (partyId: number) => {
    if (isLoggedIn) {
      router.push(`/party/${partyId}`);
    } else {
      openModal({ children: <LoginModal /> });
    }
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '30px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
          <Txt fontSize={24} fontWeight="bold">
            신규 파티
          </Txt>

          <Txt fontSize={16} fontWeight="normal">
            새롭게 시작한 열기가 뜨거운 파티, 함께 할 준비 되셨나요?
          </Txt>
        </div>
        <ControlButtons>
          <Button onClick={handlePrev} isLeft={true}>
            <KeyboardArrowLeftRoundedIcon />
          </Button>
          <Button onClick={handleNext}>
            <KeyboardArrowRightRoundedIcon />
          </Button>
        </ControlButtons>
      </div>

      <SPartyCardList>
        {partyList && partyList?.parties?.length > 0 ? (
          <>
            <StyledSlider ref={sliderRef} {...sliderSettings}>
              {partyList.parties.map(party => (
                <StyledSquare
                  key={party.id}
                  width="100%"
                  height="333px"
                  shadowKey="shadow1"
                  backgroundColor="white"
                  radiusKey="base"
                  borderColor="grey200"
                  onClick={() => handleClickPartyCard(party.id)}
                >
                  <CardContentsWrapper>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_DEV_HOST}/${party.image}`}
                      width={255}
                      height={180}
                      alt={party.title}
                      style={{ borderRadius: '8px', border: '1px solid #F1F1F5' }}
                    />

                    <ChipWrapper>
                      <Chip
                        chipType="filled"
                        label={party.status === 'active' ? '진행중' : '파티종료'}
                        size="xsmall"
                        chipColor={party.status === 'active' ? '#D5F0E3' : '#F6F6F6'}
                        fontColor={party.status === 'active' ? '#016110' : 'grey700'}
                        fontWeight="semibold"
                      />
                      <Chip
                        chipType="filled"
                        label={party.partyType.type}
                        size="xsmall"
                        chipColor="#F6F6F6"
                        fontColor="grey700"
                        fontWeight="semibold"
                      />
                    </ChipWrapper>

                    <EllipsisTitleText fontSize={16} fontWeight="semibold" style={{ lineHeight: '140%' }}>
                      {party.title} {/* 파티 제목 */}
                    </EllipsisTitleText>
                    <Txt
                      fontSize={12}
                      style={{ lineHeight: '140%', color: '#24CE85', justifyItems: 'flex-end', marginTop: '16px' }}
                    >
                      {party.status === 'active' &&
                        party.recruitmentCount > 0 &&
                        `지금 ${party.recruitmentCount}개의 포지션 모집 중`}
                    </Txt>
                  </CardContentsWrapper>
                </StyledSquare>
              ))}
            </StyledSlider>
          </>
        ) : (
          <EmptyState>
            <InfoOutlinedIcon style={{ marginBottom: '6px' }} />
            <Txt fontSize={16} fontWeight="semibold" fontColor="grey400">
              파티가 없습니다.
            </Txt>
          </EmptyState>
        )}
      </SPartyCardList>
    </>
  );
}

export default HomePartyCardList;

const SPartyCardList = styled.section`
  position: relative;
  gap: 20px;
  margin-top: 32px;
`;

const StyledSlider = styled(Slider)`
  position: relative;
  .slick-track {
    display: flex !important;
  }

  .slick-slide {
    margin-right: 20px;
  }

  .slick-list {
    /* 오른쪽 뿌연 효과 추가 */
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 200px;
      height: 100%;
      background: linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0));
      pointer-events: none; /* 클릭 이벤트 방지 */
    }
  }
`;

const StyledSquare = styled(Square)`
  width: 295px;
  height: 333px;
  padding: 16px;
  display: flex;
  box-sizing: border-box;
  cursor: pointer;
`;

const CardContentsWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const EllipsisTitleText = styled(Txt)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  margin: 4px 0px 4px 2px;
`;

const ChipWrapper = styled.div`
  display: flex;
  margin-top: 14px;
  gap: 4px;
`;

const EmptyState = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #767676;
  margin-top: 60px;
`;

// 슬라이더 버튼

const ControlButtons = styled.div`
  display: flex;
  z-index: 10;
  color: #999999;
  justify-self: flex-end;
`;

const Button = styled.button<{ isLeft?: boolean; isFirst?: boolean; isLast?: boolean }>`
  background-color: #ffffff;
  border: 1px solid #d4d4d4;
  ${({ isLeft }) =>
    isLeft &&
    css`
      border-right: none;
    `}
  border-radius: ${({ isLeft }) => (isLeft ? '6px 0px 0px 6px' : '0px 6px 6px 0px')};
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0px 2px 6px -1px rgba(17, 17, 17, 0.08);
  color: #999999;

  &:hover {
    background-color: #eee;
  }
`;
