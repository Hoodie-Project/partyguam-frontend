import { privateApi } from '..';

// [GET] 파티 모집 목록 조회
// https://documenter.getpostman.com/view/16386957/2sB3WqszSQ#52a75b4a-a976-4171-b32c-e563158f0133
/**
 * @Params partyId(파티 아이디; number), sort('createdAt'), order('ASC', 'DESC'), completed('true', 'false'), main('기획자', '디자이너', '개발자', '마케터/광고')
 */
export const fetchGetPartyRecruitmentsList = async ({
  partyId,
  sort = 'createdAt',
  order = 'ASC',
  completed = false,
  main,
}: {
  partyId: number;
  completed: boolean;
  sort?: string;
  order?: string;
  main?: string;
}) => {
  try {
    const response = await privateApi.get(`/parties/${partyId}/recruitments`, {
      params: {
        sort,
        order,
        completed,
        ...(main && { main }), // main 값이 있을 때만 쿼리 파라미터에 포함
      },
    });
    return response.data;
  } catch (error) {
    console.error('fetchGetPartyRecruitmentsList error: ', error);
    throw error;
  }
};

// [POST] 파티 모집 생성
// https://documenter.getpostman.com/view/16386957/2sB3WqszSQ#51d1e154-1c62-4669-98d7-4438eac138b2
export const fetchPostRecruitmentParty = async ({
  partyId,
  positionId,
  content,
  recruiting_count,
}: {
  partyId: number;
  positionId: number;
  content: string;
  recruiting_count: number;
}) => {
  try {
    const response = await privateApi.post(`/parties/${partyId}/recruitments`, {
      positionId,
      content,
      recruiting_count,
    });
    return response.data;
  } catch (error) {
    console.error('fetchPostRecruitmentParty error:', error);
    return error;
  }
};

// [GET] 파티 모집 단일 조회
// https://documenter.getpostman.com/view/16386957/2sB3WqszSQ#6e70a6c5-3e6c-430e-adda-c35c4d0bee31
export const fetchPartyRecruitmentDetails = async (partyRecruitmentId: number) => {
  try {
    const response = await privateApi.get(`/parties/recruitments/${partyRecruitmentId}`);
    return response.data;
  } catch (error) {
    console.error('fetchPartyRecruitmentDetails error:', error);
    return null;
  }
};
