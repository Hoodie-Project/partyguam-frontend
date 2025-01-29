'use client';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import { fetchPartyRecruitments, fetchPersonalizedPartiesRecruitments } from '@/apis/home';
import NoteCheckIcon from '@/assets/icon/note-check.svg';
import { Chip, Square, Txt } from '@/components/_atoms';
import { useAuthStore } from '@/stores/auth';
import { SFlexColumnCenter } from '@/styles/components';
import type { PartyRecruitmentsResponse } from '@/types/home';

type Props = {
  personalized?: boolean;
};

const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
const BASE_URL = isDev ? process.env.NEXT_PUBLIC_API_DEV_HOST : process.env.NEXT_PUBLIC_API_HOST;

function HomeRecruitmentList({ personalized = false }: Props) {
  const [page, setPage] = useState<number>(1);
  const [recruitmentList, setRecruitmentList] = useState<PartyRecruitmentsResponse | null>(null);
  const [세부프로필미입력, set세부프로필미입력] = useState(false);
  const sliderRef = useRef<Slider | null>(null);
  const router = useRouter();
  const { nickname } = useAuthStore();

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };
  const sliderSettings = {
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    afterChange: (index: number) => setPage(index + 1),
  };

  useEffect(() => {
    const fetchRecruitments = async () => {
      const response = await fetchPartyRecruitments({
        page: 1,
        limit: 6,
        sort: 'createdAt',
        order: 'DESC',
      });

      setRecruitmentList(response);
    };

    const fetchPersonalizedRecruitment = async () => {
      try {
        const response = await fetchPersonalizedPartiesRecruitments({
          page: 1,
          limit: 6,
          sort: 'createdAt',
          order: 'DESC',
        });

        setRecruitmentList(response);

        if (personalized && response == null) set세부프로필미입력(true);
      } catch (err) {
        if (err === 404) {
          set세부프로필미입력(true);
        }
      }
    };

    if (personalized) fetchPersonalizedRecruitment();
    else fetchRecruitments();
  }, [personalized]);

  const handleClickRecruitmentCard = (recruitmentId: number, partyId: number) => {
    router.push(`/party/recruit/${recruitmentId}?partyId=${partyId}`);
  };

  return (
    <>
      {!세부프로필미입력 && (
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
              {personalized ? '맞춤 모집공고' : '신규 모집공고'}
            </Txt>

            <Txt fontSize={16} fontWeight="normal">
              {personalized
                ? `${nickname}님에게 딱 맞는 포지션을 추천해드려요.`
                : '새로운 여정을 시작할 타이밍, 신규 모집공고를 확인해 보세요!'}
            </Txt>
          </div>
          {personalized && (
            <ControlButtons>
              <ArrowButton onClick={handlePrev} isLeft={true} disabled={page === 1}>
                <KeyboardArrowLeftRoundedIcon />
              </ArrowButton>
              <ArrowButton onClick={handleNext} disabled={page === 3}>
                <KeyboardArrowRightRoundedIcon />
              </ArrowButton>
            </ControlButtons>
          )}
        </div>
      )}
      <ReCruitmentCardWrapper>
        {personalized ? (
          세부프로필미입력 ? (
            <GoToDetailProfile>
              <NoteCheckIcon />
              <SFlexColumnCenter>
                <Txt fontSize={20} fontWeight="semibold" style={{ lineHeight: '160%' }}>
                  세부프로필을 완료하고
                </Txt>
                <Txt fontSize={20} fontWeight="semibold">
                  모집공고를 추천받으세요!
                </Txt>
              </SFlexColumnCenter>
              <CircleButton onClick={() => router.push('/my/profile')}>
                <Txt fontSize={16} fontColor="black" fontWeight="semibold">
                  세부프로필 설정하기
                </Txt>
                <KeyboardArrowRightRoundedIcon style={{ width: '20px', height: '20px' }} />
              </CircleButton>
            </GoToDetailProfile>
          ) : (
            <>
              <StyledSlider ref={sliderRef} {...sliderSettings}>
                {recruitmentList?.partyRecruitments?.map(recruitment => (
                  <StyledSquare
                    key={recruitment.id}
                    width="405px"
                    height="190px"
                    shadowKey="shadow1"
                    backgroundColor="white"
                    radiusKey="base"
                    borderColor="grey200"
                    personalized={personalized}
                    style={{ marginRight: '12px' }}
                    onClick={() => handleClickRecruitmentCard(recruitment.id, recruitment.party.id)}
                  >
                    <CardContentsWrapper>
                      <Image
                        src={recruitment.party.image ? `${BASE_URL}/${recruitment.party.image}` : '/images/guam.png'}
                        width={200}
                        height={150}
                        alt={recruitment.party.title}
                        style={{ borderRadius: '8px', border: '1px solid #F1F1F5' }}
                      />
                      <CardRightWrapper>
                        <div>
                          <Chip
                            chipType="filled"
                            label={recruitment.party.partyType.type}
                            size="xsmall"
                            chipColor="#F6F6F6"
                            fontColor="grey700"
                            fontWeight="semibold"
                          />
                          <EllipsisTitleText fontSize={16} fontWeight="semibold" style={{ lineHeight: '140%' }}>
                            {recruitment.party.title} {/* 파티 제목 */}
                          </EllipsisTitleText>
                          <Txt
                            fontSize={14}
                            color="grey600"
                            style={{
                              marginLeft: '2px',
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              lineHeight: '140%',
                            }}
                          >
                            {recruitment.position.main} <Divider />
                            {recruitment.position.sub}
                          </Txt>
                        </div>

                        <RecruitsCount>
                          <Txt fontSize={12} style={{ lineHeight: '140%' }}>
                            {recruitment.status === 'active' ? '모집중' : '파티종료'}
                          </Txt>

                          <Txt
                            fontSize={12}
                            color="failRed"
                            style={{ marginLeft: '4px', color: '#DC0000', lineHeight: '140%' }}
                          >
                            {recruitment.recruitedCount} / {recruitment.recruitingCount}
                          </Txt>
                        </RecruitsCount>
                      </CardRightWrapper>
                    </CardContentsWrapper>
                  </StyledSquare>
                ))}
              </StyledSlider>
            </>
          )
        ) : (
          <CardListWrapper>
            {recruitmentList?.partyRecruitments?.map(recruitment => (
              <Fragment key={recruitment.id}>
                <StyledSquare
                  personalized={personalized}
                  key={recruitment.id}
                  width="100%"
                  height="160px"
                  shadowKey="shadow1"
                  backgroundColor="white"
                  radiusKey="base"
                  borderColor="grey200"
                  onClick={() => handleClickRecruitmentCard(recruitment.id, recruitment.party.id)}
                >
                  <CardContentsWrapper>
                    <Image
                      src={recruitment.party.image ? `${BASE_URL}/${recruitment.party.image}` : '/images/guam.png'}
                      width={160}
                      height={120}
                      alt={recruitment.party.title}
                      style={{ borderRadius: '8px', border: '1px solid #F1F1F5' }}
                    />
                    <CardRightWrapper>
                      <div>
                        <Chip
                          chipType="filled"
                          label={recruitment.party.partyType.type}
                          size="xsmall"
                          chipColor="#F6F6F6"
                          fontColor="grey700"
                          fontWeight="semibold"
                        />
                        <EllipsisTitleText fontSize={16} fontWeight="semibold" style={{ lineHeight: '140%' }}>
                          {recruitment.party.title} {/* 파티 제목 */}
                        </EllipsisTitleText>
                        <Txt
                          fontSize={14}
                          color="grey600"
                          style={{
                            marginLeft: '2px',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            lineHeight: '140%',
                          }}
                        >
                          {recruitment.position.main} <Divider />
                          {recruitment.position.sub}
                        </Txt>
                      </div>

                      <RecruitsCount>
                        <Txt fontSize={12} style={{ lineHeight: '140%' }}>
                          {recruitment.status === 'active' ? '모집중' : '파티종료'}
                        </Txt>

                        <Txt
                          fontSize={12}
                          color="failRed"
                          style={{ marginLeft: '4px', color: '#DC0000', lineHeight: '140%' }}
                        >
                          {recruitment.recruitedCount} / {recruitment.recruitingCount}
                        </Txt>
                      </RecruitsCount>
                    </CardRightWrapper>
                  </CardContentsWrapper>
                </StyledSquare>
              </Fragment>
            ))}
          </CardListWrapper>
        )}
        {recruitmentList?.total == 0 && (
          <EmptyState>
            <InfoOutlinedIcon style={{ marginBottom: '6px' }} />
            <Txt fontSize={16} fontWeight="semibold" fontColor="grey400">
              모집공고가 없어요.
            </Txt>
          </EmptyState>
        )}
      </ReCruitmentCardWrapper>
    </>
  );
}

