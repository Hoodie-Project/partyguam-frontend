'use client';

import React, { useMemo } from 'react';
import styled from '@emotion/styled';

import { Square, Txt } from '@/components/atoms';
import { useSelectLocationStore } from '@/store/user';
import { palette, radius } from '@/styles/themes';

import locationData from './mock.json';

/**
 * NOTE
 * - location api data에 따라 코드 변경 가능
 * - 재사용 가능하게 비즈니스 로직 분리 필요
 */
interface Location {
  id: number;
  province: string;
  city: string;
}

export default function Location() {
  const { selectedProvince, setSelectedProvince, selectedCities, setSelectedCities, removeSelectedCity } =
    useSelectLocationStore();

  const uniqueProvinces: { province: string }[] = locationData.reduce(
    (acc: { province: string }[], current: Location) => {
      if (!acc.some(item => item.province === current.province)) {
        acc.push({ province: current.province });
      }
      return acc;
    },
    [],
  );

  const cities: { id: number; city: string }[] = useMemo(() => {
    return locationData
      .filter(item => item.province === selectedProvince)
      .reduce((acc: { id: number; city: string }[], current: Location) => {
        acc.push({ id: current.id, city: current.city });
        return acc;
      }, []);
  }, [selectedProvince]);

  const handleCityClick = (item: { id: number; city: string }) => {
    if (isSelectedCities(item.id)) {
      removeSelectedCity(item.id);
    } else if (selectedCities.length < 3) {
      setSelectedCities({ id: item.id, city: item.city, province: selectedProvince });
    }
  };

  const isSelectedCities = (cityId: number) => {
    return selectedCities.find(selected => cityId === selected.id);
  };

  return (
    <Container>
      <LocationContainer>
        <Wrapper>
          {uniqueProvinces.map(item => (
            <Square
              key={item.province}
              width="4.8125rem"
              height="3.25rem"
              radiusKey="s"
              shadowKey={selectedProvince === item.province ? 'shadow1' : 'none'}
              backgroundColor={selectedProvince === item.province ? 'greenLight400' : 'transparent'}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setSelectedProvince(item.province);
              }}
            >
              <Txt
                fontSize={16}
                fontWeight={selectedProvince === item.province ? 'bold' : 'normal'}
                fontColor="grey600"
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
              width="4.8125rem"
              height="3.25rem"
              radiusKey="s"
              shadowKey="none"
              backgroundColor="white"
              style={{
                cursor: `${selectedCities.length === 3 ? 'not-allowed' : 'pointer'}`,
                border: `${isSelectedCities(item.id) ? `1px solid ${palette.primaryGreen}` : 'none'}`,
              }}
              onClick={() => handleCityClick(item)}
            >
              <Txt
                fontSize={16}
                fontWeight={isSelectedCities(item.id) ? 'bold' : 'normal'}
                fontColor={isSelectedCities(item.id) ? 'primaryGreen' : 'grey600'}
              >
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
  justify-content: space-between;
`;

const LocationContainer = styled.div`
  display: flex;
  width: auto;
  height: 21.375rem;
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
    background-color: rgba(241, 241, 245, 0.3);
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
  grid-template-columns: ${({ type }) => (type === 'city' ? 'repeat(5, 1fr)' : 'repeat(2, 1fr)')};
  grid-template-rows: repeat(auto-fill);
  grid-auto-rows: minmax(50px, auto);
`;
