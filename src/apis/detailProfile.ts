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
    return error;
  }
};

const fetchPostLocations = async (
  data: {
    id: number;
  }[],
) => {
  try {
    const response = await privateApi.post('/users/me/locations', {
      locations: data,
    });
    return response.data;
  } catch (error) {
    console.error('fetchPostLocations error : ', error);
    return error;
  }
};

const fetchDeleteLocations = async () => {
  try {
    const response = await privateApi.delete('/users/me/locations');
    return response.data;
  } catch (error) {
    console.error('fetchDeleteLocations error : ', error);
    return error;
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
    return error;
  }
};

const fetchPostPositions = async (data: Career[]) => {
  try {
    const response = await privateApi.post('/users/me/careers', {
      career: data,
    });
    return response.data;
  } catch (error) {
    console.error('fetchPostPositions error : ', error);
    return error;
  }
};

const fetchDeletePositions = async () => {
  try {
    const response = await privateApi.delete('/users/me/careers');
    return response.data;
  } catch (error) {
    console.error('fetchDeleteLocations error : ', error);
    return error;
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
    return error;
  }
};

const fetchPostPersonality = async (data: SelectedPersonality[]) => {
  try {
    const response = await privateApi.post('/users/me/personalities', {
      personality: data,
    });
    return response.data;
  } catch (error) {
    console.error('fetchPostPersonality error : ', error);
    return error;
  }
};

const fetchDeletePersonality = async (personalityQuestionId: number) => {
  try {
    const response = await privateApi.delete(`/users/me/personalities/questions/${personalityQuestionId}`);
    return response.data;
  } catch (error) {
    console.error('fetchDeletePersonality error : ', error);
    return error;
  }
};

export {
  fetchDeleteLocations,
  fetchDeletePersonality,
  fetchDeletePositions,
  fetchGetLocations,
  fetchGetPersonality,
  fetchGetPositions,
  fetchPostLocations,
  fetchPostPersonality,
  fetchPostPositions,
};
