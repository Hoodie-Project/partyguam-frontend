'use client';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import { fetchGetPartyTypes, fetchGetPositions } from '@/apis/party';
import { Txt } from '@/components/_atoms';
import { Select } from '@/components/_molecules';
import { useApplicantFilterStore } from '@/stores/home/useApplicantFilter';
import { SContainer, SHomeContainer } from '@/styles/components';
import type { Position } from '@/types/user';

export const transformPositionData = (data: Position[]): { id: number; label: string }[] => {
  return data.map(position => ({
    id: position.id,
    label: position.sub,
  }));
};

const transformPartyTypes = (data: { id: number; type: string }[]): { id: number; label: string }[] => {
  return data.map(item => ({
    id: item.id,
    label: item.type,
  }));
};

type OptionType = {
  id: number;
  label: string;
};

function HomeRecruitment() {
  const [파티유형List, set파티유형List] = useState<OptionType[]>([]);
  const [positionList, setPositionList] = useState<OptionType[]>([]);

  const {
    selected직무ParentOptions,
    selected직무Options,
    selected파티유형Options,
    직무FilterChips,
    파티유형FilterChips,
    setSelected직무ParentOptions,
    setSelected직무Options,
    setSelected파티유형Options,
    add직무FilterChip,
    remove직무FilterChip,
    reset직무FilterChip,
    add파티유형FilterChip,
    remove파티유형FilterChip,
    reset파티유형FilterChip,
  } = useApplicantFilterStore();

  useEffect(() => {
    (async () => {
      const response = await fetchGetPartyTypes();
      set파티유형List(transformPartyTypes(response));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const response = await fetchGetPositions(selected직무ParentOptions?.[0]?.label || '');
      setPositionList([
        { id: Math.floor(Math.random() * 100) + 35, label: '전체' },
        ...transformPositionData(response),
      ]);
    })();
  }, [selected직무ParentOptions]);

  const handleParentOptionSelect = (parentOption: OptionType) => {
    if (selected직무ParentOptions?.[0]?.id === parentOption.id) {
      setSelected직무ParentOptions(null); // 같은 옵션 클릭 시 선택 해제
    } else {
      setSelected직무ParentOptions([parentOption]); // 다른 옵션 선택 시 해당 옵션으로 교체
    }
  };

  const handle직무OptionToggle = (option: OptionType) => {
    if (selected직무ParentOptions && selected직무ParentOptions.length > 0) {
      const parentLabel = selected직무ParentOptions[0].label;

      if (option.label === '전체') {
        setSelected직무Options([option]);
        add직무FilterChip({ id: option.id, parentLabel, label: option.label });
      } else {
        if (selected직무Options?.some(selected => selected.id === option.id)) {
          setSelected직무Options(selected직무Options.filter(selected => selected.id !== option.id));
          remove직무FilterChip(option.id);
        } else {
          setSelected직무Options([
            ...(selected직무Options?.filter(selected => selected.label !== '전체') || []),
            option,
          ]);
          add직무FilterChip({ id: option.id, parentLabel, label: option.label });
        }
      }
    }
  };

  const handle파티유형OptionToggle = (option: OptionType) => {
    if (option.label === '전체') {
      setSelected파티유형Options([option]);
      add파티유형FilterChip({ id: option.id, label: option.label });
    } else {
      if (selected파티유형Options?.some(selected => selected.id === option.id)) {
        setSelected파티유형Options(selected파티유형Options.filter(selected => selected.id !== option.id));
        remove파티유형FilterChip(option.id);
      } else {
        setSelected파티유형Options([
          ...(selected파티유형Options?.filter(selected => selected.label !== '전체') || []),
          option,
        ]);
        add파티유형FilterChip({ id: option.id, label: option.label });
      }
    }
  };

  const handle직무Reset = () => {
    setSelected직무Options(null);
    reset직무FilterChip();
    setSelected직무ParentOptions([{ id: 0, label: '기획자' }]);
  };

  const handle파티유형Reset = () => {
    setSelected파티유형Options(null);
    reset파티유형FilterChip();
  };

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
              value={
                직무FilterChips && 직무FilterChips.length > 0
                  ? 직무FilterChips.length > 1 && 직무FilterChips[0].parentLabel != null
                    ? `${직무FilterChips[0].parentLabel} ${직무FilterChips[0].label} 외 ${직무FilterChips.length - 1}`
                    : `${직무FilterChips[0].parentLabel || ''} ${직무FilterChips[0].label}`
                  : undefined
              }
              parentOptions={[
                { id: 0, label: '기획자' },
                { id: 1, label: '디자이너' },
                { id: 2, label: '개발자' },
                { id: 3, label: '마케터/광고' },
              ]}
              options={positionList}
              selectedParentOptions={selected직무ParentOptions}
              handleParentOptionSelect={handleParentOptionSelect}
              selectedOptions={selected직무Options}
              handleClickReset={handle직무Reset}
              handleOptionToggle={handle직무OptionToggle}
              height="xs"
              placeholder="직무"
              fontSize={14}
              selectStyle={{ borderRadius: '999px', padding: '8px 12px' }}
              optionStyle={{ width: '400px', height: '310px' }}
            />
            <Select
              optionsType="multi"
              value={
                파티유형FilterChips && 파티유형FilterChips.length > 1
                  ? `${파티유형FilterChips[0].label} 외 ${파티유형FilterChips.length - 1}`
                  : 파티유형FilterChips[0]?.label || undefined
              }
              options={파티유형List}
              selectedOptions={selected파티유형Options}
              handleClickReset={handle파티유형Reset}
              handleOptionToggle={handle파티유형OptionToggle}
              height="xs"
              placeholder="파티유형"
              fontSize={14}
              selectStyle={{ borderRadius: '999px', padding: '8px 12px' }}
              optionStyle={{ width: '320px', height: '310px' }}
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
