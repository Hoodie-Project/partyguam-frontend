'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from '@emotion/styled';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ErrorIcon from '@mui/icons-material/Error';

import { fetchPostLocations } from '@/apis/detailProfile';
import { Button, Chip, Txt } from '@/components/atoms';
import { Toast } from '@/components/molecules';
import { Location } from '@/components/organisms';
import { useSelectLocationStore } from '@/stores/detailProfile';

export default function SelectLocation() {
  const [isToast, setIsToast] = useState(false);
  const { selectedCities, selectedCitiesById, removeSelectedCity, setLocationCompletion } = useSelectLocationStore();
  const router = useRouter();

  useEffect(() => {
    if (selectedCities.length === 3) {
      setIsToast(true);
    }
  }, [selectedCities]);

  const handleClickNextBtn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await fetchPostLocations(selectedCitiesById);
    setLocationCompletion(true);
    router.push('/join/detail?num=2');
    return res;
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
      <Location />
      <Toast
        visible={isToast}
        onClose={() => {
          setIsToast(false);
        }}
        label="최대 3개까지 선택할 수 있어요."
        position={154}
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
      <ButtonsContainer>
        <Button shadow="shadow2" onClick={handleClickNextBtn} disabled={selectedCities.length === 0}>
          <Txt fontColor="black" fontSize={18} fontWeight="bold">
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
