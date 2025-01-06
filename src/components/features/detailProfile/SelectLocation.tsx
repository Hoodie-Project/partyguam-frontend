'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ErrorIcon from '@mui/icons-material/Error';
import { difference } from 'lodash';

import { fetchGetUsers } from '@/apis/auth';
import { fetchDeleteLocations, fetchPostLocations } from '@/apis/detailProfile';
import { Button, Chip, Txt } from '@/components/_atoms';
import { Toast } from '@/components/_molecules';
import { Location } from '@/components/features';
import { useAuthStore } from '@/stores/auth';
import { useSelectLocationStore } from '@/stores/detailProfile';

type Props = {
  editMode?: boolean;
  handleResetEdit?: () => void;
  handlesubmitEdit?: () => void;
};

export default function SelectLocation({ editMode = false, handleResetEdit, handlesubmitEdit }: Props) {
  const [isToast, setIsToast] = useState(false);
  const { selectedCities, selectedCitiesById, removeSelectedCity, setLocationCompletion, removeAllSelectedCities } =
    useSelectLocationStore();
  const { setAuth, setUserLocations } = useAuthStore();
  const user = useAuthStore();

  const isDisabledSubmitEditLocation = useMemo(() => {
    return (
      selectedCities.length === 0 ||
      difference(
        user.userLocations.flatMap(item => item.location),
        selectedCities,
      ).length === 0
    );
  }, [selectedCities, user.userLocations]);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const userResponse = await fetchGetUsers();
      setAuth(userResponse);
    })();
  }, []);

  useEffect(() => {
    if (selectedCities.length === 3) {
      setIsToast(true);
    }
  }, [selectedCities]);

  const handleClickNextBtn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await fetchDeleteLocations();
    const res = await fetchPostLocations(selectedCitiesById);

    if (res.status === 409) {
      await fetchDeleteLocations();
      await fetchPostLocations(selectedCitiesById);
    }

    setLocationCompletion(true);
    const userResponse = await fetchGetUsers();
    setAuth(userResponse);
    if (!editMode) {
      router.push('/join/detail?num=2');
    }
  };

  return (
    <div>
      <SectionTitle>
        <Txt fontColor="black" fontWeight="bold" fontSize={24}>
          관심 지역을 선택하고 <br />
          파티를 추천 받아보세요!
        </Txt>
        <Txt fontColor="black" fontWeight="normal" fontSize={18}>
          거주 지역이나 자주 찾는 지역을 선택해 주세요. (최대 3곳)
        </Txt>
      </SectionTitle>
      <Location editMode={editMode} />
      <Toast
        visible={isToast}
        onClose={() => {
          setIsToast(false);
        }}
        label="최대 3개까지 선택할 수 있어요."
        position={editMode ? 180 : 585}
        icon={<ErrorIcon fontSize="small" />}
      />
      <ChipWrapper>
        {selectedCities.map(item => (
          <Chip
            key={item.id}
            chipType="outlined"
            chipColor="primaryGreen"
            label={`${item.province} ${item.city}`}
            closeButton={
              <CloseRoundedIcon
                style={{ marginLeft: '4px' }}
                onClick={e => {
                  e.preventDefault();
                  removeSelectedCity(item.id);
                }}
              />
            }
          />
        ))}
      </ChipWrapper>
      {editMode && (
        <ButtonsRowContainer>
          <Button
            shadow="shadow2"
            backgroudColor="disableWhite"
            height="l"
            style={{ width: '110px' }}
            borderColor={selectedCities.length === 0 ? 'grey200' : 'primaryGreen'}
            onClick={() => removeAllSelectedCities()}
            disabled={selectedCities.length === 0}
          >
            <Txt fontColor={selectedCities.length === 0 ? 'grey400' : 'black'} fontSize={18} fontWeight="bold">
              초기화
            </Txt>
          </Button>
          <Button
            shadow="shadow2"
            height="l"
            style={{ width: '280px' }}
            onClick={handleClickNextBtn}
            disabled={isDisabledSubmitEditLocation}
          >
            <Txt fontColor={isDisabledSubmitEditLocation ? 'grey400' : 'black'} fontSize={18} fontWeight="bold">
              적용하기
            </Txt>
          </Button>
        </ButtonsRowContainer>
      )}
      {!editMode && (
        <ButtonsContainer>
          <Button shadow="shadow2" onClick={handleClickNextBtn} disabled={selectedCities.length === 0}>
            <Txt fontColor={selectedCities.length === 0 ? 'grey400' : 'black'} fontSize={18} fontWeight="bold">
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
              router.push('/join/detail?num=2');
            }}
          >
            건너뛰기
          </Txt>
        </ButtonsContainer>
      )}
    </div>
  );
}

const SectionTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin: 5rem 0px 3.75rem 0px;
`;

const ChipWrapper = styled.div`
  display: flex;
  width: 120%;
  gap: 11px;
  margin-top: 4.4375rem;
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
  margin-top: 10px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;
