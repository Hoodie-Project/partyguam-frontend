import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User } from '@/types/user';

/* 회원가입 시 */
type Auth = User;

type AuthAction = {
  login: () => void;
  logout: () => void;

  setAuth: (newAuth: Auth) => void;
};

export const useAuthStore = create(
  persist<{ isLoggedIn: boolean } & Auth & AuthAction>(
    set => ({
      isLoggedIn: false,
      login: () => set({ isLoggedIn: true }),
      logout: () =>
        set({
          isLoggedIn: false,
          id: 0,
          nickname: '',
          email: '',
          image: '',
          gender: '',
          birth: '',
          createdAt: '',
        }),
      id: 0,
      nickname: '',
      email: '',
      image: '',
      gender: '',
      birth: '',
      createdAt: '',
      setAuth: (newAuth: Partial<Auth>) => set(newAuth),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
