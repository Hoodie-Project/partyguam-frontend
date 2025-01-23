'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';

import { fetchGetLocations } from '@/apis/detailProfile';
import { Square, Txt } from '@/components/_atoms';
import { useAuthStore } from '@/stores/auth';
import { useSelectLocationStore } from '@/stores/detailProfile';
import { palette, radius } from '@/styles/themes';

/**
 * NOTE
 * - location api data에 따라 코드 변경 가능
 * - 재사용 가능하게 비즈니스 로직 분리 필요
 */
interface LocationData {
  id: number;
  province: string;
  city: string;
}

type Props = {
  editMode?: boolean;
  setIsToast: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Location({ editMode, setIsToast }: Props) {
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const {
    selectedProvince,
    setSelectedProvince,
    selectedCities,
    setSelectedCities,
    setAlreadySelectedCities,
    removeSelectedCity,
    removeSelectedCitiesByProvince,
  } = useSelectLocationStore();
  // edit
  const user = useAuthStore();

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    const location = await fetchGetLocations();
    setLocationData(location);
  };

  const uniqueProvinces: { province: string }[] = locationData.reduce(
    (acc: { province: string }[], current: LocationData) => {
      if (!acc.some(item => item.province === current.province)) {
        acc.push({ province: current.province });
      }
      return acc;
    },
    [],
  );

  const cities: LocationData[] = useMemo(() => {
    return locationData
      .filter(item => item.province === selectedProvince)
      .reduce((acc: LocationData[], current: LocationData) => {
        acc.push({ id: current.id, city: current.city, province: current.province });
        return acc;
      }, []);
  }, [locationData, selectedProvince]);

  const handleCityClick = (item: { id: number; city: string; province: string }) => {
    if (item.city === '전체') {
      removeSelectedCitiesByProvince(selectedProvince);
    }
    // 중복 데이터 방지: 선택된 cities 중에 동일한 province와 city 확인
    const isAlreadySelected = selectedCities.some(
      selected => selected.city === item.city && selected.province === selectedProvince,
    );

    if (isAlreadySelected) {
      removeSelectedCity(item.id);
    } else if (selectedCities.length < 3) {
      setSelectedCities({ id: item.id, city: item.city, province: selectedProvince });
    }
    if (selectedCities.length === 3) {
      setIsToast(true);
    }
  };

  const isSelectedCities = (cityId: number) => {
    return selectedCities.find(selected => cityId === selected.id);
  };

  // user.userLocations에 따라 초기 상태 설정
  useEffect(() => {
    setAlreadySelectedCities(user.userLocations.flatMap(item => item.location));
  }, [user.userLocations]);

  console.log('selectedCities > ', selectedCities);

  return (
    <Container>
      <LocationContainer>
        <Wrapper>
          {uniqueProvinces.map((item, i) => (
            <Square
              key={`${item.province}-${i}`}
              width="5.3125rem"
              height="3.25rem"
              shadowKey="none"
              backgroundColor={selectedProvince === item.province ? 'greenLight400' : 'transparent'}
              style={{
                cursor: 'pointer',
              }}
              onClick={() => {
                setSelectedProvince(item.province);
              }}
            >
              <Txt
                fontSize={16}
                fontWeight="bold"
                fontColor={selectedProvince === item.province ? 'greenDark200' : 'grey400'}
              >
                {item.province}
              </Txt>
            </Square>
          ))}
        </Wrapper>
      </LocationContainer>
      <LocationContainer>
        <Wrapper type="city">
          {cities.map(item => (
            <Square
              key={item.id}
              width="4.6875rem"
              height="3.25rem"
              radiusKey="s"
              shadowKey={isSelectedCities(item.id) ? 'shadow1' : 'none'}
              backgroundColor="transparent"
              style={{
                cursor: `${selectedCities.length === 3 ? 'not-allowed' : 'pointer'}`,
                border: `${isSelectedCities(item.id) ? `1px solid ${palette.primaryGreen}` : 'none'}`,
              }}
              onClick={() => handleCityClick(item)}
            >
              <Txt fontSize={16} fontWeight="normal" fontColor={isSelectedCities(item.id) ? 'greenDark100' : 'grey600'}>
                {item.city}
              </Txt>
            </Square>
          ))}
        </Wrapper>
      </LocationContainer>
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  gap: 14px;
  width: 100%;
  justify-content: space-between;
`;

const LocationContainer = styled.div`
  display: flex;
  width: auto;
  height: 19.5rem;
  border: 1px solid ${palette.grey200};
  border-radius: ${radius.s};
  overflow-y: auto;
  overflow-x: hidden;
  ::-webkit-scrollbar {
    display: none;
    width: 8px;
  }
  &:hover {
    ::-webkit-scrollbar {
      display: initial;
    }
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 999px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(33, 236, 199, 0.3);
    border-radius: 999px;
  }
`;

const Wrapper = styled.div<{ type?: string }>`
  display: grid;
  height: fit-content;
  gap: 0;
  grid-template-columns: ${({ type }) => (type === 'city' ? 'repeat(4, 1fr)' : 'repeat(1, 1fr)')};
  grid-template-rows: repeat(auto-fill);
  grid-auto-rows: minmax(50px, auto);
`;
