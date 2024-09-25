import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';

import { fetchGetPositions } from '@/apis/detailProfile';
import { Txt } from '@/components/_atoms';
import { Select } from '@/components/_molecules';
import { SFlexColumnFull, SMargin } from '@/styles/components';
import type { Position } from '@/types/user';

const filterMainCategories = (data: Position[]): { id: number; label: string }[] => {
  const uniqueMain = Array.from(new Set(data.map(item => item.main)));
  const mainOptions = uniqueMain.map((main, index) => ({
    id: index + 1,
    label: main,
  }));

  // '전체' 항목을 첫 번째로 추가
  return [{ id: 0, label: '전체' }, ...mainOptions];
};

function PartyRecruitmentsTab() {
  const [primaryPosition, setPrimaryPosition] = useState({ id: 0, 직군: '전체', 직무: '', 경력: '' });
  const [mainFiltered, setMainFiltered] = useState<{ id: number; label: string }[]>([]);
  const [isArrowUp, setIsArrowUp] = useState(false);

  // API로부터 데이터 가져오기
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

  const toggleArrow = () => {
    setIsArrowUp(prev => !prev); // 상태 토글
  };

  const recruitments = [
    { date: '2024.06.20', title: '디자이너 | UI/UX', status: '모집중', count: '1/3', applicants: 2 },
    { date: '2024.06.19', title: '기획자 | PM', status: '모집중', count: '0/2', applicants: 2 },
    { date: '2024.06.18', title: '개발자 | 프론트엔드', status: '모집중', count: '0/1', applicants: 2 },
    { date: '2024.06.17', title: '개발자 | 백엔드', status: '모집중', count: '0/1', applicants: 0 },
  ];

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
              4
            </Txt>
            <Txt fontColor="black" fontSize={14} fontWeight="normal" style={{ marginLeft: '8px' }}>
              지원자
            </Txt>
            <Txt fontColor="greenDark100" fontSize={14} fontWeight="normal" style={{ marginLeft: '4px' }}>
              6
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
            <Divider />
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

        {/* 모집 공고 카드 리스트 */}
        <RecruitmentList>
          {recruitments.map((item, index) => (
            <RecruitmentCard key={index}>
              <Txt fontSize={12} fontColor="grey500">
                모집일 {item.date}
              </Txt>
              <Txt fontSize={16} fontWeight="bold" style={{ margin: '8px 0' }}>
                {item.title}
              </Txt>
              <Info>
                <Txt fontColor="red">
                  {item.status} {item.count}
                </Txt>
                <Txt fontColor="greenDark100">지원자 {item.applicants}</Txt>
              </Info>
            </RecruitmentCard>
          ))}
        </RecruitmentList>
      </SFlexColumnFull>
    </PartyRecruitmentsTabContainer>
  );
}

export default PartyRecruitmentsTab;

const PartyRecruitmentsTabContainer = styled.section`
  height: 100vh;
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

const Divider = styled.div`
  width: 2px;
  height: 10px;
  background-color: #d4d4d4;
  border-radius: 999px;
  margin: 0 12px;
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

const RecruitmentCard = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  width: calc(50% - 8px); /* 두 개씩 보여주기 위한 너비 설정 */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`;
