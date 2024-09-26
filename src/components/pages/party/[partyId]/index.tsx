'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

import { fetchGetPartyHome } from '@/apis/party';
import { Balloon, Chip, Square, Txt } from '@/components/_atoms';
import { Tabs } from '@/components/_molecules';
import { PartyHomeTab, PartyPeopleTab, PartyRecruitmentsTab } from '@/components/features/party';
import { SContainer } from '@/styles/components';
import type { PartyHomeResponse } from '@/types/party';

type PageParams = {
  partyId: string;
};

// 파티 상태 칩
const renderPartyState = (stateTag: string) => {
  return {
    진행중: {
      fontColor: '#016110',
      backgroundColor: '#D5F0E3',
    },
    모집중: {
      fontColor: '#ef6400',
      backgroundColor: '#fff1dc',
    },
    파티종료: {
      fontColor: '#ffffff',
      backgroundColor: '#505050',
    },
  }[stateTag];
};

function PartyHome({ partyId }: PageParams) {
  const [partyHomeData, setPartyHomeData] = useState<PartyHomeResponse | null>(null);
  const [isShowCopyBalloon, setIsShowCopyBalloon] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchGetPartyHome({ partyId: Number(partyId.toString()) });
        setPartyHomeData(response);
      } catch (error) {
        console.error('Error fetching party home data:', error);
      }
    };

    fetchData();
  }, [partyId]);

  return (
    <SContainer>
      <PartyHomeContainer>
        <Square width="820px" height="614px" radiusKey="base" backgroundColor="grey300" shadowKey="none">
          <Image alt="파티 홈 이미지" src="" width={390} height={293} style={{ borderRadius: '16px' }} />
        </Square>
        <PartyContentsWrapper>
          <PartyTitleWrapper>
            <PartyTitle>
              <Txt fontSize={32} fontWeight="bold">
                {partyHomeData?.title}
              </Txt>
            </PartyTitle>
            <ChipWrapper>
              {/* 파티 모집중 칩 */}
              <Chip
                size="small"
                label={partyHomeData?.tag}
                chipType="filled"
                chipColor={renderPartyState(partyHomeData?.tag as string)?.backgroundColor}
                fontColor={renderPartyState(partyHomeData?.tag as string)?.fontColor}
                fontWeight="semibold"
                shadow="shadow1"
              />
              {/* 파티 타입 칩 */}
              <Chip
                size="small"
                label={partyHomeData?.partyType.type}
                chipType="filled"
                chipColor="#F6F6F6"
                fontColor="grey700"
                fontWeight="semibold"
                shadow="shadow1"
              />
            </ChipWrapper>
          </PartyTitleWrapper>

          <Tabs defaultIndex={0}>
            <PartyTabsWrapper>
              <Tabs.TabList>
                <Tabs.Tab index={0} width="85px">
                  홈
                </Tabs.Tab>
                <Tabs.Tab index={1} width="85px">
                  파티원
                </Tabs.Tab>
                <Tabs.Tab index={2} width="85px">
                  모집공고
                </Tabs.Tab>
              </Tabs.TabList>
              <PartyTabsButtonWrapper>
                <ShareOutlinedIcon
                  onClick={() => {
                    setIsShowCopyBalloon(true);
                    setTimeout(() => {
                      setIsShowCopyBalloon(false);
                    }, 3000); // 3초 후 자동으로 닫힘
                  }}
                  style={{ position: 'relative', cursor: 'pointer' }}
                />
                {isShowCopyBalloon && (
                  <Balloon
                    width="163px"
                    height="30px"
                    onClose={() => {
                      setIsShowCopyBalloon(false);
                    }}
                    style={{
                      position: 'absolute',
                      top: 20,
                      left: -70,
                      marginTop: '20px',
                      zIndex: 1,
                    }}
                  >
                    <Txt fontSize={14} fontColor="white">
                      URL이 복사되었어요
                    </Txt>
                  </Balloon>
                )}
                <SettingsOutlinedIcon style={{ cursor: 'pointer' }} />
              </PartyTabsButtonWrapper>
            </PartyTabsWrapper>

            <Tabs.TabPanels>
              <Tabs.TabPanel index={0}>
                <PartyHomeTab partyIntro={partyHomeData?.content} />
              </Tabs.TabPanel>
              <Tabs.TabPanel index={1}>
                <PartyPeopleTab partyId={partyId} />
              </Tabs.TabPanel>
              <Tabs.TabPanel index={2}>
                <PartyRecruitmentsTab partyId={partyId} />
              </Tabs.TabPanel>
            </Tabs.TabPanels>
          </Tabs>
        </PartyContentsWrapper>
      </PartyHomeContainer>
    </SContainer>
  );
}

export default PartyHome;

const PartyHomeContainer = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 820px;
  height: auto;
  padding-top: 52px;
`;

const PartyContentsWrapper = styled.header`
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 10;
`;

const PartyTitleWrapper = styled.div`
  display: flex;
  position: -webkit-sticky;
  position: sticky;
  top: 82px;
  border: 10px solid white;
  z-index: 10;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: white;
`;

const PartyTitle = styled.div`
  width: 497px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: 24px;
`;

const ChipWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

const PartyTabsWrapper = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 145px;
  width: 100%;
  background-color: white;
  z-index: 10;
`;

const PartyTabsButtonWrapper = styled.div`
  position: absolute;
  top: 25%;
  right: 0;
  display: flex;
  flex-direction: row;
  gap: 16px;
  background-color: white;
`;
