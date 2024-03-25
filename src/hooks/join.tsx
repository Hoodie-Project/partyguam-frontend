import { useMemo, useState } from 'react';

import { JOIN_VALIDATION } from '@/constants';

import { fetchNicknameDuplicated } from './remotes';

interface JoinInput {
  nickname: string;
  birthday: Date | null;
  gender: string;
}

export function usePersonalInfo(initialValue: JoinInput) {
  const [joinInput, setJoinInput] = useState(initialValue);
  const [isNicknameConfirmed, setIsNicknameConfirmed] = useState(false);
  const [isNicknameDuplicated, setIsNicknameDuplicated] = useState<boolean | null>(null);

  const checkNickname = async () => {
    if (joinInput.nickname.length >= 2 && joinInput.nickname.length <= 16) {
      try {
        const isDuplicated = await fetchNicknameDuplicated(joinInput.nickname);
        setIsNicknameDuplicated(isDuplicated);
      } catch (error) {
        console.error('닉네임 중복 확인 실패:', error);
      }
    }
  };

  const nicknameValidate: {
    inputState?: 'default' | 'warn' | 'success';
    bottomMessage?: string;
  } = useMemo(() => {
    if (joinInput.nickname.length === 0) {
      return { inputState: 'default' };
    }
    if (JOIN_VALIDATION.REGEX.SPECIAL_CHARACTERS.test(joinInput.nickname)) {
      return { inputState: 'warn', bottomMessage: JOIN_VALIDATION.MESSAGE.NO_SPECIAL_CHARACTERS };
    }
    if (joinInput.nickname.length < 2 || joinInput.nickname.length > 16) {
      return { inputState: 'warn', bottomMessage: JOIN_VALIDATION.MESSAGE.INVALID_NICKNAME };
    }
    if (isNicknameConfirmed === false) {
      return { inputState: 'warn', bottomMessage: JOIN_VALIDATION.MESSAGE.REQUEST_CONFIRM_DUPLICATED };
    }
    if (isNicknameDuplicated === true) {
      return { inputState: 'warn', bottomMessage: JOIN_VALIDATION.MESSAGE.DUPLICATED_NICKNAME };
    }
    if (isNicknameDuplicated === false) {
      return { inputState: 'success', bottomMessage: JOIN_VALIDATION.MESSAGE.VALID_NICKNAME };
    }
    return { inputState: 'success' };
  }, [joinInput.nickname, isNicknameConfirmed, isNicknameDuplicated]);

  const handleBlur = () => {
    if (nicknameValidate.inputState === 'success') {
      setIsNicknameConfirmed(false);
    }
  };

  return {
    joinInput,
    setJoinInput,
    isNicknameConfirmed,
    setIsNicknameConfirmed,
    isNicknameDuplicated,
    setIsNicknameDuplicated,
    checkNickname,
    nicknameValidate,
    handleBlur,
  };
}
