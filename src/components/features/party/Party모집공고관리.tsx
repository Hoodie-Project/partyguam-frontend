import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';

import { fetchGetPartyRecruitmentsList } from '@/apis/party';
import { Txt } from '@/components/_atoms';
import { SChildContainer } from '@/styles/components';
import type { PartyRecruitmentListResponse } from '@/types/party';

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
            key={item.partyRecruitmentId}
            main={item.main}
            sub={item.sub}
            applicationCount={item.applicationCount}
            handleClick={() =>
              router.push(
                `/party/setting/applicant/8?partyRecruitmentId=${item.partyRecruitmentId}&main=${item.main}&sub=${item.sub}`,
              )
            }
          />
        ))}
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
