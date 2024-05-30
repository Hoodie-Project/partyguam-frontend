/**
 * 세부 프로필 - 관심지역
 */

import type { Career } from '@/stores/detailProfile';

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

const fetchGetPositions = async () => {
  try {
    const response = await privateApi.get('/positions');
    return response.data;
  } catch (error) {
    console.error('fetchGetPositions error : ', error);
  }
};

const fetchPostPositions = async (data: Career[]) => {
  try {
    const response = await privateApi.post('/users/me/career', {
      career: data,
    });
    return response.data;
  } catch (error) {
    console.error('fetchPostPositions error : ', error);
  }
};

/**
 * 세부 프로필 - 성향질문
 */

export { fetchGetLocations, fetchGetPositions, fetchPostLocations, fetchPostPositions };
