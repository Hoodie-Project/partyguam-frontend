import React, { useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'next/navigation';
import styled from '@emotion/styled';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Body, Cell, Header, HeaderCell, HeaderRow, Row, Table } from '@table-library/react-table-library/table';
import { useTheme } from '@table-library/react-table-library/theme';
import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchPartyRecruitmentApplications } from '@/apis/party';
import { Txt } from '@/components/_atoms';
import { BreadCrumb, ProfileImage } from '@/components/_molecules';
import { SChildContainer } from '@/styles/components';
import type { PartyApplicationUser } from '@/types/party';
import { formatDate } from '@/utils/date';

function Party모집공고별지원자관리({ partyId }: { partyId: string }) {
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [status, setStatus] = useState<'active' | 'approved' | 'pending' | 'rejected' | undefined>(undefined);
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
                  <Txt fontWeight="normal" fontSize={14} fontColor="grey600">
                    상태
                  </Txt>
                </StyledHeaderCell>
                <StyledHeaderCell style={{ borderRadius: '0px 20px 0px 0px' }}>
                  <Txt fontWeight="normal" fontSize={14} fontColor="grey600">
                    지원서
                  </Txt>
                </StyledHeaderCell>
              </HeaderRow>
            </Header>

            <Body>
              {tableList.map((item: PartyApplicationUser) => (
                <Row item={item} key={item.id}>
                  <StyledCell>
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
                  <StyledCell>
                    <Txt fontWeight="normal" fontSize={14} fontColor="grey500">
                      {formatDate(item.createdAt)}
                    </Txt>
                  </StyledCell>
                  <StyledCell>
                    <Txt fontWeight="normal" fontSize={14}>
                      {item.status}
                    </Txt>
                  </StyledCell>
                  <StyledCell>
                    <Txt fontWeight="normal" fontSize={14}>
                      지원서
                    </Txt>
                  </StyledCell>
                </Row>
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
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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

const StyledCell = styled(Cell)`
  padding: 10px;
  border-bottom: 1px solid #f1f1f5;
  text-align: center;
  height: 100px;
`;
