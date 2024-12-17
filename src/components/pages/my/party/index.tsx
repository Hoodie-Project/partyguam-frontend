'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { Chip, Square, Txt } from '@/components/_atoms';
import { PageHeader } from '@/components/_molecules';
import { FloatingMenu } from '@/components/features';
import { MYPAGE_MENU } from '@/constants';
import { SContainer, SFlexRow } from '@/styles/components';

import { MyPartyMockData } from './myPartyMockData';

function MyParty() {
  const [status, setStatus] = useState<'all' | 'active' | 'archived'>('all');
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

  return (
    <SContainer>
      <FloatingMenu menu={MYPAGE_MENU()} />
      <PageHeader title="내 파티" />
      <MyPartyContainer>
        <SFlexRow style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
            {[
              { label: ' 전체 ', value: 'all' },
              { label: '진행중', value: 'active' },
              { label: '종료', value: 'archived' },
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
                  setStatus(item.value as unknown as 'all' | 'active' | 'archived');
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
          {/* {partyList?.pages.flatMap(page => */}
          {MyPartyMockData.partyUsers.map(party => (
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
                  src={`${process.env.NEXT_PUBLIC_API_DEV_HOST}/${party.party.image}`}
                  width={255}
                  height={180}
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
                <Txt fontSize={14} style={{ lineHeight: '140%', marginTop: 'auto' }}>
                  {party.position.main} | {party.position.sub}
                </Txt>
              </CardContentsWrapper>
            </StyledSquare>
          ))}
          {/* )} */}
          {/* {partyList?.pages[0]?.total === 0 && ( */}
          {MyPartyMockData.total === 0 && (
            <EmptyState>
              <InfoOutlinedIcon style={{ marginBottom: '6px' }} />
              <Txt fontSize={16} fontWeight="semibold" fontColor="grey400">
                파티가 없습니다.
              </Txt>
            </EmptyState>
          )}{' '}
        </PartyCardList>
      </MyPartyContainer>
    </SContainer>
  );
}

export default MyParty;

const MyPartyContainer = styled.div`
  width: 925px;
  height: auto;
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

const CircleButton = styled.button`
  background-color: #21ecc7;
  border: 1px solid #21ecc7;
  border-radius: 999px;
  padding: 8px 12px;
  color: #000000;
  font-size: 14px;
  font-weight: 600;
  margin-left: 12px;
`;