export default HomeRecruitmentList;

const StyledSlider = styled(Slider)`
  position: relative;
  .slick-track {
    display: flex !important;
  }

  .slick-slide {
    width: 514px !important; /* 기본 slick-slide 너비 무시 */
  }

  .slick-slide {
    margin-right: 12px;
  }

  //  .slick-list {
  //    /* 오른쪽 뿌연 효과 추가 */
  //    &::after {
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

const CircleButton = styled.button`
  margin: auto 0;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid #21ecc7;
  border-radius: 999px;
  padding: 6px 12px;
  color: #111111;
`;

const GoToDetailProfile = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const StyledSquare = styled(Square)<{ personalized?: boolean }>`
  ${({ personalized }) =>
    !personalized &&
    css`
      flex: 1 1 calc(33.333% - 12px);
    `}
  padding: ${({ personalized }) => (personalized ? '20px' : '20px')};
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
  cursor: pointer;
`;

const CardListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 항상 3개의 열 */
  gap: 12px;
`;

const ReCruitmentCardWrapper = styled.section`
  position: relative;
`;

const CardContentsWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`;

const CardRightWrapper = styled.div`
  width: calc(100% - 172px);
  height: 100%;
  display: flex;
  flex-direction: column;
  margin-left: 12px;
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

const Divider = styled.div`
  width: 1.5px;
  height: 12px;
  background-color: #999999;
  border-radius: 9px;
  margin: 0px 6px 0px 6px;
`;

const RecruitsCount = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: flex-end;
  margin-left: auto;
  text-align: end;
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

const ArrowButton = styled.button<{ isLeft?: boolean }>`
  background-color: #ffffff;
  border: 1px solid #e5e5ec;
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

  &:disabled {
    color: #d4d4d4;
  }

  &:hover {
    background-color: #eee;
  }
`;
