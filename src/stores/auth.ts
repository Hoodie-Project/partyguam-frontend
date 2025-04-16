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
  updatedAt: '',
  userPersonalities: [],
  userCareers: [],
  userLocations: [],
};

type Auth = UsersMeResponse;

type AuthAction = {
  login: () => void;
  logout: () => void;
  setAuth: (newAuth: Partial<Auth>) => void;
  setUserPersonalities: (personalities: Auth['userPersonalities']) => void;
  setUserCareers: (careers: Auth['userCareers']) => void;
  setUserLocations: (locations: Auth['userLocations']) => void;
};

export const useAuthStore = create(
  persist<{ isLoggedIn: boolean; isAccountRecovery: boolean } & Auth & AuthAction>(
    set => ({
      isLoggedIn: false,
      isAccountRecovery: false,
      ...initialAuthState,

      login: () => set({ isLoggedIn: true, isAccountRecovery: false }),
      logout: () =>
        set({
          isLoggedIn: false,
          isAccountRecovery: false,
          ...initialAuthState,
        }),
      setAccountRecovery: () => set({ isAccountRecovery: true }),
      setAuth: (newAuth: Partial<Auth>) => set(state => ({ ...state, ...newAuth })),
      setUserPersonalities: personalities => set(state => ({ ...state, userPersonalities: personalities })),
      setUserCareers: careers => set(state => ({ ...state, userCareers: careers })),
      setUserLocations: locations => set(state => ({ ...state, userLocations: locations })),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
