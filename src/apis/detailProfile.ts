/**
 * 세부 프로필 - 관심지역
 */

import type { Career } from '@/stores/detailProfile';
import type { SelectedPersonality } from '@/types/user';

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

const fetchGetPersonality = async () => {
  try {
    const response = await privateApi.get('/personality');
    return response.data;
  } catch (error) {
    console.error('fetchGetPersonality error : ', error);
  }
};

const fetchPostPersonality = async (data: SelectedPersonality[]) => {
  try {
    const response = await privateApi.post('/users/me/personality', {
      personality: data,
    });
    return response.data;
  } catch (error) {
    console.error('fetchPostPersonality error : ', error);
  }
};

export {
  fetchGetLocations,
  fetchGetPersonality,
  fetchGetPositions,
  fetchPostLocations,
  fetchPostPersonality,
  fetchPostPositions,
};
