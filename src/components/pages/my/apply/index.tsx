'use client';
import React, { Fragment, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Body, Cell, Header, HeaderCell, HeaderRow, Row, Table } from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';
import { useInfiniteQuery } from '@tanstack/react-query';

import type { PartyApplication } from '@/apis/auth';
import { fetchGetUsersMePartiesApplications } from '@/apis/auth';
import { fetchApprovePartyApplication, fetchDeletePartyApplication, fetchRejectPartyApplication } from '@/apis/party';
import { Balloon, Chip, Txt } from '@/components/_atoms';
import { PageHeader } from '@/components/_molecules';
import { ConfirmModal, FloatingMenu } from '@/components/features';
import { MYPAGE_MENU, PARTY_APPLICANTS_STATUS } from '@/constants';
import { useModalContext } from '@/contexts/ModalContext';
import { Divider, SContainer, SFlexRow } from '@/styles/components';
import { formatRelativeTime } from '@/utils/date';

function MyApply() {
  const [isShowBalloon, setIsShowBalloon] = useState(false);
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [status, setStatus] = useState<'processing' | 'approved' | 'pending' | 'rejected' | 'all'>('all');
  const [expand지원서, setExpand지원서] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const partyRecruitmentId = searchParams.get('partyRecruitmentId');
  const mainPosition = searchParams.get('main');
  const subPosition = searchParams.get('sub');
  const { openModal, closeModal } = useModalContext();
  const router = useRouter();
  // [GET] 포지션 모집 공고별 지원자 조회
  const {
    data: myPartyApplications,
    hasNextPage,
    fetchNextPage,
    isFetched,
  } = useInfiniteQuery({
    queryKey: [order, status, partyRecruitmentId, mainPosition, subPosition],
    queryFn: async ({ pageParam }) => {
      const res = await fetchGetUsersMePartiesApplications({
        page: pageParam as number,
        limit: 10,
        sort: 'createdAt',
        order,
        status,
      });

      return res;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetchedItems = allPages.flatMap(page => page.partyApplications).length;

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
  const myPartyApplicationsById = useMemo(() => {
    if (isFetched && myPartyApplications) {
      return myPartyApplications.pages.flatMap(page =>
        page?.partyApplications
          ? page.partyApplications.map(item => ({
              ...item,
              id: item.id,
            }))
          : [],
      );
    }
    return [];
  }, [myPartyApplications, isFetched]);

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
      --data-table-library_grid-template-columns: 42.5% repeat(3, minmax(0, 1fr));
    `,
  });

  const handleOpenConfirmModal = (
    modalType: '수락' | '거절' | '삭제',
    partyId?: number,
    partyApplicationId?: number,
  ) => {
    openModal({
      children: (
        <>
          {(modalType == '수락' || modalType == '거절') && (
            <ConfirmModal
              modalTitle={modalType == '거절' ? '파티를 거절했어요.' : '파티를 수작했어요.'}
              modalContents={
                modalType == '거절' ? (
                  <>언제든지 새로운 프로젝트에 도전해보세요!</>
                ) : (
                  <>
                    파티에 합류하신 것을 축하드려요.
                    <br />
                    함께 멋진 결과를 만들어가요!
                  </>
                )
              }
              submitBtnTxt="닫기"
            />
          )}
          {modalType == '삭제' && (
            <ConfirmModal
              modalTitle="지원 취소"
              modalContents={
                <>
                  지원을 취소하면 목록에서 삭제되어요 <br />
                  정말로 취소하시겠어요?{' '}
                </>
              }
              cancelBtnTxt="닫기"
              submitBtnTxt="지원 취소"
            />
          )}
        </>
      ),
      onCancel: () => {
        closeModal();
      },
      onSubmit: async () => {
        if (modalType === '삭제') {
          try {
            await fetchDeletePartyApplication({
              partyId: Number(partyId),
              partyApplicationId: Number(partyApplicationId),
            });
            router.refresh();
          } catch (err) {
            console.error(err);
          }
        }
        closeModal();
      },
    });
  };

  return (
    <SContainer>
      <FloatingMenu menu={MYPAGE_MENU()} />
      <PageHeader title="지원 목록" />
      <MyApplyContainer>
        <SFlexRow
          style={{
            width: '100%',
            alignItems: 'center',
            marginTop: '10px',
            marginBottom: '32px',
            gap: '12px',
          }}
        >
          {[
            { label: '전체', value: 'all' },
            { label: '검토중', value: 'pending' },
            { label: ' 수락 ', value: 'approved' },
            { label: '응답대기', value: 'processing' },
            { label: ' 거절 ', value: 'rejected' },
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
                setStatus(item.value as unknown as 'processing' | 'approved' | 'pending' | 'rejected');
              }}
            />
          ))}
        </SFlexRow>
        {/* 테이블 컴포넌트 */}
        {myPartyApplicationsById.length != 0 && (
          <Table
            data={{ nodes: myPartyApplicationsById ?? [] }}
            theme={theme}
            layout={{ custom: true }}
            style={{ width: '100%', height: 'auto', zIndex: 0, marginBottom: '20px' }}
          >
            {(tableList: PartyApplication[]) => (
              <>
                <Header>
                  <HeaderRow>
                    <StyledHeaderCell style={{ borderRadius: '20px 0px 0px 0px' }}>
                      <Txt fontWeight="normal" fontSize={14} fontColor="grey600">
                        모집 공고
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
                              display: 'flex',
                              justifyContent: 'flex-start',
                              flexDirection: 'column',
                              position: 'absolute',
                              top: '40px',
                              padding: '20px',
                              transform: 'translate(12px, 0px)',
                              marginTop: '20px',
                              zIndex: 999,
                              borderRadius: '12px',
                              textAlign: 'start',
                            }}
                          >
                            <div style={{ width: '100%', textAlign: 'start', marginBottom: '12px' }}>
                              <Txt fontSize={16} fontColor="primaryGreen" fontWeight="semibold">
                                상태
                              </Txt>
                              <Txt fontSize={16} fontColor="white" fontWeight="semibold">
                                에 대해 알려드릴게요
                              </Txt>
                            </div>
                            <Txt fontSize={14} fontColor="white" style={{ lineHeight: '140%' }}>
                              검토중 : 파티장이 지원서 확인 전이에요.
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
                              style={{ width: '100%', textAlign: 'start', marginTop: '15px' }}
                            >
                              일주일 이내 수락하지 않으면 거절됩니다
                            </Txt>
                            <Txt
                              fontSize={14}
                              fontColor="white"
                              style={{ width: '100%', textAlign: 'start', marginTop: '15px' }}
                            >
                              지원목록은 지원일 기준 30일까지 보관됩니다.
                            </Txt>
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
                  {tableList.map((item: PartyApplication) => (
                    <Fragment key={item.id}>
                      <Row item={item}>
                        <StyledCell isExpend={expand지원서 === item.id}>
                          <div
                            style={{
                              width: '100%',
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              padding: '3px 0px 3px 10px',
                              gap: '12px',
                            }}
                          >
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_DEV_HOST}/${item.partyRecruitment.party.image}`}
                              width={120}
                              height={90}
                              alt={item.partyRecruitment.party.title}
                              style={{ borderRadius: '8px', border: '1px solid #F1F1F5' }}
                            />
                            <CardRightWrapper>
                              <div style={{ textAlign: 'start' }}>
                                <Chip
                                  chipType="filled"
                                  label={item.partyRecruitment.party.partyType.type}
                                  size="xsmall"
                                  chipColor="#F6F6F6"
                                  fontColor="grey700"
                                  fontWeight="semibold"
                                />
                                <EllipsisTitleText fontSize={16} fontWeight="semibold" style={{ lineHeight: '140%' }}>
                                  {item.partyRecruitment.party.title} {/* 파티 제목 */}
                                </EllipsisTitleText>
                                <Txt
                                  fontSize={14}
                                  color="grey600"
                                  style={{
                                    marginLeft: '2px',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    lineHeight: '140%',
                                    marginTop: 'auto',
                                  }}
                                >
                                  {item.partyRecruitment.position.main} <Divider />
                                  {item.partyRecruitment.position.sub} {/* 포지션 정보 */}
                                </Txt>
                              </div>
                            </CardRightWrapper>
                          </div>
                        </StyledCell>
                        <StyledCell isExpend={expand지원서 === item.id}>
                          <Txt fontWeight="normal" fontSize={14} fontColor="grey500">
                            {formatRelativeTime(item.createdAt)}
                          </Txt>
                        </StyledCell>
                        <StyledCell isExpend={expand지원서 === item.id}>
                          <Txt
                            fontWeight="semibold"
                            fontSize={14}
                            style={{ color: `${PARTY_APPLICANTS_STATUS(item.status)?.color}` }}
                          >
                            {PARTY_APPLICANTS_STATUS(item.status)?.label}
                          </Txt>
                        </StyledCell>
                        <StyledCell isExpend={expand지원서 === item.id}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CircleButton
                              onClick={() => setExpand지원서(prevId => (prevId === item.id ? null : item.id))}
                            >
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
                            {item.status === 'pending' && (
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
                                  style={{ padding: '8px 74.5px' }}
                                  onClick={() => {
                                    handleOpenConfirmModal('삭제', item.partyRecruitment.party.id, item.id);
                                  }}
                                >
                                  지원 취소
                                </SquareButton>
                              </div>
                            )}
                            {item.status === 'processing' && (
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
                                      await fetchRejectPartyApplication({
                                        partyId: Number(item.partyRecruitment.party.id),
                                        partyApplicationId: item.id,
                                      });
                                      handleOpenConfirmModal('거절');
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
                                      await fetchApprovePartyApplication({
                                        partyId: Number(item.partyRecruitment.party.id),
                                        partyApplicationId: item.id,
                                      });
                                      handleOpenConfirmModal('수락');
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
        )}

        {myPartyApplicationsById.length == 0 && (
          <EmptyState>
            <InfoOutlinedIcon style={{ marginBottom: '6px' }} />
            <Txt fontSize={16} fontWeight="semibold" fontColor="grey400">
              지원 목록이 없어요.
            </Txt>
          </EmptyState>
        )}
        <div ref={ref} style={{ height: '20px', backgroundColor: 'transparent' }} />
      </MyApplyContainer>
    </SContainer>
  );
}

export default MyApply;

const MyApplyContainer = styled.div`
  width: 820px;
  height: auto;
  margin-top: 110px;
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
  height: 116px;
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
const EmptyState = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #767676;
  margin-top: 60px;
`;

const CardRightWrapper = styled.div`
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
  margin: 4px 0px 4px 2px;
`;
