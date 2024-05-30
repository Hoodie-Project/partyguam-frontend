import { useEffect, useMemo, useState } from 'react';

import { fetchNicknameDuplicated } from '@/apis/join';
import { JOIN_VALIDATION } from '@/constants';

interface JoinInput {
  nickname: string;
  birth: Date | null;
  gender: string;
}

export default function usePersonalInfo(initialValue: JoinInput) {
  const [joinInput, setJoinInput] = useState(initialValue);
  const [isNicknameConfirmed, setIsNicknameConfirmed] = useState(false); // 중복 검사 확인 문구 띄우기 위함
  const [isNicknameDuplicated, setIsNicknameDuplicated] = useState<boolean | undefined>(undefined); // 중복하면 true, 중복 안하면 false

  const checkNickname = async () => {
    if (joinInput.nickname.length >= 2 && joinInput.nickname.length <= 16) {
      const isDuplicated = await fetchNicknameDuplicated(joinInput.nickname);
      setIsNicknameDuplicated(isDuplicated);
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
    if (joinInput.nickname.length < 2 || joinInput.nickname.length > 15) {
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
    if (isNicknameDuplicated === false) {
      setIsNicknameConfirmed(true);
    }
    if (nicknameValidate.inputState === 'success' && isNicknameDuplicated === undefined) {
      setIsNicknameConfirmed(false);
    }
  };

  useEffect(() => {
    if (isNicknameDuplicated === false) {
      setIsNicknameConfirmed(true);
    }
    if (isNicknameDuplicated === true) {
      setIsNicknameConfirmed(true);
    }
  }, [isNicknameDuplicated]);

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
