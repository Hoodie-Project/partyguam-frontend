import { create } from 'zustand';

export interface Career {
  positionId: number;
  years: number;
  careerType: 'primary' | 'secondary';
}

interface SelectPositionState {
  selectedPosition: Career[];
  positionCompletion: boolean;
  setSelectedPosition: (position: Career[]) => void;
  setPositionCompletion: (completion: boolean) => void;
}

export const useSelectPositionStore = create<SelectPositionState>(set => ({
  selectedPosition: [],
  positionCompletion: false,
  setSelectedPosition: position => set({ selectedPosition: position }),
  setPositionCompletion: completion => set({ positionCompletion: completion }),
}));
