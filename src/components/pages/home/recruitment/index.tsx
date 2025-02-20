'use client';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchPartyRecruitments } from '@/apis/home';
import { Chip, Square, Txt } from '@/components/_atoms';
import { ScrollToTop, SearchBar } from '@/components/_molecules';
import HomeRecruitmentSelect from '@/components/features/home/HomeRecruitmentSelect';
import { useModalContext } from '@/contexts/ModalContext';
import { useAuthStore } from '@/stores/auth';
import { useApplicantFilterStore } from '@/stores/home/useApplicantFilter';
import { SContainer, SHomeContainer } from '@/styles/components';

const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
const BASE_URL = isDev ? process.env.NEXT_PUBLIC_API_DEV_HOST : process.env.NEXT_PUBLIC_API_HOST;

function HomeRecruitment() {
  const searchParams = useSearchParams();
  const [search모집공고Value, setSearch모집공고Value] = useState<string>(searchParams.get('search') || '');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC'); // 등록일순

  const { isLoggedIn } = useAuthStore();
  const { openModal } = useModalContext();
  const router = useRouter();

  const { submit직무Main, submit직무Position, submit파티유형Filter } = useApplicantFilterStore();

  // 닉네임 검색
  const handleChange모집공고Search = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch모집공고Value(e.target.value);
  };

  const handleKeyDown모집공고Search = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // search 포함 fetch
      // try {
      //   const requestParams = {
      //     partyId: Number(partyId),
      //     sort: 'createdAt',
      //     order,
      //     main: mainPositionSearch.label || '',
      //     nickname: nicknameSearch,
      //   };
      //   const data = await fetchPartyAdminUsers(requestParams);
      //   setPartyUserList(data);
      // } catch (err) {
      //   console.error('Error fetching partyUsers : ', err);
      // }
    }
  };

  // 등록일순
  const getIcon = () => {
    if (order === 'DESC') {
      return <ArrowDownwardRoundedIcon style={{ width: '16px', height: '16px', marginLeft: '2px' }} />;
    }

    if (order === 'ASC') {
      return <ArrowUpwardRoundedIcon style={{ width: '16px', height: '16px', marginLeft: '2px' }} />;
    }
    return <ArrowUpwardRoundedIcon style={{ width: '16px', height: '16px', marginLeft: '2px' }} />;
  };

  // [GET] 포지션 모집 공고별 지원자 조회
  const fetchRecruitments = async ({ pageParam = 1 }) => {
    const response = await fetchPartyRecruitments({
      page: pageParam,
      limit: 10,
      sort: 'createdAt',
      order,
      main: submit직무Main,
      position: submit직무Position,
      partyType: submit파티유형Filter.map(Number),
      titleSearch: search모집공고Value,
    });
    return response;
  };

  // 무한스크롤
  const {
    data: partyRecruitmentList,
    hasNextPage,
    fetchNextPage,
    isFetched,
  } = useInfiniteQuery({
    queryKey: ['recruitments', submit직무Main, submit직무Position, submit파티유형Filter, search모집공고Value, order],
    queryFn: fetchRecruitments,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetchedItems = allPages.flatMap(page => page?.partyRecruitments).length;

      if (lastPage == null) return null;
      if (totalFetchedItems < lastPage.total) {
        return allPages.length + 1;
      } else return null;
    },
    refetchOnWindowFocus: false,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleClickRecruitmentCard = (recruitmentId: number, partyId: number) => {
    router.push(`/party/recruit/${recruitmentId}?partyId=${partyId}`);
  };

  return (
    <SContainer>
      <SHomeContainer>
        <Txt fontWeight="bold" fontSize={32}>
          모집공고
        </Txt>
        <HeaderWrapper>
          <LeftFilter>
            <HomeRecruitmentSelect />
            <div style={{ width: '400px', height: '36px' }}>
              <SearchBar
                type="round"
                placeholder="찾고 싶은 모집공고 이름을 입력하세요."
                value={search모집공고Value}
                onChange={handleChange모집공고Search}
                onKeyDown={handleKeyDown모집공고Search}
                onClear={async () => {
                  setSearch모집공고Value('');
                }}
                searchBarStyle={{ boxShadow: '0px 2px 6px -1px rgba(17, 17, 17, 0.08)' }}
              />
            </div>
          </LeftFilter>
          <RightFilter>
            <Txt
              fontWeight="semibold"
              fontSize={14}
              onClick={() => setOrder(prevOrder => (prevOrder === 'ASC' ? 'DESC' : 'ASC'))}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              등록일순
              {getIcon()}
            </Txt>
          </RightFilter>
        </HeaderWrapper>
        <div style={{ height: '100%' }}>
          <ReCruitmentCardWrapper>
            {partyRecruitmentList?.pages.flatMap(page =>
              page?.partyRecruitments.map((recruitment, i) => (
                <StyledSquare
                  key={`${recruitment.id}_${i}`}
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
                          {recruitment.position.sub} {/* 포지션 정보 */}
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
              )),
            )}
            {partyRecruitmentList?.pages[0]?.total === 0 && (
              <EmptyState>
                <InfoOutlinedIcon style={{ marginBottom: '6px' }} />
                <Txt fontSize={16} fontWeight="semibold" fontColor="grey400">
                  모집공고가 없습니다.
                </Txt>
              </EmptyState>
            )}
          </ReCruitmentCardWrapper>

          <div ref={ref} style={{ height: '20px', backgroundColor: 'transparent' }} />
        </div>
      </SHomeContainer>
      <ScrollToTop />
    </SContainer>
  );
}

export default HomeRecruitment;

const HeaderWrapper = styled.section`
  width: 100%;
  margin-top: 16px;
  padding: 12px 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const LeftFilter = styled.div`
  width: auto;
  min-width: 584px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 12px;
`;

const RightFilter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ReCruitmentCardWrapper = styled.section`
  width: calc(100% + 12px);
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
`;

const StyledSquare = styled(Square)`
  flex: 1 1 calc(33.333% - 12px);
  max-width: calc(33.333% - 12px);
  padding: 20px;
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
  cursor: pointer;
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
  margin-left: 14px;
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
