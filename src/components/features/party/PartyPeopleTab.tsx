import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import type { UserAuthorityResponse } from '@/apis/join';
import { fetchGetPartyUsers } from '@/apis/party';
import { Txt } from '@/components/_atoms';
import { SFlexColumnFull, SMargin } from '@/styles/components';
import type { PartyUserResponse } from '@/types/party';

import PartyPeopleCard from './PartyPeopleCard';

type Props = {
  partyId: string;
  userAuthority: UserAuthorityResponse | null;
};

function PartyPeopleTab({ partyId, userAuthority }: Props) {
  const [partyUserData, setPartyUserData] = useState<PartyUserResponse | null>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchGetPartyUsers({
          partyId: Number(partyId.toString()),
          page: 1,
          limit: 16,
          sort: 'createdAt',
          order: 'DESC',
        });
        setPartyUserData(response);
      } catch (error) {
        console.error('Error fetching party user data : ', error);
      }
    };
    fetchData();
  }, [partyId]);

  return (
    <PartyPeopleTabContainer>
      <SMargin margin="35px 0px 0px 0px" />
      <SFlexColumnFull>
        <Txt fontSize={20} fontWeight="bold">
          파티원
          <Txt fontColor="greenDark100" fontSize={20} fontWeight="bold" style={{ marginLeft: '4px' }}>
            {partyUserData?.partyUser.length != null || partyUserData?.partyAdmin.length != null
              ? partyUserData?.partyUser.length + partyUserData?.partyAdmin.length
              : 0}
          </Txt>
        </Txt>
        <SMargin margin="20px 0px 0px 0px" />
        <PeopleListContainer>
          {/* 관리자 유저 */}
          {partyUserData?.partyAdmin.map(item => (
            <PartyPeopleCard
              key={item.user.id}
              authority={item.authority as 'master' | 'deputy' | 'member' | undefined}
              position={item.position}
              user={item.user}
              userAuthority={userAuthority}
            />
          ))}
          {/* 일반 유저 */}
          {partyUserData?.partyUser?.map(item => (
            <PartyPeopleCard
              key={item.user.id}
              authority={item.authority as 'master' | 'deputy' | 'member' | undefined}
              position={item.position}
              user={item.user}
              userAuthority={userAuthority}
            />
          ))}
        </PeopleListContainer>
      </SFlexColumnFull>
    </PartyPeopleTabContainer>
  );
}

export default PartyPeopleTab;

const PartyPeopleTabContainer = styled.section`
  height: 100%;
`;

const PeopleListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  margin-right: -10px;

  & > div {
    width: calc(50% - 15px);
    margin-bottom: 12px;
    margin-right: 20px;
  }

  & > div:nth-of-type(2n) {
    margin-right: 0;
  }
`;
