import React, { Fragment, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'next/navigation';
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
  fetchApprovePartyApplication,
  fetchPartyRecruitmentApplications,
  fetchRejectPartyApplication,
} from '@/apis/party';
import { Balloon, Chip, Txt } from '@/components/_atoms';
import { BreadCrumb, ProfileImage } from '@/components/_molecules';
import { PARTY_APPLICANTS_STATUS } from '@/constants';
import { SChildContainer } from '@/styles/components';
import type { PartyApplicationUser } from '@/types/party';
import { formatRelativeTime } from '@/utils/date';

function Party모집공고별지원자관리({ partyId }: { partyId: string }) {
  const [isShowBalloon, setIsShowBalloon] = useState(false);
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [status, setStatus] = useState<'active' | 'approved' | 'pending' | 'rejected' | undefined>(undefined);
  const [expand지원서, setExpand지원서] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const partyRecruitmentId = searchParams.get('partyRecruitmentId');
  const mainPosition = searchParams.get('main');
  const subPosition = searchParams.get('sub');

  // [GET] 포지션 모집 공고별 지원자 조회
  const {
    data: partyRecruitmentApplications,
    hasNextPage,
    fetchNextPage,
    isFetched,
  } = useInfiniteQuery({
    queryKey: [partyId, order, status, partyRecruitmentId, mainPosition, subPosition],
    queryFn: async ({ pageParam }) => {
      const res = await fetchPartyRecruitmentApplications({
        partyId: Number(partyId),
        partyRecruitmentId: Number(partyRecruitmentId),
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
      const totalFetchedItems = allPages.flatMap(page => page.partyApplicationUser).length;

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
        page?.partyApplicationUser
          ? page.partyApplicationUser.map(item => ({
              ...item,
              id: item.user.id,
            }))
          : [],
      );
    }
    return [];
  }, [partyRecruitmentApplications, isFetched]);

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
        <div style={{ display: 'flex', flexDirection: 'row', gap: '7px', marginTop: '10px' }}>
          {[
            { label: '검토중', value: 'active' },
            { label: ' 수락 ', value: 'approved' },
            { label: '응답대기', value: 'pending' },
            { label: ' 거절 ', value: 'rejected' },
          ].map((item, i) => (
            <Chip
              key={i}
              chipType="outlined"
              label={item.label}
              size="small"
              chipColor={status === item.value ? '#11C9A7' : '#E5E5EC'}
              fontColor={status === item.value ? '#11C9A7' : '#767676'}
              onClick={() => {
                setStatus(item.value as unknown as 'active' | 'approved' | 'pending' | 'rejected');
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
        style={{ width: '100%', zIndex: 0, marginBottom: '20px' }}
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
                      style={{ marginLeft: '2px', color: '#999999' }}
                    />
                    {isShowBalloon ? (
                      <Balloon
                        width="309px"
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
                          textAlign: 'start',
                        }}
                      >
                        <div style={{ textAlign: 'start' }}>
                          <Txt fontSize={16} fontColor="primaryGreen" fontWeight="semibold">
                            상태
                          </Txt>
                          <Txt fontSize={16} fontColor="white" fontWeight="semibold">
                            에 대해 알려드릴게요
                          </Txt>
                        </div>
                        <Txt fontSize={14} fontColor="white">
                          검토중 : 지원서 확인 전이에요.
                          <br />
                          응답대기 : 파티장 수락 후, 지원자의 수락을 기다려요.
                          <br />
                          수락 : 파티장과 지원자 모두 수락했어요.
                          <br />
                          거절 : 파티장 또는 지원자가 거절했어요.
                        </Txt>
                        <Txt fontSize={14} fontColor="greenLight100" style={{ textAlign: 'start' }}>
                          일주일 이내 상대방이 수락하지 않으면 거절됩니다
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
              {tableList.map((item: PartyApplicationUser) => (
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
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '12px',
                            justifyContent: 'flex-end',
                            marginTop: '12px',
                          }}
                        >
                          <SquareButton
                            isAccept={false}
                            onClick={async () => {
                              try {
                                const res = fetchRejectPartyApplication({
                                  partyId: Number(partyId),
                                  partyApplicationId: item.id,
                                });
                                return res;
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
                                const res = fetchApprovePartyApplication({
                                  partyId: Number(partyId),
                                  partyApplicationId: item.id,
                                });
                                return res;
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                          >
                            수락하기
                          </SquareButton>
                        </div>
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
  padding: 0px 20px 32px;
  border-bottom: 1px solid #f1f1f5;
  height: 300px;
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
  border: ${({ isAccept }) => (isAccept ? '1px solid #7FF4DF' : '1px solid #E5E5EC')};
  background-color: ${({ isAccept }) => (isAccept ? '#C5FAF0' : '#FFFFFF')};
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
