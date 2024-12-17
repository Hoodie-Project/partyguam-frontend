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
    const response = await privateApi.get('/personalities');
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

export type Party = {
  id: number;
  createdAt: string;
  position: {
    main: string; // 주요 포지션 (예: "기획")
    sub: string; // 세부 포지션 (예: "UI/UX 기획자")
  };
  party: {
    id: number;
    title: string; // 파티 제목
    image: string; // 이미지 경로
    status: 'active' | 'archived'; // 파티 상태
    partyType: {
      type: string; // 파티 유형 (예: "포트폴리오", "해커톤")
    };
  };
};

export type FetchGetUsersMePartiesResponse = {
  total: number;
  partyUsers: Party[];
};

const fetchGetUsersMeParties = async ({
  page = 1,
  limit = 5,
  sort = 'createdAt',
  order = 'ASC',
  status = 'all',
}: {
  page: number;
  limit: number;
  sort: string;
  order: string;
  status?: 'all' | 'active' | 'archived';
}): Promise<FetchGetUsersMePartiesResponse | null> => {
  try {
    // 쿼리 파라미터를 먼저 객체로 설정
    const params: any = {
      sort,
      order,
      limit,
      page,
    };

    if (status == 'active' || status == 'archived') {
      params.status = status;
    }

    const response = await privateApi.get('/users/me/parties', { params });
    return response.data;
  } catch (err) {
    console.error('fetchGetUsersMeParties error:', err);
    return null;
  }
};

export {
  fetchDeleteLocations,
  fetchDeletePersonality,
  fetchDeletePositions,
  fetchGetLocations,
  fetchGetPersonality,
  fetchGetPositions,
  fetchGetUsersMeParties,
  fetchPostLocations,
  fetchPostPersonality,
  fetchPostPositions,
};
