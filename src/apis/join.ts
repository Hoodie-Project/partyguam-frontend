import { privateApi } from '.';

const fetchGetOauthInfo = async () => {
  try {
    const response = await privateApi.get('/users/me/oauth');
    return response.data;
  } catch (error) {
    console.error('error : ', error);
    throw new Error('Error fetching data');
  }
};

/**
 * 회원가입 닉네임 중복 검사시
 * @param nickname string
 * @returns
 * 200: 중복 안됨, false 반환
 * 409error: 중복됨, true 반환
 */
const fetchNicknameDuplicated = async (nickname: string) => {
  try {
    const response = await privateApi.get('/users/check-nickname', {
      params: { nickname },
    });

    if (response.status === 200) {
      return false;
    }
    if (response.data.statusCode === 409) {
      return true;
    } else {
      throw new Error('Error fetching data');
    }
  } catch (error) {
    return true;
  }
};

/**
 * 회원가입 폼 제출시
 * @param form data: { nickname: string; email: string; birth: string; gender: string }
 * @returns refreshToken - cookie
 */
const fetchJoinFormSubmit = async (data: { nickname: string; email: string; birth: string; gender: string }) => {
  try {
    const response = await privateApi.post('/users', {
      nickname: data.nickname,
      email: data.email,
      birth: data.birth,
      gender: data.gender,
    });

    return response;
  } catch (error) {
    throw new Error('Network error');
  }
};

/**
 * 내 정보 조회
 */
const fetchGetUsers = async () => {
  try {
    const response = await privateApi.get('/users/me');

    return response;
  } catch (error) {
    throw new Error('fetchGetUsers Network error');
  }
};

export { fetchGetOauthInfo, fetchGetUsers, fetchJoinFormSubmit, fetchNicknameDuplicated };
