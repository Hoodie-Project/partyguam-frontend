export const JOIN_VALIDATION = {
  MESSAGE: {
    VALID_NICKNAME: '사용 가능한 닉네임이에요.', // -> 서버 응답 이후
    DUPLICATED_NICKNAME: '중복된 닉네임이에요.', // -> 서버 응답 이후
    REQUEST_CONFIRM_DUPLICATED: '닉네임 중복 확인을 해주세요.',
    INVALID_NICKNAME: '2자 이상 15자 이내로 입력해 주세요.',
    NO_SPECIAL_CHARACTERS: '특수문자는 사용할 수 없어요.',
    INVALID_BIRTH: '생년월일을 다시 확인해 주세요.',
  },
  REGEX: {
    SPECIAL_CHARACTERS: /[^A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s]/,
  },
};
