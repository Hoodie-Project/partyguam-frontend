import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/* 회원가입 시 */
type Auth = {
  nickname: string;
  email: string;
  gender: string;
  birth: string;
};

type AuthAction = {
  setAuth: (newAuth: Auth) => void;
  resetAuth: () => void;
};

export const useAuthStore = create(
  persist<Auth & AuthAction>(
    (set, get) => ({
      nickname: '',
      email: '',
      gender: '',
      birth: '',
      setAuth: (newAuth: Partial<Auth>) => set(newAuth),
      resetAuth: () =>
        set({
          nickname: '',
          email: '',
          gender: '',
          birth: '',
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
