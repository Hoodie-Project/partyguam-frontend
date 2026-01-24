/* eslint-disable prettier/prettier */
import React, { Fragment, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { Body, Cell, Header, HeaderCell, HeaderRow, Row, Table } from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';
import { useInfiniteQuery } from '@tanstack/react-query';

import {
  fetchAdminApprovePartyApplication,
  fetchAdminRejectPartyApplication,
  fetchGetPartyRecruitmentApplications,
} from '@/apis/application/admin';
import { Balloon, Chip, Txt } from '@/components/_atoms';
import { BreadCrumb, ProfileImage } from '@/components/_molecules';
import { ConfirmModal } from '@/components/features';
import { PARTY_APPLICANTS_STATUS } from '@/constants';
import { useModalContext } from '@/contexts/ModalContext';
import { SChildContainer } from '@/styles/components';
import type { PartyApplicationUser } from '@/types/party';
import { formatRelativeTime } from '@/utils/date';

function Party모집공고별지원자관리({ partyId }: { partyId: string }) {
  const [isShowBalloon, setIsShowBalloon] = useState(false);
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [status, setStatus] = useState<'ALL' | 'PROCESSING' | 'APPROVED' | 'PENDING' | 'REJECTED'>('ALL');
  const [expand지원서, setExpand지원서] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const partyRecruitmentId = searchParams.get('partyRecruitmentId');
  const mainPosition = searchParams.get('main');
  const subPosition = searchParams.get('sub');
  const recruitStatus = searchParams.get('recruitStatus');
  const { openModal, closeModal } = useModalContext();
  const router = useRouter();

  // [GET] 포지션 모집 공고별 지원자 조회
  const {
    data: partyRecruitmentApplications,
    hasNextPage,
    fetchNextPage,
    isFetched,
  } = useInfiniteQuery({
    queryKey: [partyId, order, status, partyRecruitmentId, mainPosition, subPosition],
    queryFn: async ({ pageParam }) => {
      const refinedStatus = status === 'ALL' ? undefined : status;

      const res = await fetchGetPartyRecruitmentApplications({
        partyId: Number(partyId),
        partyRecruitmentId: Number(partyRecruitmentId),
        page: pageParam as number,
        size: 10,
        sort: 'createdAt',
        order,
        applicationStatus: refinedStatus,
      });

      return res;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetchedItems = allPages.flatMap(page => page.applications).length;

      if (totalFetchedItems < lastPage.total) {
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

  // 모든 페이지의 데이터를 단일 배열로 처리
  const partyRecruitmentApplicationsWithId = useMemo(() => {
    if (isFetched && partyRecruitmentApplications) {
      return partyRecruitmentApplications.pages.flatMap(page =>
        page?.applications
          ? page.applications.map(item => ({
              ...item,
              id: item.id,
            }))
          : [],
      );
    }
    return [];
  }, [partyRecruitmentApplications, isFetched]);

  console.log('partyRecruitmentApplicationsWithId > ', partyRecruitmentApplicationsWithId);

  const getIcon = () => {
    if (order === 'DESC') {
      return <ArrowDownwardIcon fontSize="small" />;
    }

    if (order === 'ASC') {
      return <ArrowUpwardIcon fontSize="small" />;
    }
    return <ArrowUpwardIcon fontSize="small" />;
  };

  const theme = useTheme({
    Table: `
      --data-table-library_grid-template-columns: 35% repeat(3, minmax(0, 1fr));
    `,
  });

  const handleClickAcceptBtn = (type: '거절' | '수락') => {
    openModal({
      children: (
        <>
          {type == '거절' && (
            <ConfirmModal
              style={{ width: '400px' }}
              modalTitle="지원서를 거절했어요."
              modalContents={<>이 지원자는 프로젝트에 참여할 수 없어요.</>}
              submitBtnTxt="닫기"
            />
          )}
          {type == '수락' && (
            <ConfirmModal
              style={{ width: '400px' }}
              modalTitle="지원자를 수락했어요."
              modalContents={<>지원자가 합류를 결정하면 파티 활동을 시작할 수 있어요.</>}
              submitBtnTxt="닫기"
            />
          )}
        </>
      ),
      onCancel: () => {
        closeModal();
        window.location.reload();
      },
      onSubmit: () => {
        closeModal();
        window.location.reload();
      },
    });
  };

  return (
    <SChildContainer>
      <BreadCrumb contents={['모집 관리', '지원자 관리', `${mainPosition} ${subPosition}`]} />
      <TitleContainer>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: 'auto' }}>
          <Txt fontSize={20} fontWeight="bold">
            {mainPosition} {subPosition}
          </Txt>
          <Txt fontSize={20} fontWeight="bold" fontColor="greenDark100" style={{ marginLeft: '8px' }}>
            {/* partyRecruitmentApplications와 첫 번째 페이지가 존재할 때만 total 값 출력 */}
            {(isFetched && partyRecruitmentApplications?.pages[0]?.total) ?? 0}
          </Txt>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '7px', marginTop: '12px' }}>
          {[
            { label: ' 전체 ', value: 'ALL' },
            { label: '검토중', value: 'PENDING' },
            { label: ' 수락 ', value: 'APPROVED' },
            { label: '응답대기', value: 'PROCESSING' },
            { label: ' 거절 ', value: 'REJECTED' },
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
                setStatus(item.value as unknown as 'PROCESSING' | 'APPROVED' | 'PENDING' | 'REJECTED');
              }}
            />
          ))}
        </div>
      </TitleContainer>
      {/* 테이블 컴포넌트 */}
      <Table
        data={{ nodes: partyRecruitmentApplicationsWithId ?? [] }}
        theme={theme}
        layout={{ custom: true }}
        style={{
          width: '100%',
          minHeight: '116px',
          height: 'auto',
          zIndex: 0,
          marginTop: '32px',
          marginBottom: '20px',
        }}
      >
        {(tableList: PartyApplicationUser[]) => (
          <>
            <Header>
              <HeaderRow>
                <StyledHeaderCell style={{ borderRadius: '20px 0px 0px 0px' }}>
                  <Txt fontWeight="normal" fontSize={14} fontColor="grey600">
                    닉네임
                  </Txt>
                </StyledHeaderCell>
                <StyledHeaderCell
                  onClick={() => setOrder(prevOrder => (prevOrder === 'ASC' ? 'DESC' : 'ASC'))}
                  style={{ cursor: 'pointer' }}
                >
                  <Txt
                    fontWeight="semibold"
                    fontSize={14}
                    fontColor="grey600"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    지원일 {getIcon()}
                  </Txt>
                </StyledHeaderCell>
                <StyledHeaderCell>
                  <Txt
                    fontWeight="normal"
                    fontSize={14}
                    fontColor="grey600"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    상태
                    <HelpOutlineRoundedIcon
                      onClick={() => setIsShowBalloon(true)}
                      fontSize="small"
                      style={{ marginLeft: '2px', marginBottom: '2px', color: '#999999' }}
                    />
                    {isShowBalloon ? (
                      <Balloon
                        width="321px"
                        onClose={() => {
                          setIsShowBalloon(false);
                        }}
                        style={{
                          position: 'fixed',
                          top: '310px',
                          padding: '20px',
                          transform: 'translate(12px, 0px)',
                          marginTop: '50px',
                          zIndex: 999,
                          borderRadius: '12px',
                          textAlign: 'start',
                        }}
                        iconStyle={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          width: '12px',
                          height: '12px',
                          cursor: 'pointer',
                          fill: 'white',
                          marginLeft: '4px',
                          zIndex: 10,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column' }}>
                          <div style={{ width: '100%', textAlign: 'start', marginBottom: '12px' }}>
                            <Txt fontSize={16} fontColor="primaryGreen" fontWeight="semibold">
                              상태
                            </Txt>
                            <Txt fontSize={16} fontColor="white" fontWeight="semibold">
                              에 대해 알려드릴게요
                            </Txt>
                          </div>
                          <Txt fontSize={14} fontColor="white" style={{ lineHeight: '140%' }}>
                            검토중 : 지원서 확인 전이에요.
                            <br />
                            응답대기 : 파티장 수락 후, 지원자의 수락을 기다려요.
                            <br />
                            수락 : 파티장과 지원자 모두 수락했어요.
                            <br />
                            거절 : 파티장 또는 지원자가 거절했어요.
                          </Txt>
                          <Txt
                            fontSize={14}
                            fontColor="greenLight100"
                            style={{ width: '100%', textAlign: 'start', marginTop: '20px' }}
                          >
                            일주일 이내 상대방이 수락하지 않으면 거절됩니다
                          </Txt>
                        </div>
                      </Balloon>
                    ) : (
                      <></>
                    )}
                  </Txt>
                </StyledHeaderCell>
                <StyledHeaderCell style={{ borderRadius: '0px 20px 0px 0px', zIndex: 0 }}>
                  <Txt fontWeight="normal" fontSize={14} fontColor="grey600">
                    지원서
                  </Txt>
                </StyledHeaderCell>
              </HeaderRow>
            </Header>

            <Body>
              {tableList.map((item: PartyApplicationUser) => (
                <Fragment key={`${item.id}_${item.user.id}`}>
                  <Row item={item}>
                    <StyledCell isExpend={expand지원서 === item.id}>
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          paddingLeft: '60px',
                          gap: '8px',
                        }}
                      >
                        <ProfileImage imageUrl={item.user.image || ''} size={40} />
                        <Txt
                          fontWeight="normal"
                          fontSize={14}
                          style={{
                            textAlign: 'start',
                            width: '100%',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            marginLeft: '8px',
                          }}
                        >
                          {item.user.nickname}
                        </Txt>
                      </div>
                    </StyledCell>
                    <StyledCell isExpend={expand지원서 === item.id}>
                      <Txt fontWeight="normal" fontSize={14} fontColor={formatRelativeTime(item.createdAt).color}>
                        {formatRelativeTime(item.createdAt).label}
                      </Txt>
                    </StyledCell>
                    <StyledCell isExpend={expand지원서 === item.id}>
                      <Txt
                        fontWeight="semibold"
                        fontSize={14}
                        style={{ color: `${PARTY_APPLICANTS_STATUS(item.applicationStatus)?.color}` }}
                      >
                        {PARTY_APPLICANTS_STATUS(item.applicationStatus)?.label}
                      </Txt>
                    </StyledCell>
                    <StyledCell isExpend={expand지원서 === item.id}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircleButton onClick={() => setExpand지원서(prevId => (prevId === item.id ? null : item.id))}>
                          지원서 보기
                          {expand지원서 === item.id ? (
                            <ExpandLessRoundedIcon fontSize="small" style={{ marginLeft: '4px' }} />
                          ) : (
                            <ExpandMoreRoundedIcon fontSize="small" style={{ marginLeft: '4px' }} />
                          )}
                        </CircleButton>
                      </div>
                    </StyledCell>
                  </Row>
                  {expand지원서 === item.id && (
                    <Row item={item}>
                      <Styled지원서Cell gridColumnStart={1} gridColumnEnd={5}>
                        <Styled지원서TxtBox>{item.message}</Styled지원서TxtBox>
                        {item.applicationStatus === 'PENDING' && recruitStatus === 'active' && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              gap: '12px',
                              justifyContent: 'flex-end',
                              marginTop: '12px',
                              marginBottom: '5px',
                            }}
                          >
                            <SquareButton
                              isAccept={false}
                              onClick={async () => {
                                try {
                                  const res = fetchAdminRejectPartyApplication({
                                    partyId: Number(partyId),
                                    partyApplicationId: item.id,
                                  });

                                  handleClickAcceptBtn('거절');
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                            >
                              거절하기
                            </SquareButton>
                            <SquareButton
                              isAccept={true}
                              onClick={async () => {
                                try {
                                  const res = fetchAdminApprovePartyApplication({
                                    partyId: Number(partyId),
                                    partyApplicationId: item.id,
                                  });

                                  handleClickAcceptBtn('수락');
                                } catch (err) {
                                  console.error(err);
                                }
                              }}
                            >
                              수락하기
                            </SquareButton>
                          </div>
                        )}
                      </Styled지원서Cell>
                    </Row>
                  )}
                </Fragment>
              ))}
            </Body>
          </>
        )}
      </Table>
      <div ref={ref} style={{ height: '20px', backgroundColor: 'transparent' }} />
    </SChildContainer>
  );
}

