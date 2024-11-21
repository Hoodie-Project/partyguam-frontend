import { create } from 'zustand';

type OptionType = {
  id: number;
  label: string;
};

type ChipType = {
  id: number;
  parentLabel?: string;
  label: string;
};

interface SelectionStore {
  selected직무ParentOptions: OptionType[] | null;
  selected직무Options: OptionType[] | null;
  selected파티유형Options: OptionType[] | null;
  직무FilterChips: ChipType[];
  파티유형FilterChips: ChipType[];

  // 적용하기 상태 관리
  submit직무Main: string[]; // 직무 main 필터
  submit직무Position: number[]; // 직무 position 필터
  submit파티유형Filter: number[]; // 파티 유형 필터

  // 직무 filter 상태 관리
  setSelected직무ParentOptions: (options: OptionType[] | null) => void;
  setSelected직무Options: (options: OptionType[] | null) => void;
  add직무FilterChip: (chip: ChipType) => void;
  remove직무FilterChip: (id: number) => void;
  reset직무FilterChip: () => void;

  // 파티유형 filter 상태 관리
  setSelected파티유형Options: (options: OptionType[] | null) => void;
  add파티유형FilterChip: (chip: ChipType) => void;
  remove파티유형FilterChip: (id: number) => void;
  reset파티유형FilterChip: () => void;

  handleSubmit직무: () => void;
  handleSubmit파티유형: () => void;
}

export const useApplicantFilterStore = create<SelectionStore>(set => ({
  // 초기 상태 설정
  selected직무ParentOptions: null,
  selected직무Options: null,
  selected파티유형Options: null,
  직무FilterChips: [],
  파티유형FilterChips: [],
  submit직무Main: [],
  submit직무Position: [],
  submit파티유형Filter: [],

  // 직무 필터 상태 관리
  setSelected직무ParentOptions: options => set({ selected직무ParentOptions: options }),
  setSelected직무Options: options => set({ selected직무Options: options }),

  add직무FilterChip: chip =>
    set(state => {
      if (chip.label === '전체') {
        return {
          직무FilterChips: [...state.직무FilterChips.filter(c => c.parentLabel !== chip.parentLabel), chip],
        };
      }
      return {
        직무FilterChips: [
          ...state.직무FilterChips.filter(c => !(c.parentLabel === chip.parentLabel && c.label === '전체')),
          chip,
        ],
      };
    }),

  remove직무FilterChip: id =>
    set(state => ({
      직무FilterChips: state.직무FilterChips.filter(chip => chip.id !== id),
    })),

  reset직무FilterChip: () =>
    set(() => ({
      직무FilterChips: [],
    })),

  // 파티유형 필터 상태 관리
  setSelected파티유형Options: options => set({ selected파티유형Options: options }),

  add파티유형FilterChip: chip =>
    set(state => {
      if (chip.label === '전체') {
        return {
          파티유형FilterChips: [...state.파티유형FilterChips.filter(c => c.parentLabel !== chip.parentLabel), chip],
        };
      }
      return {
        파티유형FilterChips: [
          ...state.파티유형FilterChips.filter(c => !(c.parentLabel === chip.parentLabel && c.label === '전체')),
          chip,
        ],
      };
    }),

  remove파티유형FilterChip: id =>
    set(state => ({
      파티유형FilterChips: state.파티유형FilterChips.filter(chip => chip.id !== id),
    })),

  reset파티유형FilterChip: () =>
    set(() => ({
      파티유형FilterChips: [],
    })),

  // 필터 상태 제출

  handleSubmit직무: () =>
    set(state => {
      const submit직무Main = state.직무FilterChips
        .filter(chip => chip.parentLabel) // parentLabel이 있는 chip만 필터링
        .map(chip => chip.parentLabel as string); // parentLabel만 추출하여 배열 생성

      const submit직무Position = state.직무FilterChips.map(chip => chip.id); // id만 추출하여 배열 생성
      return {
        submit직무Main,
        submit직무Position,
      };
    }),

  handleSubmit파티유형: () =>
    set(state => {
      const submit파티유형Filter = state.파티유형FilterChips.map(chip => chip.id); // label만 추출하여 배열 생성

      return {
        submit파티유형Filter,
      };
    }),
}));
