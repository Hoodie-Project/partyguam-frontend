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

import { fetchParties } from '@/apis/home';
import { fetchGetPartyTypes } from '@/apis/party';
import { Chip, Square, Txt } from '@/components/_atoms';
import { ScrollToTop, SearchBar, Select } from '@/components/_molecules';
import { LoginModal } from '@/components/features';
import { useModalContext } from '@/contexts/ModalContext';
import { useAuthStore } from '@/stores/auth';
import { useApplicantFilterStore } from '@/stores/home/useApplicantFilter';
import { SContainer, SHomeContainer } from '@/styles/components';
import type { Position } from '@/types/user';

const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
const BASE_URL = isDev ? process.env.NEXT_PUBLIC_DEV_IMAGE_URL : process.env.NEXT_PUBLIC_IMAGE_URL;

type ChipType = {
  id: number;
  parentLabel?: string;
  label: string;
};

export const transformPositionData = (data: Position[]): { id: number; label: string }[] => {
  return data?.map(position => ({
    id: position.id,
    label: position.sub,
  }));
};

const transformPartyTypes = (data: { id: number; type: string }[]): { id: number; label: string }[] => {
  return data?.map(item => ({
    id: item.id,
    label: item.type,
  }));
};

type OptionType = {
  id: number;
  label: string;
};

