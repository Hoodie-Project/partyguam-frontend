'use client';
// 파티 모집하기 페이지
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import CreateIcon from '@mui/icons-material/Create';
import ShareIcon from '@mui/icons-material/Share';

import type { UserAuthorityResponse } from '@/apis/auth';
import { fetchUserAuthority } from '@/apis/auth';
import { fetchGetPartyRecruitments } from '@/apis/party';
import { Balloon, Chip, Square, Txt } from '@/components/_atoms';
import Button from '@/components/_atoms/button';
import { LoginModal } from '@/components/features';
import { useModalContext } from '@/contexts/ModalContext';
import { useAuthStore } from '@/stores/auth';
import { useEditPartyRecruitForm } from '@/stores/party/useAddPartyRecruit';
import { SContainer, SFlexColumnFull, SFlexRowFull, SMargin } from '@/styles/components';
import type { PartyRecruitDetailResponse } from '@/types/party';
import { formatDate } from '@/utils/date';

const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
const BASE_URL = isDev ? process.env.NEXT_PUBLIC_API_DEV_HOST : process.env.NEXT_PUBLIC_API_HOST;

type PageParams = {
  recruitId: string;
};
// 페이지가 아닌 모달 안 컴포넌트로 들어갈 때의 상황을 위한 props
type PartyRecruitProps = {
  isReadOnly?: boolean;
  pageModalType?: 'ADD' | 'MODIFY';
} & PageParams;

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

