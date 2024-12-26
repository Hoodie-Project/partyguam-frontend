import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';

import { fetchGetPartyRecruitmentsList } from '@/apis/party';
import { Txt } from '@/components/_atoms';
import { SChildContainer } from '@/styles/components';
import type { PartyRecruitmentListResponse } from '@/types/party';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import PartyRecruitmentsCard from './PartyRecruitmentsCard';

function Party모집공고관리({ partyId }: { partyId: string }) {
  const router = useRouter();
  const [partyRecruitList, setPartyRecruitList] = useState<PartyRecruitmentListResponse>([]);

  const fetchRecruitments = async () => {
    try {
      const requestParams: {
        partyId: number;
        sort: string;
        order: 'ASC' | 'DESC';
        main?: string;
      } = {
        partyId: Number(partyId),
        sort: 'createdAt',
        order: 'ASC',
      };

      const data = await fetchGetPartyRecruitmentsList(requestParams);
      setPartyRecruitList(data);
    } catch (error) {
      console.error('Error fetching recruitments:', error);
    }
  };

  useEffect(() => {
    fetchRecruitments();
  }, [partyId]);

  return (
    <SChildContainer>
      <Txt fontSize={20} fontWeight="bold">
        모집 공고 별 지원자
      </Txt>
      <Txt fontSize={16} fontWeight="normal">
        지원자 관리를 원하는 모집 공고를 선택해 주세요.
      </Txt>

      <RecruitmentList>
        {partyRecruitList.map((item, index) => (
          <PartyRecruitmentsCard
            key={item.id}
            main={item.position.main}
            sub={item.position.sub}
            applicationCount={item.applicationCount}
            handleClick={() =>
              router.push(
                `/party/setting/applicant/8?partyRecruitmentId=${item.id}&main=${item.position.main}&sub=${item.position.sub}`,
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
