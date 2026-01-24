import type { PartyRecruitmentsResponse } from '@/types/home';

import { privateApi } from '.';

export interface HomeBanner {
  total: number;
  banner: {
    status: string;
    createdAt: string;
    updatedAt: string;
    id: number;
    title: string;
    image: string;
    link: string;
  }[];
}
// [GET] 배너 전체 조회
export const fetchGetBanner = async (): Promise<HomeBanner | null> => {
  try {
    const response = await privateApi.get('/banner/web');
    return response.data;
  } catch (error) {
    console.error('fetchGetBanner error:', error);
    return null;
  }
};

// [GET] 파티 모집 공고 목록 조회
export const fetchPartyRecruitments = async ({
  page,
  size,
  sort,
  order,
  main,
  position,
  partyType,
  titleSearch,
}: {
  page: number;
  size: number;
  sort: string;
  order: string;
  main?: string[];
  position?: number[];
  partyType?: number[];
  titleSearch?: string;
}): Promise<PartyRecruitmentsResponse | null> => {
  try {
    // 쿼리 파라미터를 객체로 설정
    const params: any = {
      page,
      size,
      sort,
      order,
    };

    // main이 배열로 존재하고 길이가 0보다 큰 경우에만 추가
    if (main && main.length > 0) {
      params.main = main;
    }

    // position이 배열로 존재하고 길이가 0보다 큰 경우에만 추가
    if (position && position.length > 0) {
      params.position = position;
    }
    // position이 배열로 존재하고 길이가 0보다 큰 경우에만 추가
    if (partyType && partyType.length > 0) {
      params.partyType = partyType;
    }

    // titleSearch가 존재할 때만 추가
    if (titleSearch) {
      params.titleSearch = titleSearch;
    }

    const response = await privateApi.get(`/parties/recruitments`, { params });
    return response.data;
  } catch (error) {
    console.error('fetchPartyRecruitments error:', error);
    return null;
  }
};

interface PartyType {
  id: number;
  type: string;
}

interface Party {
  id: number;
  partyType: PartyType;
  title: string;
  content: string;
  image: string;
  partyStatus: 'IN_PROGRESS' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  recruitmentCount: number;
}

export interface PartiesResponse {
  parties: Party[];
  total: number;
}

interface FetchPartiesParams {
  page: number;
  size: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  partyStatus?: 'IN_PROGRESS' | 'CLOSED';
  partyType?: number[];
  titleSearch?: string;
}

// [GET] 파티 목록 조회
export const fetchParties = async ({
  page,
  size,
  sort = 'createdAt',
  order = 'ASC',
  partyStatus,
  partyType,
  titleSearch,
}: FetchPartiesParams): Promise<PartiesResponse | null> => {
  try {
    // 쿼리 파라미터 객체 설정
    const params: any = {
      page,
      size,
      sort,
      order,
    };

    // status가 존재할 경우에만 추가
    if (partyStatus) {
      params.partyStatus = partyStatus;
    }

    // partyType이 배열로 존재하고 길이가 0보다 큰 경우에만 추가
    if (partyType && partyType.length > 0) {
      params.partyType = partyType;
    }

    // titleSearch가 배열로 존재하고 길이가 0보다 큰 경우에만 추가
    if (titleSearch && titleSearch.length > 0) {
      params.titleSearch = titleSearch;
    }

    const response = await privateApi.get('/parties', { params });
    return response.data;
  } catch (error: any) {
    console.error('fetchParties error:', error);
    return null;
  }
};

// [GET] 개인화된 파티 모집 공고 목록 조회
export const fetchPersonalizedPartiesRecruitments = async ({
  page,
  size,
  sort = 'createdAt',
  order = 'ASC',
}: {
  page: number;
  size: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}): Promise<PartyRecruitmentsResponse | null> => {
  try {
    const params: any = {
      page,
      size,
      sort,
      order,
    };

    const response = await privateApi.get('/parties/recruitments/personalized', { params });
    return response.data;
  } catch (error: any) {
    console.error('fetchPersonalizedParties error:', error);
    return null;
  }
};
