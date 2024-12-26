import React, { useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import styled from '@emotion/styled';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchGetUsersMeParties } from '@/apis/detailProfile';
import { Chip, Square, Txt } from '@/components/_atoms';
import { ProfileImage } from '@/components/_molecules';
import { useModalContext } from '@/contexts/ModalContext';
import { useAuthStore } from '@/stores/auth';
import { Divider, SFlexColumn, SFlexColumnCenter, SFlexRow } from '@/styles/components';
import { calculateAge } from '@/utils/date';

const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
const BASE_URL = isDev ? process.env.NEXT_PUBLIC_API_DEV_HOST : process.env.NEXT_PUBLIC_API_HOST;

export default function MyPagePreviewModal() {
  const [visibleItemsCount, setVisibleItemsCount] = useState(3); // 초기 표시할 아이템 개수

  const { modalData, closeModal } = useModalContext();
  const { onCancel } = modalData;
  const user = useAuthStore();

  const userTime = useMemo(() => {
    // '시간'이 포함된 객체와 포함되지 않은 객체를 분리
    const timeIncluded = user.userPersonalities.filter(
      personality => personality.personalityOption.personalityQuestion.id === 1,
    );
    return timeIncluded.flatMap(personality => personality.personalityOption.content);
  }, [user]);

  const userPersonalities = useMemo(() => {
    const timeExcluded = user.userPersonalities.filter(
      personality => personality.personalityOption.personalityQuestion.id !== 1,
    );
    return timeExcluded.flatMap(personality => personality.personalityOption.content);
  }, [user]);

  const onCancelInternal = () => {
    onCancel?.();
    closeModal();
  };

  // [GET] 포지션 모집 공고별 지원자 조회
  const {
    data: myPartyList,
    hasNextPage,
    fetchNextPage,
    isFetched,
  } = useInfiniteQuery({
    queryKey: [],
    queryFn: async ({ pageParam }) => {
      const res = await fetchGetUsersMeParties({
        page: pageParam as number,
        limit: 10,
        sort: 'createdAt',
        order: 'DESC',
      });

      return res;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetchedItems = allPages.flatMap(page => page?.partyUsers).length;

      if (lastPage != null && totalFetchedItems < lastPage.total) {
        return allPages.length + 1;
      } else return null;
    },
  });

  // infiniteQuery refetch 트리거
  const { ref } = useInView({
    onChange: inView => {
      inView && hasNextPage && fetchNextPage();
    },
  });

  const handleShowMore = () => {
    setVisibleItemsCount(myPartyList?.pages[0]?.total as number); // 추가로 3개 더 보여줌
  };

  return (
    <MyPageEditModalContainer>
      <CloseRoundedIcon
        onClick={onCancelInternal}
        sx={{
          width: '24px',
          cursor: 'pointer',
          position: 'absolute',
          top: 0,
          right: 0,
          margin: '20px',
        }}
      />
      <Square
        width="100%"
        height="auto"
        shadowKey="shadow2"
        position="flex-start"
        radiusKey="s"
        backgroundColor="white"
        style={{ display: 'flex', flexDirection: 'row', justifySelf: 'flex-start', gap: '24px', padding: '32px' }}
      >
        <ProfileImage imageUrl={user.image || ''} size={120} />
        <SFlexColumn>
          <SFlexRow style={{ alignItems: 'center' }}>
            <Txt fontWeight="semibold" fontSize={20} style={{ marginRight: '8px' }}>
              {user.nickname}
            </Txt>
            {user.genderVisible && (
              <>
                <Txt fontSize={16}>{user.gender === 'F' ? '여자' : '남자'}</Txt>
                <div
                  style={{
                    width: '2px',
                    height: '12px',
                    backgroundColor: '#999999',
                    margin: '0px 8px 0px 8px',
                    borderRadius: '12px',
                  }}
                />
              </>
            )}
            {user.birthVisible && <Txt fontSize={16}>{calculateAge(user.birth)}</Txt>}
          </SFlexRow>
          {user.userCareers.length != 0 && (
            <SFlexColumn style={{ marginTop: '12px', gap: '12px' }}>
              <SFlexRow style={{ alignItems: 'center' }}>
                <SFlexRow style={{ gap: '8px' }}>
                  {/* 년수 */}
                  <Chip
                    chipType="filled"
                    chipColor="greenLight400"
                    label={`${user.userCareers.filter(item => item.careerType === 'primary')[0]?.years}년`}
                    chipStyle={{
                      fontSize: '16px',
                      width: 'auto',
                      height: '24px',
                      padding: '4px 10px',
                      boxShadow: '0px 1px 4px -1px rgba(17, 17, 17, 0.08)',
                      cursor: 'initial',
                    }}
                  />
                  {/* 주포지션 */}
                  <Chip
                    chipType="filled"
                    chipColor="greenLight400"
                    label={
                      <>
                        <Txt fontSize={16}>
                          {user.userCareers.filter(item => item.careerType === 'primary')[0]?.position.main}
                        </Txt>
                        <div
                          style={{
                            width: '2px',
                            height: '12px',
                            backgroundColor: '#7FF4DF',
                            margin: '0px 6px 0px 6px',
                            borderRadius: '12px',
                          }}
                        />
                        <Txt fontSize={16}>
                          {user.userCareers.filter(item => item.careerType === 'primary')[0]?.position.sub}
                        </Txt>
                      </>
                    }
                    chipStyle={{
                      width: 'auto',
                      height: '24px',
                      padding: '4px 10px',
                      boxShadow: '0px 1px 4px -1px rgba(17, 17, 17, 0.08)',
                      cursor: 'initial',
                    }}
                  />
                </SFlexRow>
              </SFlexRow>
              <SFlexRow style={{ alignItems: 'center' }}>
                <SFlexRow style={{ gap: '8px' }}>
                  {/* 년수 */}
                  <Chip
                    chipType="filled"
                    chipColor="grey100"
                    label={`${user.userCareers.filter(item => item.careerType !== 'primary')[0]?.years}년`}
                    chipStyle={{
                      fontSize: '16px',
                      width: 'auto',
                      height: '24px',
                      padding: '4px 10px',
                      boxShadow: '0px 1px 4px -1px rgba(17, 17, 17, 0.08)',
                      cursor: 'initial',
                    }}
                  />
                  {/* 주포지션 */}
                  <Chip
                    chipType="filled"
                    chipColor="grey100"
                    label={
                      <>
                        <Txt fontSize={16}>
                          {user.userCareers.filter(item => item.careerType !== 'primary')[0]?.position.main}
                        </Txt>
                        <div
                          style={{
                            width: '2px',
                            height: '12px',
                            backgroundColor: '#999999',
                            margin: '0px 6px 0px 6px',
                            borderRadius: '12px',
                          }}
                        />
                        <Txt fontSize={16}>
                          {user.userCareers.filter(item => item.careerType !== 'primary')[0]?.position.sub}
                        </Txt>
                      </>
                    }
                    chipStyle={{
                      width: 'auto',
                      height: '24px',
                      padding: '4px 10px',
                      boxShadow: '0px 1px 4px -1px rgba(17, 17, 17, 0.08)',
                      cursor: 'initial',
                    }}
                  />
                </SFlexRow>
              </SFlexRow>
            </SFlexColumn>
          )}
          {user.portfolio && (
            <Link
              href={user.portfolio}
              target="_blank"
              passHref
              style={{ marginTop: '12px', color: '#0033FF', textDecoration: 'underline' }}
            >
              {user.portfolioTitle || user.portfolio}
            </Link>
          )}
        </SFlexColumn>
      </Square>

      <MyPageDetailProfileContainer>
        <SFlexRow style={{ gap: '20px' }}>
          <SFlexColumn style={{ flex: 1 }}>
            <Txt fontWeight="semibold" fontSize={18}>
              관심 지역
            </Txt>
            <SFlexRow style={{ gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
              {user.userLocations.map(item => (
                <Chip
                  key={item.id}
                  chipType="filled"
                  chipColor="greenLight400"
                  label={`${item.location.province} ${item.location.city}`}
                  chipStyle={{
                    fontSize: '16px',
                    width: 'auto',
                    height: '24px',
                    padding: '4px 10px',
                    boxShadow: '0px 1px 4px -1px rgba(17, 17, 17, 0.08)',
                    cursor: 'initial',
                  }}
                />
              ))}
            </SFlexRow>
          </SFlexColumn>
          <SFlexColumn style={{ flex: 1 }}>
            <Txt fontWeight="semibold" fontSize={18}>
              희망 시간
            </Txt>
            <SFlexRow style={{ gap: '8px', marginTop: '16px' }}>
              {userTime?.map((item, i) => (
                <Chip
                  key={i}
                  chipType="filled"
                  chipColor="greenLight400"
                  label={item}
                  chipStyle={{
                    fontSize: '16px',
                    width: 'auto',
                    height: '24px',
                    padding: '4px 10px',
                    boxShadow: '0px 1px 4px -1px rgba(17, 17, 17, 0.08)',
                    cursor: 'initial',
                  }}
                />
              ))}
            </SFlexRow>
          </SFlexColumn>
        </SFlexRow>
        <SFlexColumn>
          <Txt fontWeight="semibold" fontSize={18}>
            성향
          </Txt>
          <Personality>
            <div className="personality-container">
              {/* 왼쪽 리스트 */}
              <ul className="left-column">
                {userPersonalities.slice(0, 3).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              {/* 오른쪽 리스트 */}
              <ul className="right-column">
                {userPersonalities.slice(3).map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </Personality>
        </SFlexColumn>
        <div>
          <SFlexRow>
            <Txt fontWeight="semibold" fontSize={18} style={{ marginRight: '5px' }}>
              참여 파티 목록
            </Txt>
            <Txt fontWeight="semibold" fontSize={18} fontColor="greenDark100">
              4
            </Txt>
            <Txt fontWeight="semibold" fontSize={18}>
              건
            </Txt>
          </SFlexRow>

          <PartyCardList>
            {myPartyList?.pages.flatMap(page =>
              page?.partyUsers.slice(0, visibleItemsCount).map(party => (
                <StyledSquare
                  key={party.id}
                  width="100%"
                  height="333px"
                  shadowKey="shadow1"
                  backgroundColor="white"
                  radiusKey="base"
                  borderColor="grey200"
                >
                  <CardContentsWrapper>
                    <Image
                      src={party.party.image ? `${BASE_URL}/${party.party.image}` : '/images/guam.png'}
                      width={165}
                      height={150}
                      alt={party.party.title}
                      style={{ borderRadius: '8px', border: '1px solid #F1F1F5' }}
                    />

                    <ChipWrapper>
                      <Chip
                        chipType="filled"
                        label={party.party.status === 'active' ? '진행중' : '파티종료'}
                        size="xsmall"
                        chipColor={party.party.status === 'active' ? '#D5F0E3' : '#505050'}
                        fontColor={party.party.status === 'active' ? '#016110' : '#ffffff'}
                        fontWeight="semibold"
                      />
                      <Chip
                        chipType="filled"
                        label={party.party.partyType.type}
                        size="xsmall"
                        chipColor="#F6F6F6"
                        fontColor="grey700"
                        fontWeight="semibold"
                      />
                    </ChipWrapper>

                    <EllipsisTitleText fontSize={16} fontWeight="semibold" style={{ lineHeight: '140%' }}>
                      {party.party.title} {/* 파티 제목 */}
                    </EllipsisTitleText>
                    <Txt
                      fontSize={14}
                      style={{
                        lineHeight: '140%',
                        marginTop: 'auto',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      {party.position.main} <Divider /> {party.position.sub}
                    </Txt>
                  </CardContentsWrapper>
                </StyledSquare>
              )),
            )}
            <div ref={ref} style={{ height: '20px', backgroundColor: 'transparent' }} />
          </PartyCardList>
          <SFlexColumnCenter>
            {visibleItemsCount !== myPartyList?.pages[0]?.total && (
              <CircleButton onClick={handleShowMore}>
                <Txt fontSize={14} fontColor="grey500">
                  파티 더보기
                </Txt>
                <KeyboardArrowDownRoundedIcon />
              </CircleButton>
            )}
          </SFlexColumnCenter>
        </div>
      </MyPageDetailProfileContainer>
    </MyPageEditModalContainer>
  );
}

const MyPageEditModalContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 804px;
  height: auto;
  max-height: 1053px;
  padding: 70px 102px 86px 102px;
  background-color: white;
  border-radius: 12px;
  overflow-y: auto;
`;

const MyPageDetailProfileContainer = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Personality = styled.div`
  margin-top: 16px;
  font-weight: normal;
  > .personality-container {
    display: flex;
    gap: 20px;
  }
  > .personality-container .left-column,
  > .personality-container .right-column {
    flex: 1;
    list-style-position: inside;
    font-size: 16px;
    line-height: 1.4;
    letter-spacing: -0.025em;
    > li {
      margin-bottom: 6px;
    }
  }
`;

const PartyCardList = styled.section`
  width: 600px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
`;

const StyledSquare = styled(Square)`
  width: 100%;
  height: 270px;
  padding: 12px;
  display: flex;
  box-sizing: border-box;
  cursor: pointer;
`;

const CardContentsWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const EllipsisTitleText = styled(Txt)`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  margin: 8px 0px 0px 2px;
`;
const ChipWrapper = styled.div`
  display: flex;
  margin-top: 14px;
  gap: 4px;
`;
const CircleButton = styled.button`
  margin: auto 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid #e5e5ec;
  border-radius: 999px;
  padding: 8px 16px;
  color: #999999;
  box-shadow: 0px 2px 10px -1px rgba(17, 17, 17, 0.16);
`;
