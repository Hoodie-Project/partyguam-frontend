'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import styled from '@emotion/styled';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchPartyRecruitments } from '@/apis/home';
import { fetchGetPartyTypes, fetchGetPositions } from '@/apis/party';
import { Chip, Square, Txt } from '@/components/_atoms';
import { ScrollToTop, SearchBar, Select } from '@/components/_molecules';
import { useApplicantFilterStore } from '@/stores/home/useApplicantFilter';
import { SContainer, SHomeContainer } from '@/styles/components';
import type { Position } from '@/types/user';

export const transformPositionData = (data: Position[]): { id: number; label: string }[] => {
  return data.map(position => ({
    id: position.id,
    label: position.sub,
  }));
};

const transformPartyTypes = (data: { id: number; type: string }[]): { id: number; label: string }[] => {
  return data.map(item => ({
    id: item.id,
    label: item.type,
  }));
};

type OptionType = {
  id: number;
  label: string;
};

function HomeRecruitment() {
  const [파티유형List, set파티유형List] = useState<OptionType[]>([]);
  const [positionList, setPositionList] = useState<OptionType[]>([]);
  const [search모집공고Value, setSearch모집공고Value] = useState<string>('');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC'); // 등록일순
  const {
    selected직무ParentOptions,
    selected직무Options,
    selected파티유형Options,
    직무FilterChips,
    파티유형FilterChips,
    submit직무Main,
    submit직무Position,
    submit파티유형Filter,
    setSelected직무ParentOptions,
    setSelected직무Options,
    setSelected파티유형Options,
    add직무FilterChip,
    remove직무FilterChip,
    reset직무FilterChip,
    add파티유형FilterChip,
    remove파티유형FilterChip,
    reset파티유형FilterChip,
    handleSubmit직무,
    handleSubmit파티유형,
  } = useApplicantFilterStore();

  useEffect(() => {
    (async () => {
      const response = await fetchGetPartyTypes();
      set파티유형List(transformPartyTypes(response));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const response = await fetchGetPositions(selected직무ParentOptions?.[0]?.label || '');
      setPositionList([
        { id: Math.floor(Math.random() * 100) + 35, label: '전체' },
        ...transformPositionData(response),
      ]);
    })();
  }, [selected직무ParentOptions]);

  const handleParentOptionSelect = (parentOption: OptionType) => {
    if (selected직무ParentOptions?.[0]?.id === parentOption.id) {
      setSelected직무ParentOptions(null); // 같은 옵션 클릭 시 선택 해제
    } else {
      setSelected직무ParentOptions([parentOption]); // 다른 옵션 선택 시 해당 옵션으로 교체
    }
  };

  const handle직무OptionToggle = (option: OptionType) => {
    if (selected직무ParentOptions && selected직무ParentOptions.length > 0) {
      const parentLabel = selected직무ParentOptions[0].label;

      if (option.label === '전체') {
        setSelected직무Options([option]);
        add직무FilterChip({ id: option.id, parentLabel, label: option.label });
      } else {
        if (selected직무Options?.some(selected => selected.id === option.id)) {
          setSelected직무Options(selected직무Options.filter(selected => selected.id !== option.id));
          remove직무FilterChip(option.id);
        } else {
          if (selected직무Options?.length && selected직무Options?.length >= 5) {
            // TODO. 선택 갯수 기획
            alert('5개까지만 선택이 가능합니다.');
          } else {
            setSelected직무Options([
              ...(selected직무Options?.filter(selected => selected.label !== '전체') || []),
              option,
            ]);
            add직무FilterChip({ id: option.id, parentLabel, label: option.label });
          }
        }
      }
    }
  };

  const handle파티유형OptionToggle = (option: OptionType) => {
    if (option.label === '전체') {
      setSelected파티유형Options([option]);
      add파티유형FilterChip({ id: option.id, label: option.label });
    } else {
      if (selected파티유형Options?.some(selected => selected.id === option.id)) {
        setSelected파티유형Options(selected파티유형Options.filter(selected => selected.id !== option.id));
        remove파티유형FilterChip(option.id);
      } else {
        if (selected파티유형Options?.length && selected파티유형Options?.length >= 5) {
          // TODO. 선택 갯수 기획
          alert('5개까지만 선택이 가능합니다.');
        } else {
          setSelected파티유형Options([
            ...(selected파티유형Options?.filter(selected => selected.label !== '전체') || []),
            option,
          ]);
          add파티유형FilterChip({ id: option.id, label: option.label });
        }
      }
    }
  };

  const handleRemove직무FilterChip = (id: number) => {
    if (selected직무Options?.some(selected => selected.id === id)) {
      setSelected직무Options(selected직무Options.filter(selected => selected.id !== id));
      remove직무FilterChip(id);
    }
  };

  const handleRemove파티유형FilterChip = (id: number) => {
    if (selected파티유형Options?.some(selected => selected.id === id)) {
      setSelected파티유형Options(selected파티유형Options.filter(selected => selected.id !== id));
      remove파티유형FilterChip(id);
    }
  };

  const handle직무Reset = () => {
    setSelected직무Options(null);
    reset직무FilterChip();
    setSelected직무ParentOptions([{ id: 0, label: '기획자' }]);
  };

  const handle파티유형Reset = () => {
    setSelected파티유형Options(null);
    reset파티유형FilterChip();
  };

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
      return <ArrowDownwardRoundedIcon fontSize="small" />;
    }

    if (order === 'ASC') {
      return <ArrowUpwardRoundedIcon fontSize="small" />;
    }
    return <ArrowUpwardRoundedIcon fontSize="small" />;
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
      // partyTypeFilter: submit파티유형Filter,
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

  return (
    <SContainer>
      <SHomeContainer>
        <Txt fontWeight="bold" fontSize={32}>
          모집공고
        </Txt>
        <HeaderWrapper>
          <LeftFilter>
            <div style={{ width: 'auto', minWidth: '67px' }}>
              <Select
                optionsType="multi"
                value={
                  직무FilterChips && 직무FilterChips.length > 0
                    ? 직무FilterChips.length > 1 && 직무FilterChips[0].parentLabel != null
                      ? `${직무FilterChips[0].parentLabel} ${직무FilterChips[0].label} 외 ${직무FilterChips.length - 1}`
                      : `${직무FilterChips[0].parentLabel || ''} ${직무FilterChips[0].label}`
                    : undefined
                }
                parentOptions={[
                  { id: 0, label: '기획자' },
                  { id: 1, label: '디자이너' },
                  { id: 2, label: '개발자' },
                  { id: 3, label: '마케터/광고' },
                ]}
                options={positionList}
                selectedParentOptions={selected직무ParentOptions}
                handleParentOptionSelect={handleParentOptionSelect}
                selectedOptions={selected직무Options}
                chipData={직무FilterChips}
                handleClickReset={handle직무Reset}
                handleOptionToggle={handle직무OptionToggle}
                handleClickSubmit={handleSubmit직무}
                handleRemoveChip={handleRemove직무FilterChip}
                height="xs"
                placeholder="직무"
                fontSize={14}
                selectStyle={{
                  borderRadius: '999px',
                  padding: '8px 12px',
                  whiteSpace: 'nowrap',
                }}
                optionStyle={{ width: '400px', height: 'auto' }}
              />
            </div>
            <div style={{ width: 'auto', minWidth: '67px' }}>
              <Select
                optionsType="multi"
                value={
                  파티유형FilterChips && 파티유형FilterChips.length > 1
                    ? `${파티유형FilterChips[0].label} 외 ${파티유형FilterChips.length - 1}`
                    : 파티유형FilterChips[0]?.label || undefined
                }
                options={파티유형List}
                selectedOptions={selected파티유형Options}
                chipData={파티유형FilterChips}
                handleClickReset={handle파티유형Reset}
                handleOptionToggle={handle파티유형OptionToggle}
                handleRemoveChip={handleRemove파티유형FilterChip}
                handleClickSubmit={handleSubmit파티유형}
                height="xs"
                placeholder="파티유형"
                fontSize={14}
                selectStyle={{
                  borderRadius: '999px',
                  padding: '8px 12px',
                  width: 'auto',
                  minWidth: '93px',
                  whiteSpace: 'nowrap',
                }}
                optionStyle={{ width: '320px', height: 'auto' }}
              />
            </div>
            <div style={{ width: '400px' }}>
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
                marginTop: '2px',
                marginRight: '3px',
              }}
            >
              등록일순
            </Txt>
            {getIcon()}
          </RightFilter>
        </HeaderWrapper>
        <ReCruitmentCardWrapper>
          {partyRecruitmentList?.pages.flatMap(page =>
            page?.partyRecruitments.map(recruitment => (
              <StyledSquare
                key={recruitment.id}
                width="100%"
                height="160px"
                shadowKey="shadow1"
                backgroundColor="white"
                radiusKey="base"
                borderColor="grey200"
              >
                <CardContentsWrapper>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_DEV_HOST}/${recruitment.party.image}`}
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
                        {recruitment.status === 'active' ? '모집중' : '종료'}
                      </Txt>

                      <Txt fontSize={12} color="failRed" style={{ color: '#DC0000', lineHeight: '140%' }}>
                        {recruitment.recruitingCount} / {recruitment.recruitedCount}
                      </Txt>
                    </RecruitsCount>
                  </CardRightWrapper>
                </CardContentsWrapper>
              </StyledSquare>
            )),
          )}
        </ReCruitmentCardWrapper>

        <div ref={ref} style={{ height: '20px', backgroundColor: 'transparent' }} />
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
