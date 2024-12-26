import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import type { UserAuthorityResponse } from '@/apis/auth';
import { fetchGetPartyUsers } from '@/apis/party';
import { Button, Txt } from '@/components/_atoms';
import { useModalContext } from '@/contexts/ModalContext';
import { useAuthStore } from '@/stores/auth';
import { SFlexColumnFull, SMargin } from '@/styles/components';
import type { PartyUserResponse } from '@/types/party';

import LoginModal from '../loginModal';

import { partyUserMockData } from './mockData';
import PartyPeopleCard from './PartyPeopleCard';

type Props = {
  partyId: string;
  userAuthority: UserAuthorityResponse | null;
};

function PartyPeopleTab({ partyId, userAuthority }: Props) {
  const [partyUserData, setPartyUserData] = useState<PartyUserResponse | null>();
  const { openModal } = useModalContext();
  const { isLoggedIn } = useAuthStore();

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
        setPartyUserData(partyUserMockData);
      }
    };
    fetchData();
  }, [partyId]);

  console.log('partyUserData > ', partyUserData);

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
        <PeopleListContainer isBlurred={!isLoggedIn}>
          {/* 관리자 유저 */}
          {partyUserData?.partyAdmin.map(item => (
            <PartyPeopleCard
              key={item.id}
              authority={item.authority as 'master' | 'deputy' | 'member' | undefined}
              position={item.position}
              user={{ id: item.id, ...item.user }}
              userAuthority={userAuthority}
            />
          ))}
          {/* 일반 유저 */}
          {partyUserData?.partyUser?.map(item => (
            <PartyPeopleCard
              key={item.id}
              authority={item.authority as 'master' | 'deputy' | 'member' | undefined}
              position={item.position}
              user={{ id: item.id, ...item.user }}
              userAuthority={userAuthority}
            />
          ))}
        </PeopleListContainer>
      </SFlexColumnFull>
      {!isLoggedIn && (
        <FloatingButton>
          <Button
            style={{ width: '100%' }}
            height="l"
            backgroudColor="primaryGreen"
            radius="base"
            shadow="shadow1"
            onClick={() => openModal({ children: <LoginModal /> })}
          >
            <Txt fontWeight="bold" fontColor="black">
              로그인하고 확인하세요!
            </Txt>
          </Button>
        </FloatingButton>
      )}
    </PartyPeopleTabContainer>
  );
}

export default PartyPeopleTab;

const PartyPeopleTabContainer = styled.section`
  height: 100%;
`;

const PeopleListContainer = styled.div<{ isBlurred: boolean }>`
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  margin-right: -10px;
  filter: ${({ isBlurred }) => (isBlurred ? 'blur(5px)' : 'none')};
  pointer-events: ${({ isBlurred }) => (isBlurred ? 'none' : 'auto')};

  & > div {
    width: calc(50% - 15px);
    margin-bottom: 12px;
    margin-right: 20px;
  }

  & > div:nth-of-type(2n) {
    margin-right: 0;
  }
`;

const FloatingButton = styled.div`
  position: fixed;
  bottom: 50px;
  width: 820px;
`;
