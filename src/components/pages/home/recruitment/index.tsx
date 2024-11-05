'use client';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import { fetchGetPartyTypes, fetchGetPositions } from '@/apis/party';
import { Txt } from '@/components/_atoms';
import { Select } from '@/components/_molecules';
import { SContainer, SHomeContainer } from '@/styles/components';
import type { Position } from '@/types/user';

export const transformPositionData = (data: Position[]): { id: number; label: string }[] => {
  return data.map(position => ({
    id: position.id,
    label: position.sub,
  }));
};

// TODO. 파티 타입 데이터 변환 -> 이게 최선일까? select list로 들어가는 options type 리펙토링 필수
const transformPartyTypes = (data: { id: number; type: string }[]): { id: number; label: string }[] => {
  return data.map(item => ({
    id: item.id,
    label: item.type,
  }));
};

function HomeRecruitment() {
  const [파티유형List, set파티유형List] = useState<{ id: number; label: string }[]>([]);
  const [positionList, setPositionList] = useState<{ id: number; label: string }[]>([]);
  const [selectedParent직무Options, setSelectedParent직무Options] = useState<{ id: number; label: string }[] | null>(
    null,
  );
  const [selected직무Options, setSelected직무Options] = useState<{ id: number; label: string }[] | null>(null);
  const [selected파티타입Options, setSelected파티타입Options] = useState<{ id: number; label: string }[] | null>(null);

  useEffect(() => {
    (async () => {
      const response = await fetchGetPartyTypes();
      set파티유형List(transformPartyTypes(response));
    })();
  }, []);

  // 포지션 데이터 가져오기
  useEffect(() => {
    (async () => {
      const response = await fetchGetPositions(selectedParent직무Options?.[0].label);
      setPositionList(transformPositionData(response));
    })();
  }, [selectedParent직무Options]);

  return (
    <SContainer>
      <SHomeContainer>
        <Txt fontWeight="bold" fontSize={32}>
          모집공고
        </Txt>
        <HeaderWrapper>
          <LeftFilter>
            <Select
              optionsType="multi"
              parentOptions={[
                { id: 0, label: '기획자' },
                { id: 1, label: '디자이너' },
                { id: 2, label: '개발자' },
                { id: 3, label: '마케터/광고' },
              ]}
              options={positionList}
              selectedParentOptions={selectedParent직무Options}
              setSelectedParentOptions={setSelectedParent직무Options}
              selectedOptions={selected직무Options}
              setSelectedOptions={setSelected직무Options}
              height="xs"
              placeholder="직무"
              fontSize={14}
              selectStyle={{ borderRadius: '999px', padding: '8px 12px' }}
              optionStyle={{ width: '400px', height: '310px' }}
              onClick={() => {}}
            />
            <Select
              optionsType="multi"
              options={파티유형List}
              selectedOptions={selected파티타입Options}
              setSelectedOptions={setSelected파티타입Options}
              height="xs"
              placeholder="파티유형"
              fontSize={14}
              selectStyle={{ borderRadius: '999px', padding: '8px 12px' }}
              optionStyle={{ width: '320px', height: '310px' }}
              onClick={() => {}}
            />
          </LeftFilter>
          <RightFilter></RightFilter>
        </HeaderWrapper>
      </SHomeContainer>
    </SContainer>
  );
}

export default HomeRecruitment;

const HeaderWrapper = styled.section`
  width: 100%;
  margin-top: 16px;
  padding: 12px 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const LeftFilter = styled.div`
  width: auto;
  display: flex;
  flex-direction: row;
  gap: 12px;
`;

const RightFilter = styled.div``;
