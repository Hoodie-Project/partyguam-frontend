import { create } from 'zustand';

import type { SelectedPersonality } from '@/types/user';

interface SelectPersonalityState {
  selectedQ1: SelectedPersonality[];
  selectedQ2: SelectedPersonality[];
  selectedQ3: SelectedPersonality[];
  selectedQ4: SelectedPersonality[];
  personalityCompletion: boolean[];

  setSelectedQ1: (option: SelectedPersonality[]) => void;
  setSelectedQ2: (option: SelectedPersonality[]) => void;
  setSelectedQ3: (option: SelectedPersonality[]) => void;
  setSelectedQ4: (option: SelectedPersonality[]) => void;
  setPersonalityCompletion: (index: number) => void;
}

export const useSelectPersonalityStore = create<SelectPersonalityState>(set => ({
  selectedQ1: [],
  selectedQ2: [],
  selectedQ3: [],
  selectedQ4: [],
  personalityCompletion: [false, false, false, false],

  setSelectedQ1: option => set({ selectedQ1: option }),
  setSelectedQ2: option => set({ selectedQ1: option }),
  setSelectedQ3: option => set({ selectedQ1: option }),
  setSelectedQ4: option => set({ selectedQ1: option }),

  setPersonalityCompletion: (index: number) =>
    set(state => {
      const newCompletion = [...state.personalityCompletion];
      newCompletion[index] = true;
      return { personalityCompletion: newCompletion };
    }),
}));
