import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { UsersMeResponse } from '@/types/user';

/* 초기 상태 정의 */
const initialAuthState: UsersMeResponse = {
  email: '',
  nickname: '',
  birth: '',
  birthVisible: false,
  gender: '',
  genderVisible: false,
  portfolioTitle: '',
  portfolio: '',
  image: '',
  createdAt: '',
  userPersonalities: [],
  userCareers: [],
  userLocations: [],
};

type Auth = UsersMeResponse;

type AuthAction = {
  login: () => void;
  logout: () => void;
  setAuth: (newAuth: Partial<Auth>) => void;
};

export const useAuthStore = create(
  persist<{ isLoggedIn: boolean } & Auth & AuthAction>(
    set => ({
      isLoggedIn: false,
      ...initialAuthState,

      login: () => set({ isLoggedIn: true }),
      logout: () =>
        set({
          isLoggedIn: false,
          ...initialAuthState,
        }),
      setAuth: (newAuth: Partial<Auth>) => set(state => ({ ...state, ...newAuth })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
