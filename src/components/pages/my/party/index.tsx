'use client';
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchGetUsersMeParties } from '@/apis/detailProfile';
import { Chip, Square, Txt } from '@/components/_atoms';
import { PageHeader } from '@/components/_molecules';
import { FloatingMenu } from '@/components/features';
import { MYPAGE_MENU } from '@/constants';
import { Divider, SContainer, SFlexRow } from '@/styles/components';

const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
const BASE_URL = isDev ? process.env.NEXT_PUBLIC_DEV_IMAGE_URL : process.env.NEXT_PUBLIC_IMAGE_URL;

function MyParty() {
  const [status, setStatus] = useState<'ALL' | 'IN_PROGRESS' | 'CLOSED'>('ALL');
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');

  const router = useRouter();
  const handleClickPartyCard = (partyId: number) => {
    router.push(`/party/${partyId}`);
  };

  const getIcon = () => {
    if (order === 'DESC') {
      return <ArrowDownwardIcon fontSize="small" />;
    }

    if (order === 'ASC') {
      return <ArrowUpwardIcon fontSize="small" />;
    }
    return <ArrowUpwardIcon fontSize="small" />;
  };

  const {
    data: myPartyList,
    hasNextPage,
    fetchNextPage,
    isFetched,
  } = useInfiniteQuery({
    queryKey: [order, status],
    queryFn: async ({ pageParam }) => {
      const res = await fetchGetUsersMeParties({
        page: pageParam as number,
        size: 10,
        sort: 'createdAt',
        order,
        partyStatus: status === 'ALL' ? undefined : status,
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

  return (
    <SContainer>
      <FloatingMenu menu={MYPAGE_MENU()} />
      <PageHeader title="내 파티" />
      <MyPartyContainer>
        <SFlexRow style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
            {[
              { label: ' 전체 ', value: 'ALL' },
              { label: '진행중', value: 'IN_PROGRESS' },
              { label: '종료', value: 'CLOSED' },
            ].map((item, i) => (
              <Chip
                key={i}
                chipType="outlined"
                label={item.label}
                size="small"
                chipColor={status === item.value ? '#11C9A7' : '#E5E5EC'}
                fontColor={status === item.value ? 'black' : '#767676'}
                fontWeight={status === item.value ? 'bold' : 'normal'}
                onClick={() => {
                  setStatus(item.value as unknown as 'ALL' | 'IN_PROGRESS' | 'CLOSED');
                }}
              />
            ))}
          </div>
          <Txt
            fontWeight="semibold"
            fontSize={14}
            fontColor="grey600"
            onClick={() => setOrder(prevOrder => (prevOrder === 'ASC' ? 'DESC' : 'ASC'))}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            참여일순 {getIcon()}
          </Txt>
        </SFlexRow>
        <PartyCardList>
          {myPartyList?.pages.flatMap(page =>
            page?.partyUsers.map(party => (
              <StyledSquare
                key={party.id}
                width="100%"
                height="333px"
                shadowKey="shadow1"
                backgroundColor="white"
                radiusKey="base"
                borderColor="grey200"
                onClick={() => handleClickPartyCard(party.party.id)}
              >
                <CardContentsWrapper>
                  <Image
                    src={party.party.image ? `${BASE_URL}/${party.party.image}` : '/images/default-party-light200.jpg'}
                    width={255}
                    height={180}
                    alt={party.party.title}
                    style={{ borderRadius: '8px', border: '1px solid #F1F1F5' }}
                  />

                  <ChipWrapper>
                    <Chip
                      chipType="filled"
                      label={party.party.partyStatus === 'IN_PROGRESS' ? '진행중' : '파티종료'}
                      size="xsmall"
                      chipColor={party.party.partyStatus === 'IN_PROGRESS' ? '#D5F0E3' : '#505050'}
                      fontColor={party.party.partyStatus === 'IN_PROGRESS' ? '#016110' : '#ffffff'}
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
          {myPartyList?.pages[0]?.total === 0 && (
            <EmptyState>
              <InfoOutlinedIcon style={{ marginBottom: '6px' }} />
              <Txt fontSize={16} fontWeight="semibold" fontColor="grey400">
                파티가 없어요.
              </Txt>
            </EmptyState>
          )}
        </PartyCardList>
        <div ref={ref} style={{ height: '20px', backgroundColor: 'transparent' }} />
      </MyPartyContainer>
    </SContainer>
  );
}

export default MyParty;

const MyPartyContainer = styled.div`
  width: 925px;
  height: 100%;
  margin-top: 110px;
`;

const PartyCardList = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 32px;
`;

const StyledSquare = styled(Square)`
  flex: 1 1 calc(33.33% - 20px);
  max-width: calc(33.33% - 20px);
  min-height: 350px; /* 최소 높이 설정 */
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

const EmptyState = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #767676;
  margin-top: 60px;
`;