function HomeParty() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const 파티StatusOptions = [
    { id: 0, label: '진행 중', value: 'active' },
    { id: 1, label: '파티종료', value: 'archived' },
  ];
  const [파티status, set파티status] = useState<{ id: number; label: string; value: string }>({
    id: 0,
    label: '진행 중',
    value: 'active',
  });
  const [파티유형List, set파티유형List] = useState<OptionType[]>([]);
  const [search파티Value, setSearch파티Value] = useState<string>(searchParams.get('search') || '');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC'); // 등록일순
  const {
    selected파티유형Options,
    파티유형FilterChips,
    submit파티유형Filter,
    setSelected파티유형Options,
    reset파티유형FilterChip,
    set파티유형Filter,
    handleSubmit파티유형,
  } = useApplicantFilterStore();

  const [tempSelected파티유형Options, setTempSelected파티유형Options] = useState<OptionType[] | null>(
    selected파티유형Options,
  );
  const [temp파티유형FilterChips, setTemp파티유형FilterChips] = useState<ChipType[]>([]);

  const { isLoggedIn } = useAuthStore(state => ({
    isLoggedIn: state.isLoggedIn,
  }));

  const { openModal } = useModalContext();

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

  const add파티유형FilterChip = (chip: ChipType) => {
    setTemp파티유형FilterChips(prev => {
      if (chip.label === '전체') {
        return [...prev.filter(c => c.parentLabel !== chip.parentLabel), chip];
      }
      return [...prev.filter(c => !(c.parentLabel === chip.parentLabel && c.label === '전체')), chip];
    });
  };

  const remove파티유형FilterChip = (id: number) => {
    setTemp파티유형FilterChips(prev => prev.filter(chip => chip.id !== id));
  };

  const handle파티유형OptionToggle = (option: OptionType) => {
    if (option.label === '전체') {
      setTempSelected파티유형Options([option]);
      add파티유형FilterChip({ id: option.id, label: option.label });
      return;
    }

    // 이미 선택된 항목인 경우 제거
    if (tempSelected파티유형Options?.some(selected => selected.id === option.id)) {
      setTempSelected파티유형Options(tempSelected파티유형Options.filter(selected => selected.id !== option.id));
      remove파티유형FilterChip(option.id);
      return;
    }

    // 6개 이상 선택 시 제한 (현재 선택된 개수가 5개 이상일 때)
    if (tempSelected파티유형Options && tempSelected파티유형Options?.length >= 5) {
      alert('최대 5개까지 선택 가능합니다!');
      return;
    }

    // 5개 이하일 때만 추가
    setTempSelected파티유형Options([
      ...(tempSelected파티유형Options?.filter(selected => selected.label !== '전체') || []),
      option,
    ]);
    add파티유형FilterChip({ id: option.id, label: option.label });
  };

  const handle파티유형Reset = () => {
    setTempSelected파티유형Options(null);
    setTemp파티유형FilterChips([]);
    reset파티유형FilterChip();
  };

  const handleRemove파티유형FilterChip = (id: number) => {
    if (tempSelected파티유형Options?.some(selected => selected.id === id)) {
      setTempSelected파티유형Options(tempSelected파티유형Options.filter(selected => selected.id !== id));
      remove파티유형FilterChip(id);
    }
  };

  const handleSubmit파티유형Select = () => {
    set파티유형Filter(temp파티유형FilterChips);
    setSelected파티유형Options(tempSelected파티유형Options);
    handleSubmit파티유형(temp파티유형FilterChips);
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
      return <ArrowDownwardRoundedIcon style={{ width: '16px', height: '16px', marginLeft: '2px' }} />;
    }

    if (order === 'ASC') {
      return <ArrowUpwardRoundedIcon style={{ width: '16px', height: '16px', marginLeft: '2px' }} />;
    }
    return <ArrowUpwardRoundedIcon style={{ width: '16px', height: '16px', marginLeft: '2px' }} />;
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

  const handleClickPartyCard = (partyId: number) => {
    router.push(`/party/${partyId}`);
  };

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
                  { id: 1, label: '파티종료' },
                ]}
                height="xs"
                fontSize={14}
                selectStyle={{
                  borderRadius: '999px',
                  padding: '8px 12px',
                  whiteSpace: 'nowrap',
                }}
                optionStyle={{
                  position: 'absolute',
                  top: '41px',
                  left: 0,
                  width: '183px',
                  height: 'auto',
                  borderRadius: '24px',
                }}
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
                selectedOptions={tempSelected파티유형Options}
                chipData={temp파티유형FilterChips}
                handleClickReset={handle파티유형Reset}
                handleOptionToggle={handle파티유형OptionToggle}
                handleRemoveChip={handleRemove파티유형FilterChip}
                handleClickSubmit={handleSubmit파티유형Select}
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
                optionStyle={{ width: '320px', height: 'auto', borderRadius: '24px' }}
                handleOpenReset={() => {
                  setTempSelected파티유형Options(selected파티유형Options);
                  setTemp파티유형FilterChips(파티유형FilterChips);
                }}
              />
            </div>
            <div style={{ width: '400px', height: '36px' }}>
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
              }}
            >
              등록일순
              {getIcon()}
            </Txt>

            <CircleButton
              onClick={() => {
                if (isLoggedIn) {
                  router.push('/party/create');
                } else {
                  openModal({ children: <LoginModal /> });
                }
              }}
            >
              파티 생성하기 +
            </CircleButton>
          </RightFilter>
        </HeaderWrapper>

        <PartyCardList>
          {partyList?.pages.flatMap(page =>
            page?.parties.map((party, i) => (
              <StyledSquare
                key={`${party.id}_${i}`}
                width="100%"
                height="333px"
                shadowKey="shadow1"
                backgroundColor="white"
                radiusKey="base"
                borderColor="grey200"
                onClick={() => handleClickPartyCard(party.id)}
              >
                <CardContentsWrapper>
                  <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                      src={party.image ? `${BASE_URL}/${party.image}` : '/images/guam.png'}
                      width={255}
                      height={180}
                      alt={party.title}
                      style={{ borderRadius: '8px', border: '1px solid #F1F1F5' }}
                    />
                  </div>
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
                  <Txt fontSize={12} style={{ lineHeight: '140%', color: '#24CE85', marginTop: 'auto' }}>
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
                파티가 없어요.
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
  width: calc(100% + 20px);
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 32px;
`;

const StyledSquare = styled(Square)`
  flex: 1 1 1 calc(25% - 20px);
  max-width: calc(25% - 20px);
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
const CircleButton = styled.button`
  background-color: #21ecc7;
  border: 1px solid #21ecc7;
  border-radius: 999px;
  padding: 8px 12px;
  color: #000000;
  font-size: 14px;
  line-height: 1.4;
  letter-spacing: -0.025em;
  font-weight: 400;
  margin-left: 12px;
`;
