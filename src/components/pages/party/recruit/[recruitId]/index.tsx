'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import CreateIcon from '@mui/icons-material/Create';
import ShareIcon from '@mui/icons-material/Share';

import { fetchGetPartyRecruitments } from '@/apis/party';
import { Chip, Square, Txt } from '@/components/_atoms';
import Button from '@/components/_atoms/button';
import { SContainer, SFlexColumnFull, SFlexRowFull, SMargin } from '@/styles/components';
import type { PartyRecruitDetailResponse } from '@/types/party';

type PageParams = {
  recruitId: string;
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

function PartyRecruitDetail({ recruitId }: PageParams) {
  const [partyRecruitDetailData, setPartyRecruitDetailData] = useState<PartyRecruitDetailResponse | null>(null);
  const [isShowCopyBalloon, setIsShowCopyBalloon] = useState<boolean>(false);
  const formattedDate = useMemo(() => {
    const date = new Date(partyRecruitDetailData?.createdAt as string);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  }, [partyRecruitDetailData?.createdAt]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchGetPartyRecruitments({ partyRecruitmentId: Number(recruitId.toString()) });
        console.log('response >> ', response);
        setPartyRecruitDetailData(response);
      } catch (error) {
        console.error('Error fetching party home data:', error);
      }
    };

    fetchData();
  }, [recruitId]);

  return (
    <SContainer>
      <PartyRecruitDetailContainer>
        <SFlexRowFull style={{ gap: '20px', width: '100%' }}>
          <Square
            width="400px"
            height="300px"
            radiusKey="base"
            borderColor="grey100"
            backgroundColor="white"
            shadowKey="none"
          >
            <Image alt="파티 홈 이미지" src="" width={400} height={300} style={{ borderRadius: '16px' }} />
          </Square>
          <PartyInfoContainer>
            <ChipWrapper>
              {/* 파티 모집중 칩 */}
              <Chip
                size="small"
                label={partyRecruitDetailData?.tag}
                chipType="filled"
                chipColor={renderPartyState(partyRecruitDetailData?.tag as string)?.backgroundColor}
                fontColor={renderPartyState(partyRecruitDetailData?.tag as string)?.fontColor}
                fontWeight="semibold"
                shadow="shadow1"
              />
              {/* 파티 타입 칩 */}
              <Chip
                size="small"
                label="포트폴리오"
                chipType="filled"
                chipColor="#F6F6F6"
                fontColor="grey700"
                fontWeight="semibold"
                shadow="shadow1"
              />
            </ChipWrapper>
            <Txt fontSize={24} fontWeight="bold">
              {partyRecruitDetailData?.title}
            </Txt>
            <PartyInfoWrapper>
              <PartyInfo>
                <Txt fontColor="grey500" fontSize={16}>
                  모집중
                </Txt>
                <Txt fontColor="red" fontSize={16}>
                  {partyRecruitDetailData?.recruitedCount} / {partyRecruitDetailData?.recruitingCount}
                </Txt>
              </PartyInfo>
              <PartyInfo>
                <Txt fontColor="grey500" fontSize={16}>
                  지원자
                </Txt>
                <Txt fontColor="greenDark100" fontSize={16}>
                  {partyRecruitDetailData?.applicationCount}
                </Txt>
              </PartyInfo>
              <PartyInfo>
                <Txt fontColor="grey500" fontSize={16}>
                  모집일
                </Txt>
                <Txt fontColor="black" fontSize={16}>
                  {formattedDate}
                </Txt>
              </PartyInfo>
            </PartyInfoWrapper>
            <SFlexRowFull style={{ gap: '12px', marginTop: '30px' }}>
              <Button
                backgroudColor="white"
                borderColor="grey200"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '4px',
                  width: '194px',
                  borderRadius: '12px',
                }}
              >
                <Txt fontColor="grey500" fontSize={16}>
                  편집하기
                </Txt>
                <CreateIcon style={{ color: '#999999' }} />
              </Button>
              <Button
                backgroudColor="white"
                borderColor="grey200"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '4px',
                  width: '194px',
                  borderRadius: '12px',
                }}
              >
                <Txt fontColor="grey500" fontSize={16}>
                  공유하기
                </Txt>
                <ShareIcon style={{ color: '#999999' }} />
              </Button>
            </SFlexRowFull>
          </PartyInfoContainer>
        </SFlexRowFull>

        <Divider />
        <SFlexColumnFull>
          <Txt fontSize={20} fontWeight="bold">
            모집 부분
          </Txt>
          <SMargin margin="20px 0px 0px 0px" />
          <Square
            width="100%"
            height="fit-content"
            shadowKey="shadow1"
            backgroundColor="white"
            borderColor="grey200"
            radiusKey="base"
            position="flex-start"
            style={{ padding: '28px', display: 'flex', justifyContent: 'space-between' }}
          >
            <div style={{ display: 'flex', gap: '12px', width: 'calc(50%)' }}>
              <Txt fontColor="grey500" fontSize={16}>
                인원
              </Txt>
              <Txt fontColor="black" fontWeight="semibold" fontSize={16}>
                {partyRecruitDetailData?.recruitingCount}명
              </Txt>
            </div>
            <div style={{ display: 'flex', gap: '12px', width: 'calc(50%)' }}>
              <Txt fontColor="grey500" fontSize={16}>
                포지션
              </Txt>
              <Txt fontColor="black" fontWeight="semibold" fontSize={16}>
                {partyRecruitDetailData?.main} {partyRecruitDetailData?.sub}
              </Txt>
            </div>
          </Square>
        </SFlexColumnFull>
        <SMargin margin="120px 0px 0px 0px" />
        <SFlexColumnFull>
          <Txt fontSize={20} fontWeight="bold">
            모집 공고
          </Txt>
          <SMargin margin="20px 0px 0px 0px" />
          <Square
            width="100%"
            height="fit-content"
            shadowKey="shadow1"
            backgroundColor="white"
            borderColor="grey200"
            radiusKey="base"
            position="flex-start"
            style={{ padding: '28px' }}
          >
            <Txt fontSize={16}>{partyRecruitDetailData?.content}</Txt>
          </Square>
        </SFlexColumnFull>
      </PartyRecruitDetailContainer>
      <FloatingButton>
        <Button style={{ width: '100%' }} height="l" backgroudColor="primaryGreen" radius="base" shadow="shadow1">
          <Txt fontWeight="bold" fontColor="black">
            지원하기
          </Txt>
        </Button>
      </FloatingButton>
    </SContainer>
  );
}

export default PartyRecruitDetail;

const PartyRecruitDetailContainer = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 820px;
  height: auto;
  padding-top: 52px;
`;

const ChipWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  margin-bottom: 12px;
`;

const PartyInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const PartyInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  gap: 6px;
`;

const PartyInfo = styled.div`
  display: flex;
  flex-direction: row;
  gap: 6px;
`;

const Divider = styled.div`
  margin: 52px 0px 40px 0px;
  width: 100%;
  border: 1px solid #e5e5ec;
`;

const FloatingButton = styled.div`
  position: fixed;
  bottom: 20px;
  width: 820px;
`;
