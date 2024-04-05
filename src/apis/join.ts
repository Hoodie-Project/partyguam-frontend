import { privateApi } from '.';
/**
 *
 * @param nickname string
 * @returns
 * 200: 중복 안됨, false 반환
 * 409error: 중복됨, true 반환
 */
const fetchNicknameDuplicated = async (nickname: string) => {
  try {
    const response = await privateApi.get('/user/check-nickname', {
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

const fetchJoinFormSubmit = async (data: { nickname: string; email: string; birth: string; gender: string }) => {
  try {
    const response = await privateApi.post('/user/signup', {
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

export { fetchJoinFormSubmit, fetchNicknameDuplicated };
