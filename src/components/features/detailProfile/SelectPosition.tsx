'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';

import { fetchDeletePositions, fetchGetPositions, fetchPostPositions } from '@/apis/detailProfile';
import { Button, Txt } from '@/components/_atoms';
import { Select } from '@/components/_molecules';
import { useModalContext } from '@/contexts/ModalContext';
import { useAuthStore } from '@/stores/auth';
import type { Career } from '@/stores/detailProfile';
import { useSelectPositionStore } from '@/stores/detailProfile';
import { SFlexRow } from '@/styles/components';
import type { Position, UserCareer } from '@/types/user';

// TODO. 데이터 정제 로직 걷어내고 query로 api 보내도록 변경 필요
export const transformPositionData = (data: Position[]): { id: number; label: string }[] => {
  const uniqueMainPositions = Array.from(new Set(data.map(item => item.main)));
  return uniqueMainPositions.map((main, index) => {
    const position = data.find(item => item.main === main);
    return { id: position ? position.id : index + 1, label: main };
  });
};

const filterPositions = (data: Position[], mainCategory: string): { id: number; label: string }[] => {
  return data.filter(item => item.main === mainCategory).map(item => ({ id: item.id, label: item.sub }));
};

const 경력Options = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  label: `${i === 0 ? '신입' : `${i}년`}`,
  value: i,
}));

const 경력map: Record<string, number> = 경력Options.reduce<Record<string, number>>((acc, option) => {
  acc[option.label] = option.value;
  return acc;
}, {});

type Props = {
  editMode?: boolean;
  handleResetEdit?: () => void;
  handlesubmitEdit?: () => void;
};