export default Party모집공고별지원자관리;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`;

const StyledHeaderCell = styled(HeaderCell)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f1f5;
  height: 60px;
  padding: 10px;
  border-bottom: 1px solid #d4d4d4;
  text-align: center;
`;

const StyledCell = styled(Cell)<{ isExpend: boolean }>`
  padding: 10px;
  border-bottom: ${({ isExpend }) => (isExpend ? 'none' : '1px solid #f1f1f5')};
  text-align: center;
  height: 100px;
`;

const Styled지원서Cell = styled(Cell)`
  padding: 0px 20px 16px;
  border-bottom: 1px solid #f1f1f5;

  height: auto;
`;

const Styled지원서TxtBox = styled.div`
  height: 220px;
  padding: 20px;
  border-radius: 16px;
  text-wrap: wrap;
  border: 1px solid #d4d4d4;
  box-shadow: 0px 2px 6px -1px rgba(17, 17, 17, 0.08);
  font-size: 16px;
`;

const SquareButton = styled.button<{ isAccept: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #21ecc7;
  background-color: ${({ isAccept }) => (isAccept ? '#21ECC7' : '#FFFFFF')};
  text-align: center;
  font-size: 14px;
  border-radius: 12px;
  box-shadow: 0px 2px 6px -1px rgba(17, 17, 17, 0.08);
  padding: 8px 26px;
`;

const CircleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: 1px solid #e5e5ec;
  border-radius: 999px;
  padding: 7.5px 12px;
  color: #767676;
  font-size: 12px;
`;
