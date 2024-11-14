import type { PartyRecruitmentsResponse } from '@/types/home';

import { privateApi } from '.';

// [GET] 파티 모집 공고 목록 조회
export const fetchPartyRecruitments = async ({
  page,
  limit,
  sort,
  order,
  main,
  position,
  titleSearch,
}: {
  page: number;
  limit: number;
  sort: string;
  order: string;
  main?: string[];
  position?: number[];
  titleSearch?: string;
}): Promise<PartyRecruitmentsResponse | null> => {
  try {
    // 쿼리 파라미터를 객체로 설정
    const params: any = {
      page,
      limit,
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