export default function SelectPosition({ editMode = false, handleResetEdit, handlesubmitEdit }: Props) {
  // edit
  const user = useAuthStore();
  const { setUserCareers } = useAuthStore();
  const { closeModal } = useModalContext();

  const [primaryPosition, setPrimaryPosition] = useState(
    editMode
      ? {
          id: user.userCareers.filter(item => item.careerType === 'primary')[0]
            ? user.userCareers.filter(item => item.careerType === 'primary')[0].id
            : 0,
          직군: user.userCareers.filter(item => item.careerType === 'primary')[0]
            ? user.userCareers.filter(item => item.careerType === 'primary')[0].position.main
            : '',
          직무: user.userCareers.filter(item => item.careerType === 'primary')[0]
            ? user.userCareers.filter(item => item.careerType === 'primary')[0].position.sub
            : '',
          경력: user.userCareers.filter(item => item.careerType === 'primary')[0]
            ? user.userCareers.filter(item => item.careerType === 'primary')[0].years === 0
              ? '신입'
              : `${user.userCareers.filter(item => item.careerType === 'primary')[0].years}년`
            : '',
        }
      : { id: 0, 직군: '', 직무: '', 경력: '' },
  );
  const [secondaryPosition, setSecondaryPosition] = useState(
    editMode
      ? {
          id: user.userCareers.filter(item => item.careerType === 'secondary')[0]
            ? user.userCareers.filter(item => item.careerType === 'secondary')[0].id
            : 0,
          직군: user.userCareers.filter(item => item.careerType === 'secondary')[0]
            ? user.userCareers.filter(item => item.careerType === 'secondary')[0].position.main
            : '',
          직무: user.userCareers.filter(item => item.careerType === 'secondary')[0]
            ? user.userCareers.filter(item => item.careerType === 'secondary')[0].position.sub
            : '',
          경력: user.userCareers.filter(item => item.careerType === 'secondary')[0]
            ? user.userCareers.filter(item => item.careerType === 'secondary')[0].years === 0
              ? '신입'
              : `${user.userCareers.filter(item => item.careerType === 'secondary')[0].years}년`
            : '',
        }
      : { id: 0, 직군: '', 직무: '', 경력: '' },
  );

  const [positionData, setPositionData] = useState<Position[]>([]);
  const [mainFiltered, setMainFiltered] = useState<{ id: number; label: string }[]>([]);
  const [subFiltered, setSubFiltered] = useState<{ id: number; label: string }[]>([]);
  const { nickname } = useAuthStore();
  const { setPositionCompletion, setSelectedPosition } = useSelectPositionStore();
  const positionList = transformPositionData(positionData);
  const router = useRouter();

  const submitEditDisabled = useMemo(() => {
    if (user.userCareers.filter(item => item.careerType === 'primary')[0]?.id != primaryPosition.id) return false;
    if (`${user.userCareers.filter(item => item.careerType === 'primary')[0]?.years}년` != primaryPosition.경력)
      return false;

    if (user.userCareers.filter(item => item.careerType === 'secondary')[0]?.id != secondaryPosition.id) return false;
    if (`${user.userCareers.filter(item => item.careerType === 'secondary')[0]?.years}년` != secondaryPosition.경력)
      return false;

    return true;
  }, [primaryPosition, secondaryPosition, user.userCareers]);

  useEffect(() => {
    const primaryCareer = user.userCareers.find(item => item.careerType === 'primary');
    const secondaryCareer = user.userCareers.find(item => item.careerType === 'secondary');

    setPrimaryPosition({
      id: primaryCareer?.id || 0,
      직군: primaryCareer?.position.main || '',
      직무: primaryCareer?.position.sub || '',
      경력: primaryCareer ? (primaryCareer.years === 0 ? '신입' : `${primaryCareer.years}년`) : '',
    });

    setSecondaryPosition({
      id: secondaryCareer?.id || 0,
      직군: secondaryCareer?.position.main || '',
      직무: secondaryCareer?.position.sub || '',
      경력: secondaryCareer ? (secondaryCareer.years === 0 ? '신입' : `${secondaryCareer.years}년`) : '',
    });
  }, [user.userCareers]);

  useEffect(() => {
    (async () => {
      const response = await fetchGetPositions();
      setPositionData(response);
    })();
  }, []);

  useEffect(() => {
    if (primaryPosition.직군) {
      setMainFiltered(filterPositions(positionData, primaryPosition.직군));
    }
  }, [primaryPosition.직군, positionData]);

  useEffect(() => {
    if (secondaryPosition.직군) {
      setSubFiltered(filterPositions(positionData, secondaryPosition.직군));
    }
  }, [secondaryPosition.직군, positionData]);

  const handleSelectChange =
    (
      setter: React.Dispatch<React.SetStateAction<{ id: number; 직군: string; 직무: string; 경력: string }>>,
      field: string,
      options?: { id: number; label: string }[],
    ) =>
    (e: React.MouseEvent<HTMLLIElement>) => {
      const selectedOption =
        options && options.find(option => option.label === e.currentTarget.textContent && field === '직무');
      setter(prev => ({
        ...prev,
        [field]: e.currentTarget.textContent || '',
        id: selectedOption ? selectedOption.id : prev.id,
      }));
    };

  const handleClickNextBtn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const primaryCareer = {
      positionId: primaryPosition.id,
      years: 경력map[primaryPosition.경력],
      careerType: 'primary' as const,
    };

    const secondaryCareer = {
      positionId: secondaryPosition.id,
      years: 경력map[secondaryPosition.경력],
      careerType: 'secondary' as const,
    };

    const validPositions: Career[] = [
      ...(primaryCareer.positionId !== 0 ? [primaryCareer] : []),
      ...(secondaryCareer.positionId !== 0 ? [secondaryCareer] : []),
    ];

    setSelectedPosition(validPositions);

    const res = await fetchPostPositions(validPositions);
    if (res && res.status === 409) {
      await fetchDeletePositions();
      await fetchPostPositions(validPositions);
    }
    setPositionCompletion(true);

    router.push('/join/detail?num=3');

    return res;
  };

  const handleClickEditBtn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const primaryCareer = {
      positionId: primaryPosition.id,
      years: 경력map[primaryPosition.경력],
      careerType: 'primary' as const,
    };

    const secondaryCareer = {
      positionId: secondaryPosition.id,
      years: 경력map[secondaryPosition.경력],
      careerType: 'secondary' as const,
    };
    const validPositions: Career[] = [
      ...(primaryCareer.positionId !== 0 ? [primaryCareer] : []),
      ...(secondaryCareer.positionId !== 0 ? [secondaryCareer] : []),
    ];

    const settingPositionsStore: UserCareer[] = [
      ...(primaryCareer.positionId !== 0
        ? [
            {
              id: primaryPosition.id,
              years: 경력map[primaryPosition.경력],
              careerType: 'primary' as const,
              position: {
                main: primaryPosition.직군,
                sub: primaryPosition.직무,
              },
            },
          ]
        : []),
      ...(secondaryCareer.positionId !== 0
        ? [
            {
              id: secondaryPosition.id,
              years: 경력map[secondaryPosition.경력],
              careerType: 'secondary' as const,
              position: {
                main: secondaryPosition.직군,
                sub: secondaryPosition.직무,
              },
            },
          ]
        : []),
    ];

    setUserCareers(settingPositionsStore);

    await fetchDeletePositions();
    await fetchPostPositions(validPositions);
    closeModal();
  };

  return (
    <Container>
      <SectionTitle>
        <Txt fontWeight="bold" fontSize={24} fontColor="black">
          {nickname || '***'}님의 <br /> 경력과 포지션을 입력해 주세요.
        </Txt>
        <Txt fontColor="black" fontWeight="normal" fontSize={18}>
          경력과 포지션을 입력하고 파티를 추천받으세요.
        </Txt>
      </SectionTitle>
      <GridTitle>
        <SFlexRow style={{ gap: '4px' }}>
          <Txt fontWeight="bold" fontSize={20} fontColor="black">
            주포지션
          </Txt>
          <Txt fontSize={20} fontColor="failRed" style={{ marginTop: '4px' }}>
            *
          </Txt>
        </SFlexRow>
        <Txt fontWeight="bold" fontSize={20} fontColor="black">
          부포지션
        </Txt>
      </GridTitle>
      <GridContainer>
        <Select
          placeholder="경력"
          options={경력Options}
          value={primaryPosition.경력}
          onClick={handleSelectChange(setPrimaryPosition, '경력')}
        />
        <Select
          placeholder="경력"
          options={경력Options}
          value={secondaryPosition.경력}
          onClick={handleSelectChange(setSecondaryPosition, '경력')}
        />
        <Select
          placeholder="직군"
          options={positionList}
          value={primaryPosition.직군}
          onClick={handleSelectChange(setPrimaryPosition, '직군')}
        />
        <Select
          placeholder="직군"
          options={positionList}
          value={secondaryPosition.직군}
          onClick={handleSelectChange(setSecondaryPosition, '직군', positionList)}
        />
        <Select
          placeholder="직무"
          options={mainFiltered}
          value={primaryPosition.직무}
          onClick={handleSelectChange(setPrimaryPosition, '직무', mainFiltered)}
        />
        <Select
          placeholder="직무"
          options={subFiltered}
          value={secondaryPosition.직무}
          onClick={handleSelectChange(setSecondaryPosition, '직무', subFiltered)}
        />
      </GridContainer>
      {editMode && (
        <ButtonsRowContainer>
          <Button
            shadow="shadow2"
            backgroudColor="disableWhite"
            height="l"
            style={{ width: '85px' }}
            borderColor={
              !primaryPosition.직군 &&
              !primaryPosition.직무 &&
              !primaryPosition.경력 &&
              !secondaryPosition.직군 &&
              !secondaryPosition.직무 &&
              !secondaryPosition.경력
                ? 'grey200'
                : 'primaryGreen'
            }
            onClick={() => {
              setPrimaryPosition({ id: 0, 직군: '', 직무: '', 경력: '' });
              setSecondaryPosition({ id: 0, 직군: '', 직무: '', 경력: '' });
            }}
            disabled={
              !primaryPosition.직군 &&
              !primaryPosition.직무 &&
              !primaryPosition.경력 &&
              !secondaryPosition.직군 &&
              !secondaryPosition.직무 &&
              !secondaryPosition.경력
            }
          >
            <Txt
              fontColor={
                !primaryPosition.직군 &&
                !primaryPosition.직무 &&
                !primaryPosition.경력 &&
                !secondaryPosition.직군 &&
                !secondaryPosition.직무 &&
                !secondaryPosition.경력
                  ? 'grey400'
                  : 'black'
              }
              fontSize={18}
              fontWeight="bold"
            >
              초기화
            </Txt>
          </Button>
          <Button
            shadow="shadow2"
            height="l"
            style={{ width: '255px' }}
            onClick={handleClickEditBtn}
            disabled={submitEditDisabled || !primaryPosition.직군 || !primaryPosition.직무 || !primaryPosition.경력}
          >
            <Txt
              fontColor={
                submitEditDisabled || !primaryPosition.직군 || !primaryPosition.직무 || !primaryPosition.경력
                  ? 'grey400'
                  : 'black'
              }
              fontSize={18}
              fontWeight="bold"
            >
              적용하기
            </Txt>
          </Button>
        </ButtonsRowContainer>
      )}
      {!editMode && (
        <ButtonsContainer>
          <Button
            shadow="shadow2"
            onClick={handleClickNextBtn}
            disabled={!primaryPosition.직군 || !primaryPosition.직무 || !primaryPosition.경력}
          >
            <Txt
              fontColor={!primaryPosition.직군 || !primaryPosition.직무 || !primaryPosition.경력 ? 'grey400' : 'black'}
              fontSize={18}
              fontWeight="bold"
            >
              다음
            </Txt>
          </Button>
          <Txt
            fontColor="grey500"
            fontSize={18}
            fontWeight="bold"
            textDecoration="underline"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              router.push('/join/detail?num=3');
            }}
          >
            건너뛰기
          </Txt>
        </ButtonsContainer>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

const SectionTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin: 5rem 0 3.75rem;
`;

const GridTitle = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
  margin-bottom: 20px;
`;

const GridContainer = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(4, 1fr);
  row-gap: 12px;
  column-gap: 20px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  margin-top: 12px;
  margin-bottom: 58px;
`;

const ButtonsRowContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;
