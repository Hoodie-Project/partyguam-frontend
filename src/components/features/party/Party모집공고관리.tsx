import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { fetchGetPartyRecruitmentsList } from '@/apis/party';
import { Chip, Txt } from '@/components/_atoms';
import { SChildContainer, SFlexColumn, SFlexRow } from '@/styles/components';
import type { PartyRecruitmentListResponse } from '@/types/party';

import PartyRecruitmentsCard from './PartyRecruitmentsCard';

function Party모집공고관리({ partyId }: { partyId: string }) {
  const router = useRouter();
  const [partyRecruitList, setPartyRecruitList] = useState<PartyRecruitmentListResponse>([]);
  const [order, setOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [recruitStatus, setRecruitStatus] = useState<string>('active');

  const fetchRecruitments = async () => {
    try {
      const requestParams: {
        partyId: number;
        sort: string;
        order: 'ASC' | 'DESC';
        status: string;
        main?: string;
      } = {
        partyId: Number(partyId),
        sort: 'createdAt',
        status: recruitStatus,
        order: order,
      };

      const data = await fetchGetPartyRecruitmentsList(requestParams);
      setPartyRecruitList(data);
    } catch (error) {
      console.error('Error fetching recruitments:', error);
    }
  };

  const getIcon = () => {
    if (order === 'DESC') {
      return <ArrowDownwardIcon style={{ width: '16px', height: '16px' }} />;
    }

    if (order === 'ASC') {
      return <ArrowUpwardIcon style={{ width: '16px', height: '16px' }} />;
    }
    return <ArrowUpwardIcon style={{ width: '16px', height: '16px' }} />;
  };

  useEffect(() => {
    fetchRecruitments();
  }, [partyId, recruitStatus, order]);

  return (
    <SChildContainer>
      <SFlexRow style={{ justifyContent: 'space-between' }}>
        <SFlexColumn>
          <Txt fontSize={20} fontWeight="bold">
            모집 공고 별 지원자
          </Txt>
          <Txt fontSize={16} fontWeight="normal">
            지원자 관리를 원하는 모집 공고를 선택해 주세요.
          </Txt>
        </SFlexColumn>

        <SFlexRow>
          <SFlexRow
            style={{
              width: '100%',
              alignItems: 'center',
              gap: '7px',
            }}
          >
            {[
              { label: '모집 중', value: 'active' },
              { label: '마감', value: 'completed' },
            ].map((item, i) => (
              <Chip
                key={i}
                chipType="outlined"
                label={item.label}
                size="small"
                chipColor={recruitStatus === item.value ? '#11C9A7' : '#E5E5EC'}
                fontColor={recruitStatus === item.value ? 'black' : '#767676'}
                fontWeight={recruitStatus === item.value ? 'semibold' : 'normal'}
                onClick={() => {
                  setRecruitStatus(item.value);
                }}
              />
            ))}
          </SFlexRow>
          <Txt
            fontWeight="semibold"
            fontSize={14}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '20px' }}
            onClick={() => setOrder(prevOrder => (prevOrder === 'ASC' ? 'DESC' : 'ASC'))}
          >
            모집일순 {getIcon()}
          </Txt>
        </SFlexRow>
      </SFlexRow>
      <RecruitmentList>
        {partyRecruitList.map((item, index) => (
          <PartyRecruitmentsCard
            isSetting
            key={item.id}
            status={item.status}
            main={item.position.main}
            sub={item.position.sub}
            createdAt={item.createdAt}
            applicationCount={item.applicationCount}
            handleClick={() =>
              router.push(
                `/party/setting/applicant/${partyId}?partyRecruitmentId=${item.id}&main=${item.position.main}&sub=${item.position.sub}&recruitStatus=${recruitStatus}`,
              )
            }
          />
        ))}
        {partyRecruitList.length === 0 && (
          <EmptyState>
            <InfoOutlinedIcon style={{ marginBottom: '6px' }} />
            <Txt fontSize={16} fontWeight="semibold" fontColor="grey400">
              지원 모집 공고가 없어요.
            </Txt>
          </EmptyState>
        )}
      </RecruitmentList>
    </SChildContainer>
  );
}

export default Party모집공고관리;

const RecruitmentList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 20px;
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
