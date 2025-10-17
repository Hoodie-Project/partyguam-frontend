import React, { useEffect, useState } from 'react';

import { fetchGetPartyTypes, fetchGetPositions } from '@/apis/party';
import { Select } from '@/components/_molecules';
import { useApplicantFilterStore } from '@/stores/home/useApplicantFilter';
import type { Position } from '@/types/user';

type OptionType = {
  id: number;
  label: string;
};

type ChipType = {
  id: number;
  parentLabel?: string;
  label: string;
};

const transformPartyTypes = (data: { id: number; type: string }[]): { id: number; label: string }[] => {
  return data?.map(item => ({
    id: item.id,
    label: item.type,
  }));
};

export const transformPositionData = (data: Position[]): { id: number; label: string }[] => {
  return data.map(position => ({
    id: position.id,
    label: position.sub,
  }));
};

export default function HomeRecruitmentSelect() {
  const [파티유형List, set파티유형List] = useState<OptionType[]>([]);
  const [positionList, setPositionList] = useState<OptionType[]>([]);

  const {
    selected직무ParentOptions,
    selected직무Options,
    selected파티유형Options,

    setSelected직무ParentOptions,
    setSelected직무Options,
    setSelected파티유형Options,

    set직무Filter,
    set파티유형Filter,
    reset직무FilterChip,
    reset파티유형FilterChip,
    직무FilterChips,
    파티유형FilterChips,

    handleSubmit직무,
    handleSubmit파티유형,
  } = useApplicantFilterStore();

  // "적용하기" 버튼을 누르기 전 임시 상태 저장
  const [tempSelected직무ParentOptions, setTempSelected직무ParentOptions] = useState<OptionType[] | null>(
    selected직무ParentOptions,
  );
  const [tempSelected직무Options, setTempSelected직무Options] = useState<OptionType[] | null>(selected직무Options);
  const [tempSelected파티유형Options, setTempSelected파티유형Options] = useState<OptionType[] | null>(
    selected파티유형Options,
  );

  const [temp직무FilterChips, setTemp직무FilterChips] = useState<ChipType[]>([]);
  const [temp파티유형FilterChips, setTemp파티유형FilterChips] = useState<ChipType[]>([]);

  const add파티유형FilterChip = (chip: ChipType) => {
    setTemp파티유형FilterChips(prev => {
      if (chip.label === '전체') {
        return [...prev.filter(c => c.parentLabel !== chip.parentLabel), chip];
      }
      return [...prev.filter(c => !(c.parentLabel === chip.parentLabel && c.label === '전체')), chip];
    });
  };

  const add직무FilterChip = (chip: ChipType) => {
    setTemp직무FilterChips(prev => {
      if (chip.label === '전체') {
        return [...prev.filter(c => c.parentLabel !== chip.parentLabel), chip];
      }
      return [...prev.filter(c => !(c.parentLabel === chip.parentLabel && c.label === '전체')), chip];
    });
  };

  const remove파티유형FilterChip = (id: number) => {
    setTemp파티유형FilterChips(prev => prev.filter(chip => chip.id !== id));
  };

  const remove직무FilterChip = (id: number) => {
    setTemp직무FilterChips(prev => prev.filter(chip => chip.id !== id));
  };

  useEffect(() => {
    (async () => {
      const response = await fetchGetPartyTypes();
      set파티유형List(transformPartyTypes(response));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const response = await fetchGetPositions(tempSelected직무ParentOptions?.[0]?.label || '');
      setPositionList([
        { id: Math.floor(Math.random() * 100) + 35, label: '전체' },
        ...transformPositionData(response),
      ]);
    })();
  }, [tempSelected직무ParentOptions]);

  const handleParentOptionSelect = (parentOption: OptionType) => {
    if (tempSelected직무ParentOptions?.[0]?.id === parentOption.id) {
      setTempSelected직무ParentOptions(null); // 같은 옵션 클릭 시 선택 해제
    } else {
      setTempSelected직무ParentOptions([parentOption]); // 다른 옵션 선택 시 해당 옵션으로 교체
    }
  };

  const handle직무OptionToggle = (option: OptionType) => {
    if (tempSelected직무ParentOptions && tempSelected직무ParentOptions.length > 0) {
      const parentLabel = tempSelected직무ParentOptions[0].label;

      if (option.label === '전체') {
        setTempSelected직무Options([option]);
        add직무FilterChip({ id: option.id, parentLabel, label: option.label });
        return;
      }

      // 이미 선택된 항목인 경우 제거
      if (tempSelected직무Options?.some(selected => selected.id === option.id)) {
        setTempSelected직무Options(tempSelected직무Options.filter(selected => selected.id !== option.id));
        remove직무FilterChip(option.id);
        return;
      }
      // 6개 이상 선택 시 제한 (현재 선택된 개수가 5개 이상일 때)
      if (tempSelected직무Options && tempSelected직무Options?.length >= 5) {
        alert('최대 5개까지 선택 가능합니다!');
        return;
      }

      // 5개 이하일 때만 추가
      setTempSelected직무Options([
        ...(tempSelected직무Options?.filter(selected => selected.label !== '전체') || []),
        option,
      ]);
      add직무FilterChip({ id: option.id, parentLabel, label: option.label });
    }
  };

  const handle파티유형OptionToggle = (option: OptionType) => {
    if (option.label === '전체') {
      setTempSelected파티유형Options([option]);
      add파티유형FilterChip({ id: option.id, label: option.label });
      return;
    }

    // 이미 선택된 항목인 경우 제거
    if (tempSelected파티유형Options?.some(selected => selected.id === option.id)) {
      setTempSelected파티유형Options(tempSelected파티유형Options.filter(selected => selected.id !== option.id));
      remove파티유형FilterChip(option.id);
      return;
    }

    // 6개 이상 선택 시 제한 (현재 선택된 개수가 5개 이상일 때)
    if (tempSelected파티유형Options && tempSelected파티유형Options?.length >= 5) {
      alert('최대 5개까지 선택 가능합니다!');
      return;
    }

    // 5개 이하일 때만 추가
    setTempSelected파티유형Options([
      ...(tempSelected파티유형Options?.filter(selected => selected.label !== '전체') || []),
      option,
    ]);
    add파티유형FilterChip({ id: option.id, label: option.label });
  };

  const handleRemove직무FilterChip = (id: number) => {
    if (tempSelected직무Options?.some(selected => selected.id === id)) {
      setTempSelected직무Options(tempSelected직무Options.filter(selected => selected.id !== id));
      remove직무FilterChip(id);
    }
  };

  const handleRemove파티유형FilterChip = (id: number) => {
    if (tempSelected파티유형Options?.some(selected => selected.id === id)) {
      setTempSelected파티유형Options(tempSelected파티유형Options.filter(selected => selected.id !== id));
      remove파티유형FilterChip(id);
    }
  };

  const handle직무Reset = () => {
    setTempSelected직무Options(null);
    setTemp직무FilterChips([]);
    reset직무FilterChip();
    setTempSelected직무ParentOptions([{ id: 0, label: '기획자' }]);
  };

  const handle파티유형Reset = () => {
    setTempSelected파티유형Options(null);
    setTemp파티유형FilterChips([]);
    reset파티유형FilterChip();
  };

  const handleSubmit직무Select = () => {
    set직무Filter(temp직무FilterChips);
    setSelected직무ParentOptions(tempSelected직무ParentOptions);
    setSelected직무Options(tempSelected직무Options);
    handleSubmit직무(temp직무FilterChips);
  };

  const handleSubmit파티유형Select = () => {
    set파티유형Filter(temp파티유형FilterChips);
    setSelected파티유형Options(tempSelected파티유형Options);
    handleSubmit파티유형(temp파티유형FilterChips);
  };

  return (
    <>
      <div style={{ width: 'auto', minWidth: '67px' }}>
        <Select
          optionsType="multi"
          value={
            직무FilterChips && 직무FilterChips.length > 0
              ? 직무FilterChips.length > 1 && 직무FilterChips[0].parentLabel != null
                ? `${직무FilterChips[0].parentLabel} ${직무FilterChips[0].label} 외 ${직무FilterChips.length - 1}`
                : `${직무FilterChips[0].parentLabel || ''} ${직무FilterChips[0].label}`
              : undefined
          }
          isSelectedIcon={직무FilterChips && 직무FilterChips.length > 0}
          parentOptions={[
            { id: 0, label: '기획자' },
            { id: 1, label: '디자이너' },
            { id: 2, label: '개발자' },
            { id: 3, label: '마케터/광고' },
          ]}
          options={positionList}
          selectedParentOptions={tempSelected직무ParentOptions}
          handleParentOptionSelect={handleParentOptionSelect}
          selectedOptions={tempSelected직무Options}
          chipData={temp직무FilterChips}
          handleClickReset={handle직무Reset}
          handleOptionToggle={handle직무OptionToggle}
          handleClickSubmit={handleSubmit직무Select}
          handleRemoveChip={handleRemove직무FilterChip}
          height="xs"
          placeholder="직무"
          fontSize={14}
          selectStyle={{
            borderRadius: '999px',
            padding: '8px 12px',
            whiteSpace: 'nowrap',
          }}
          optionStyle={{ width: '400px', height: 'auto', borderRadius: '24px' }}
          handleOpenReset={() => {
            setTempSelected직무ParentOptions(selected직무ParentOptions);
            setTempSelected직무Options(selected직무Options);
            setTemp직무FilterChips(직무FilterChips);
          }}
        />
      </div>
      <div style={{ width: 'auto', minWidth: '67px' }}>
        <Select
          optionsType="multi"
          value={
            파티유형FilterChips && 파티유형FilterChips.length > 1
              ? `${파티유형FilterChips[0].label} 외 ${파티유형FilterChips.length - 1}`
              : 파티유형FilterChips[0]?.label || undefined
          }
          isSelectedIcon={파티유형FilterChips && 파티유형FilterChips.length > 0}
          options={파티유형List}
          selectedOptions={tempSelected파티유형Options}
          chipData={temp파티유형FilterChips}
          handleClickReset={handle파티유형Reset}
          handleOptionToggle={handle파티유형OptionToggle}
          handleRemoveChip={handleRemove파티유형FilterChip}
          handleClickSubmit={handleSubmit파티유형Select}
          height="xs"
          placeholder="파티유형"
          fontSize={14}
          selectStyle={{
            borderRadius: '999px',
            padding: '8px 12px',
            width: 'auto',
            minWidth: '93px',
            whiteSpace: 'nowrap',
          }}
          optionStyle={{ width: '320px', height: 'auto', borderRadius: '24px' }}
          handleOpenReset={() => {
            setTempSelected파티유형Options(selected파티유형Options);
            setTemp파티유형FilterChips(파티유형FilterChips);
          }}
        />
      </div>
    </>
  );
}