function PartyRecruitDetail({ recruitId, isReadOnly, pageModalType }: PartyRecruitProps) {
  const [partyRecruitDetailData, setPartyRecruitDetailData] = useState<PartyRecruitDetailResponse | null>(null);
  const [isShowCopyBalloon, setIsShowCopyBalloon] = useState<boolean>(false);
  const [userAuthorityInfo, setUserAuthorityInfo] = useState<UserAuthorityResponse | null>(null);

  const { isLoggedIn } = useAuthStore(state => ({
    isLoggedIn: state.isLoggedIn,
  }));

  const { openModal, closeModal } = useModalContext();

  const router = useRouter();

  const searchParams = useSearchParams();
  const partyId = searchParams.get('partyId');

  const { editPartyRecruitForm } = useEditPartyRecruitForm();

  const formattedDate = useMemo(() => {
    if (!partyRecruitDetailData?.createdAt) return '';
    return formatDate(partyRecruitDetailData.createdAt);
  }, [partyRecruitDetailData?.createdAt]);

  // 일반 사용자일 경우 혹은 isReadonly가 아닐 경우 편집하기 버튼 안보이게
  const isVisible편집하기 = useMemo(
    () => !Boolean(isReadOnly) && userAuthorityInfo?.authority === 'master' && isLoggedIn,
    [isReadOnly, userAuthorityInfo, isLoggedIn],
  );
  const isDisable지원하기 = useMemo(() => Boolean(isReadOnly), [isReadOnly]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchGetPartyRecruitments({ partyRecruitmentId: Number(recruitId.toString()) });

        setPartyRecruitDetailData(response);
      } catch (error) {
        console.error('Error fetching party home data:', error);
      }
    };
    const fetchUserAuthorityInfo = async (partyId: number) => {
      try {
        const response = await fetchUserAuthority(partyId);
        setUserAuthorityInfo(response);
      } catch (err) {
        console.log('Error fetching fetchUserAuthority');
      }
    };

    fetchData();
    fetchUserAuthorityInfo(Number(partyId));
  }, [recruitId]);

  const handleClickApplyBtn = () => {
    if (isLoggedIn) {
      router.push(`/party/apply?partyId=${partyId}&recruitId=${recruitId}`);
    } else {
      openModal({ children: <LoginModal /> });
    }
  };

  return (
    <SContainer style={{ padding: isReadOnly ? '0' : 'default-padding-value' }}>
      <PartyRecruitDetailContainer isReadOnly={isReadOnly}>
        <SFlexRowFull style={{ gap: '20px', width: '100%' }}>
          <Square
            width="400px"
            height="300px"
            radiusKey="base"
            borderColor="grey100"
            backgroundColor="white"
            shadowKey="none"
          >
            <Image
              alt="파티 홈 이미지"
              src={
                partyRecruitDetailData?.party.image
                  ? `${BASE_URL}/${partyRecruitDetailData?.party.image}`
                  : '/images/guam.png'
              }
              width={400}
              height={300}
              style={{ borderRadius: '16px' }}
            />
          </Square>
          <PartyInfoContainer>
            <ChipWrapper>
              {/* 파티 모집중 칩 */}
              <Chip
                size="small"
                label={
                  !Boolean(pageModalType) && partyRecruitDetailData?.party.status === 'active' ? '진행중' : '파티종료'
                }
                chipType="filled"
                chipColor={
                  renderPartyState(partyRecruitDetailData?.party.status === 'active' ? '진행중' : '파티종료')
                    ?.backgroundColor
                }
                fontColor={
                  renderPartyState(partyRecruitDetailData?.party.status === 'active' ? '진행중' : '파티종료')?.fontColor
                }
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
              {partyRecruitDetailData?.party.title}
            </Txt>
            <PartyInfoWrapper>
              <PartyInfo>
                <Txt fontColor="grey500" fontSize={16}>
                  모집중
                </Txt>
                <Txt fontColor="red" fontSize={16}>
                  {Boolean(pageModalType) && `0 / ${editPartyRecruitForm?.recruiting_count}`}
                  {!Boolean(pageModalType) &&
                    `${partyRecruitDetailData?.recruitedCount} / ${partyRecruitDetailData?.recruitingCount}`}
                </Txt>
              </PartyInfo>
              <PartyInfo>
                <Txt fontColor="grey500" fontSize={16}>
                  지원자
                </Txt>
                <Txt fontColor="greenDark100" fontSize={16}>
                  {partyRecruitDetailData?.applicationCount}
                  {Boolean(pageModalType) && 0}
                </Txt>
              </PartyInfo>
              <PartyInfo>
                <Txt fontColor="grey500" fontSize={16}>
                  모집일
                </Txt>
                <Txt fontColor="black" fontSize={16}>
                  {!Boolean(pageModalType) && formattedDate}
                  {Boolean(pageModalType) && formatDate(String(new Date()))}
                </Txt>
              </PartyInfo>
            </PartyInfoWrapper>
            <SFlexRowFull style={{ gap: '12px', marginTop: '30px' }}>
              {isVisible편집하기 && (
                <Button
                  backgroudColor="white"
                  borderColor="grey200"
                  onClick={() =>
                    router.push(
                      `/party/setting/recruit/edit?type=MODIFY&partyId=${partyId}&recruitId=${recruitId}&main=${partyRecruitDetailData?.position.main}&sub=${partyRecruitDetailData?.position.sub}`,
                    )
                  }
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
              )}
              <Button
                backgroudColor="white"
                borderColor="grey200"
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '4px',
                  width: '194px',
                  borderRadius: '12px',
                }}
                onClick={() => {
                  setIsShowCopyBalloon(true);
                  setTimeout(() => {
                    setIsShowCopyBalloon(false);
                  }, 3000); // 3초 후 자동으로 닫힘
                }}
                disabled={Boolean(isReadOnly)}
              >
                <Txt fontColor="grey500" fontSize={16}>
                  공유하기
                </Txt>
                <ShareIcon style={{ color: '#999999' }} />
                {isShowCopyBalloon && (
                  <Balloon
                    width="163px"
                    height="30px"
                    onClose={() => {
                      setIsShowCopyBalloon(false);
                    }}
                    style={{
                      position: 'absolute',
                      top: 45,
                      left: 15,
                      marginTop: '20px',
                      zIndex: 1,
                    }}
                  >
                    <Txt fontSize={14} fontColor="white">
                      URL이 복사되었어요
                    </Txt>
                  </Balloon>
                )}
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
                {!Boolean(pageModalType) && `${partyRecruitDetailData?.recruitingCount}명`}
                {Boolean(pageModalType) && `${editPartyRecruitForm?.recruiting_count}명`}
              </Txt>
            </div>
            <div style={{ display: 'flex', gap: '12px', width: 'calc(50%)' }}>
              <Txt fontColor="grey500" fontSize={16}>
                포지션
              </Txt>
              <Txt fontColor="black" fontWeight="semibold" fontSize={16}>
                {!Boolean(pageModalType) &&
                  `${partyRecruitDetailData?.position.main} ${partyRecruitDetailData?.position.sub}`}
                {Boolean(pageModalType) && `${editPartyRecruitForm?.직군} ${editPartyRecruitForm.직무}`}
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
            <Txt fontSize={16}>
              {!Boolean(pageModalType) && `${partyRecruitDetailData?.content}`}
              {Boolean(pageModalType) && `${editPartyRecruitForm.content}`}
            </Txt>
          </Square>
        </SFlexColumnFull>
      </PartyRecruitDetailContainer>
      <FloatingButton>
        <Button
          style={{ width: '100%' }}
          height="l"
          backgroudColor="primaryGreen"
          radius="base"
          shadow="shadow1"
          onClick={handleClickApplyBtn}
          disabled={isDisable지원하기}
        >
          <Txt fontWeight="bold" fontColor="black">
            지원하기
          </Txt>
        </Button>
      </FloatingButton>
    </SContainer>
  );
}

export default PartyRecruitDetail;

const PartyRecruitDetailContainer = styled.section<{ isReadOnly?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 820px;
  height: 100vh;
  padding-top: ${({ isReadOnly }) => (isReadOnly ? '0px' : '52px')};
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
  bottom: 50px;
  width: 820px;
`;
