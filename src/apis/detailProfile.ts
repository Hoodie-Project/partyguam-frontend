/**
 * 세부 프로필 - 관심지역
 */

import { privateApi } from '.';

const fetchGetLocations = async () => {
  try {
    const response = await privateApi.get('/locations');
    return response.data;
  } catch (error) {
    console.error('fetchGetLocations error : ', error);
  }
};

const fetchPostLocations = async (
  data: {
    id: number;
  }[],
) => {
  try {
    const response = await privateApi.post('users/me/locations', {
      locations: data,
    });
    return response.data;
  } catch (error) {
    console.error('fetchPostLocations error : ', error);
  }
};

/**
 * 세부 프로필 - 포지션
 */

/**
 * 세부 프로필 - 성향질문
 */

export { fetchGetLocations, fetchPostLocations };
