import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/* 회원가입 시 */
type Auth = {
  nickname: string;
  email: string;
  image: string;
  gender: string;
  birth: string;
};

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
          nickname: '',
          email: '',
          image: '',
          gender: '',
          birth: '',
        }),
      nickname: '',
      email: '',
      image: '',
      gender: '',
      birth: '',
      setAuth: (newAuth: Partial<Auth>) => set(newAuth),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
