'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import styled from '@emotion/styled';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import { useInfiniteQuery } from '@tanstack/react-query';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { fetchParties } from '@/apis/home';
import { fetchGetPartyTypes } from '@/apis/party';
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

function HomeParty() {
  const 파티StatusOptions = [
    { id: 0, label: '진행 중', value: 'active' },
    { id: 1, label: '종료', value: 'archived' },
  ];
  const [파티status, set파티status] = useState<{ id: number; label: string; value: string }>({
    id: 0,
    label: '진행 중',
    value: 'active',
  });
  const [파티유형List, set파티유형List] = useState<OptionType[]>([]);
  const [search파티Value, setSearch파티Value] = useState<string>('');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC'); // 등록일순
  const {
    selected파티유형Options,
    파티유형FilterChips,
    submit파티유형Filter,
    setSelected파티유형Options,
    add파티유형FilterChip,
    remove파티유형FilterChip,
    reset파티유형FilterChip,
    handleSubmit파티유형,
  } = useApplicantFilterStore();

  useEffect(() => {
    (async () => {
      const response = await fetchGetPartyTypes();
      set파티유형List(transformPartyTypes(response));
    })();
  }, []);

  const handle파티StatusChange = (e: React.MouseEvent<HTMLLIElement>, id: number) => {
    const selectedStatus = 파티StatusOptions.find(option => option.id === id);
    if (selectedStatus) {
      set파티status(selectedStatus);
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

  const handleRemove파티유형FilterChip = (id: number) => {
    if (selected파티유형Options?.some(selected => selected.id === id)) {
      setSelected파티유형Options(selected파티유형Options.filter(selected => selected.id !== id));
      remove파티유형FilterChip(id);
    }
  };

  const handle파티유형Reset = () => {
    setSelected파티유형Options(null);
    reset파티유형FilterChip();
  };

  // 닉네임 검색
  const handleChange파티Search = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch파티Value(e.target.value);
  };

  const handleKeyDown파티Search = async (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  // [GET] 파티 목록 조회
  const fetchPartyList = async ({ pageParam = 1 }) => {
    const response = await fetchParties({
      page: pageParam,
      limit: 10,
      sort: 'createdAt',
      order,
      status: 파티status.value,
      partyType: submit파티유형Filter.map(Number),
      titleSearch: search파티Value,
    });
    return response;
  };

  // 무한스크롤
  const {
    data: partyList,
    hasNextPage,
    fetchNextPage,
    isFetched,
  } = useInfiniteQuery({
    queryKey: ['party', 파티status, submit파티유형Filter, search파티Value, order],
    queryFn: fetchPartyList,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetchedItems = allPages.flatMap(page => page?.parties).length;

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
          파티
        </Txt>
        <HeaderWrapper>
          <LeftFilter>
            <div style={{ width: 'auto', minWidth: '67px' }}>
              <Select
                placeholder="파티 상태"
                options={[
                  { id: 0, label: '진행 중' },
                  { id: 1, label: '종료' },
                ]}
                height="xs"
                fontSize={14}
                selectStyle={{
                  borderRadius: '999px',
                  padding: '8px 12px',
                  whiteSpace: 'nowrap',
                }}
                optionStyle={{ position: 'absolute', top: '46px', left: 0, width: '320px', height: 'auto' }}
                value={파티status.label}
                onClick={handle파티StatusChange}
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
                placeholder="찾고 싶은 파티 이름을 입력하세요."
                value={search파티Value}
                onChange={handleChange파티Search}
                onKeyDown={handleKeyDown파티Search}
                onClear={async () => {
                  setSearch파티Value('');
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
        <PartyCardList>
          {partyList?.pages.flatMap(page =>
            page?.parties.map(party => (
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
                    src={`${process.env.NEXT_PUBLIC_API_DEV_HOST}/${party.image}`}
                    width={255}
                    height={180}
                    alt={party.title}
                    style={{ borderRadius: '8px', border: '1px solid #F1F1F5' }}
                  />

                  <ChipWrapper>
                    <Chip
                      chipType="filled"
                      label={party.tag}
                      size="xsmall"
                      chipColor={party.tag === '진행중' ? '#D5F0E3' : '#F6F6F6'}
                      fontColor={party.tag === '진행중' ? '#016110' : 'grey700'}
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
            )),
          )}
          {partyList?.pages[0]?.total === 0 && (
            <EmptyState>
              <InfoOutlinedIcon style={{ marginBottom: '6px' }} />
              <Txt fontSize={16} fontWeight="semibold" fontColor="grey400">
                파티가 없습니다.
              </Txt>
            </EmptyState>
          )}
        </PartyCardList>

        <div ref={ref} style={{ height: '20px', backgroundColor: 'transparent' }} />
      </SHomeContainer>
      <ScrollToTop />
    </SContainer>
  );
}

export default HomeParty;

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

const PartyCardList = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 32px;
`;

const StyledSquare = styled(Square)`
  flex: 1 1 1 calc(25% - 20px);
  max-width: calc(25% - 20px);
  height: auto;
  padding: 16px;
  display: flex;
  box-sizing: border-box;
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
