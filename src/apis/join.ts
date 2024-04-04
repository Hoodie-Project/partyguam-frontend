import { privateApi } from '.';

/**
 *
 * @param nickname string
 * @returns
 * 200: 중복 안됨, false 반환
 * 409: 중복됨, true 반환
 */
export const fetchNicknameDuplicated = async (nickname: string) => {
  try {
    const response = await privateApi.get(`${process.env.NEXT_PUBLIC_API_HOST}/user/check-nickname`, {
      params: { nickname },
    });

    if (response.status === 200) {
      return false;
    } else if (response.status === 409) {
      return true;
    } else {
      throw new Error('Error fetching data');
    }
  } catch (error) {
    throw new Error('Network error');
  }
};
