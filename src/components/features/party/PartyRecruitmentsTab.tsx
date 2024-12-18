import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { fetchGetPositions } from '@/apis/detailProfile';
import { fetchGetPartyRecruitmentsList } from '@/apis/party';
import { Txt } from '@/components/_atoms';
import { Select } from '@/components/_molecules';
import { SFlexColumnFull, SMargin } from '@/styles/components';
import type { PartyRecruitmentListResponse } from '@/types/party';
import type { Position } from '@/types/user';

import PartyRecruitmentsCard from './PartyRecruitmentsCard';

// 직군 필터링 함수
const filterMainCategories = (data: Position[]): { id: number; label: string }[] => {
  const uniqueMain = Array.from(new Set(data.map(item => item.main)));
  const mainOptions = uniqueMain.map((main, index) => ({
    id: index + 1,
    label: main,
  }));

  // '전체' 항목을 첫 번째로 추가
  return [{ id: 0, label: '전체' }, ...mainOptions];
};

type Props = {
  partyId: string;
};

function PartyRecruitmentsTab({ partyId }: Props) {
  const [partyRecruitList, setPartyRecruitList] = useState<PartyRecruitmentListResponse>([]);
  const [primaryPosition, setPrimaryPosition] = useState({ id: 0, 직군: '전체', 직무: '', 경력: '' });
  const [mainFiltered, setMainFiltered] = useState<{ id: number; label: string }[]>([]);
  const [order, setOrder] = useState<'ASC' | 'DESC'>('ASC'); // ASC (오름차순) / DESC (내림차순)
  const [isArrowUp, setIsArrowUp] = useState(false);
  const router = useRouter();

  // 파티 모집 목록을 가져오는 함수
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
        order: order,
      };

      // 직군이 '전체'가 아닐 경우에만 main 파라미터 추가
      if (primaryPosition.직군 !== '전체') {
        requestParams.main = primaryPosition.직군;
      }

      const data = await fetchGetPartyRecruitmentsList(requestParams);
      setPartyRecruitList(data);
    } catch (error) {
      console.error('Error fetching recruitments:', error);
    }
  };

  // 첫 번째 렌더 시 API 호출
  useEffect(() => {
    fetchRecruitments();
  }, [primaryPosition, order]);

  // 직군 데이터 가져오기
  useEffect(() => {
    (async () => {
      const response = await fetchGetPositions();
      setMainFiltered(filterMainCategories(response));
    })();
  }, []);

  const handleSelectChange =
    (
      setter: React.Dispatch<React.SetStateAction<{ id: number; 직군: string; 직무: string; 경력: string }>>,
      field: string,
    ) =>
    (e: React.MouseEvent<HTMLLIElement>) => {
      const selectedText = e.currentTarget?.textContent || '';
      if (selectedText) {
        setter(prev => ({
          ...prev,
          [field]: selectedText,
        }));
      }
    };

  // 등록순 정렬 토글
  const toggleArrow = () => {
    setOrder(prevOrder => (prevOrder === 'ASC' ? 'DESC' : 'ASC')); // ASC, DESC 토글
    setIsArrowUp(prev => !prev); // 화살표 토글
  };

  return (
    <PartyRecruitmentsTabContainer>
      <SMargin margin="35px 0px 0px 0px" />
      <SFlexColumnFull>
        <HeaderArea>
          <HeaderLeft>
            <Txt fontSize={20} fontWeight="bold">
              모집공고
            </Txt>
            <Txt fontColor="black" fontSize={14} fontWeight="normal" style={{ marginLeft: '12px' }}>
              모집공고
            </Txt>
            <Txt fontColor="greenDark100" fontSize={14} fontWeight="normal" style={{ marginLeft: '4px' }}>
              {partyRecruitList.length}
            </Txt>
            <Txt fontColor="black" fontSize={14} fontWeight="normal" style={{ marginLeft: '8px' }}>
              지원자
            </Txt>
            <Txt fontColor="greenDark100" fontSize={14} fontWeight="normal" style={{ marginLeft: '4px' }}>
              {/* 지원자 수는 각 모집 공고의 지원자 수의 합계를 표시 */}
              {partyRecruitList.reduce((acc, curr) => acc + Number(curr.applicationCount), 0)}
            </Txt>
          </HeaderLeft>
          <HeaderRight>
            <Txt
              fontColor="grey500"
              fontSize={14}
              fontWeight="normal"
              textDecoration="underline"
              style={{ cursor: 'pointer', textDecorationColor: '#767676' }}
            >
              지원자 관리
            </Txt>
            <Divider height="10px" margin="0px 10px" />
            <Txt
              fontColor="grey500"
              fontSize={14}
              fontWeight="normal"
              textDecoration="underline"
              style={{ cursor: 'pointer', textDecorationColor: '#767676' }}
            >
              모집 편집
            </Txt>
          </HeaderRight>
        </HeaderArea>

        {/* Select와 등록순 필터가 같은 선상에 배치 */}
        <FilterContainer>
          <SelectWrapper>
            <Select
              height="xs"
              selectRadius="xs"
              optionRadius="xs"
              placeholder="직군 선택"
              fontSize={14}
              options={mainFiltered}
              value={primaryPosition.직군}
              onClick={handleSelectChange(setPrimaryPosition, '직군')}
              selectStyle={{ minWidth: '67px', width: 'auto', padding: '8px 12px' }}
              optionStyle={{ width: '170px', left: '0', border: '1px solid #11C9A7' }}
            />
          </SelectWrapper>
          <IconContainer onClick={toggleArrow}>
            <Txt fontSize={14}>등록순</Txt>
            {isArrowUp ? (
              <ArrowDropUpRoundedIcon style={{ color: '#00b894' }} />
            ) : (
              <ArrowDropDownRoundedIcon style={{ color: '#00b894' }} />
            )}
          </IconContainer>
        </FilterContainer>

        {/* 모집 공고가 없는 경우 */}
        {partyRecruitList.length === 0 ? (
          <EmptyState>
            <InfoOutlinedIcon style={{ marginBottom: '6px' }} />
            <Txt fontSize={16} fontWeight="semibold" fontColor="grey400">
              모집 공고가 없습니다.
            </Txt>
          </EmptyState>
        ) : (
          <RecruitmentList>
            {partyRecruitList.map((item, index) => (
              <PartyRecruitmentsCard
                key={item.id}
                createdAt={item.createdAt}
                main={item.position.main}
                sub={item.position.sub}
                recruitedCount={item.recruitedCount}
                recruitingCount={item.recruitingCount}
                applicationCount={item.applicationCount}
                handleClick={() => router.push(`/party/recruit/${item.id}?partyId=${partyId}`)}
              />
            ))}
          </RecruitmentList>
        )}
      </SFlexColumnFull>
    </PartyRecruitmentsTabContainer>
  );
}

export default PartyRecruitmentsTab;

const PartyRecruitmentsTabContainer = styled.section`
  height: 100%;
`;

const HeaderArea = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Divider = styled.div<{ height?: string; margin: string }>`
  width: 2px;
  height: ${({ height }) => height};
  background-color: #d4d4d4;
  border-radius: 999px;
  margin: ${({ margin }) => margin};
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
`;

const SelectWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const RecruitmentList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 20px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #767676;
  margin-top: 60px;
`;
