import type { PartyApplicationData, PartyUserListByAdminResponse } from '@/types/party';

import { fileUploadApi, privateApi } from '.';

// 파티 생성하기 페이지

export const fetchGetPartyTypes = async () => {
  try {
    const response = await privateApi.get('/parties/types');
    return response.data;
  } catch (error) {
    console.error('fetchGetPartyTypes error : ', error);
    return error;
  }
};

export const fetchGetPositions = async () => {
  try {
    const response = await privateApi.get('/positions');
    return response.data;
  } catch (error) {
    console.error('fetchGetPositions error : ', error);
    return error;
  }
};

export const fetchPostCreateParty = async (data: FormData) => {
  try {
    const response = await fileUploadApi.post('/parties', data);
    return response.data;
  } catch (error) {
    console.error('fetchPostCreateParty error : ', error);
    return error;
  }
};

// 파티 모집 생성하기
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

// 파티 지원하기 페이지
export const fetchPostApplyParty = async ({
  partyId,
  partyRecruitmentId,
}: {
  partyId: number;
  partyRecruitmentId: number;
}) => {
  try {
    const response = await privateApi.post(`/parties/${partyId}/recruitments/${partyRecruitmentId}/applications`);
    return response.data;
  } catch (error) {
    console.error('fetchPostApplyParty error : ', error);
    return error;
  }
};

// 파티 페이지 - 홈탭
export const fetchGetPartyHome = async ({ partyId }: { partyId: number }) => {
  try {
    const response = await privateApi.get(`parties/${partyId}`);
    return response.data;
  } catch (error) {
    console.error('fetchGetPartyHome error : ', error);
  }
};

// 파티 페이지 - 파티원탭
export const fetchGetPartyUsers = async ({
  partyId,
  sort,
  order,
  main,
  nickname,
}: {
  partyId: number;
  sort: string;
  order: string;
  main?: string;
  nickname?: string;
}) => {
  try {
    const response = await privateApi.get(`parties/${partyId}/users`, {
      params: { sort, order, main, nickname },
    });
    return response.data;
  } catch (error) {
    console.error('fetchGetPartyUsers error : ', error);
  }
};

// 리포트 제출 함수
export const fetchPostReports = async ({
  type,
  typeId,
  content,
}: {
  type: string;
  typeId: number;
  content: string;
}) => {
  try {
    const response = await privateApi.post(`reports`, {
      type,
      typeId,
      content,
    });
    return response.data;
  } catch (error) {
    console.error('fetchPostReports error : ', error);
  }
};

// 파티 모집 리스트 조회
export const fetchGetPartyRecruitmentsList = async ({
  partyId,
  sort = 'createdAt',
  order = 'ASC',
  main,
}: {
  partyId: number;
  sort?: string;
  order?: string;
  main?: string;
}) => {
  try {
    const response = await privateApi.get(`/parties/${partyId}/recruitments`, {
      params: {
        sort,
        order,
        ...(main && { main }), // main 값이 있을 때만 쿼리 파라미터에 포함
      },
    });
    return response.data;
  } catch (error) {
    console.error('fetchGetPartyRecruitmentsList error: ', error);
    throw error;
  }
};

// 파티 모집 상세 조회
export const fetchGetPartyRecruitments = async ({ partyRecruitmentId }: { partyRecruitmentId: number }) => {
  try {
    const response = await privateApi.get(`parties/recruitments/${partyRecruitmentId}`);
    return response.data;
  } catch (error) {
    console.error('fetchGetPartyRecruitments error : ', error);
  }
};

// 여러 개의 특정 파티 모집 삭제
export const fetchDeletePartyRecruitments = async ({
  partyId,
  recruitmentIds,
}: {
  partyId: number;
  recruitmentIds: number[];
}) => {
  try {
    const response = await privateApi.post(`/parties/${partyId}/recruitments/batch-delete`, {
      partyRecruitmentIds: recruitmentIds,
    });
    return response.data;
  } catch (error) {
    console.error('fetchDeletePartyRecruitments error:', error);
  }
};

// 파티 모집 수정
export const fetchUpdatePartyRecruitment = async ({
  partyId,
  partyRecruitmentId,
  positionId,
  content,
  recruiting_count,
}: {
  partyId: number;
  partyRecruitmentId: number;
  positionId: number;
  content: string;
  recruiting_count: number;
}) => {
  try {
    const response = await privateApi.patch(`/parties/${partyId}/recruitments/${partyRecruitmentId}`, {
      positionId,
      content,
      recruiting_count,
    });
    return response.data;
  } catch (error) {
    console.error('fetchUpdatePartyRecruitment error:', error);
  }
};

// 파티 모집 단일 조회
export const fetchPartyRecruitmentDetails = async (partyRecruitmentId: number) => {
  try {
    const response = await privateApi.get(`/parties/recruitments/${partyRecruitmentId}`);
    return response.data;
  } catch (error) {
    console.error('fetchPartyRecruitmentDetails error:', error);
    return null;
  }
};

// [GET] 관리자-파티원 목록 조회
export const fetchPartyAdminUsers = async ({
  partyId,
  sort,
  order,
  main,
  nickname,
}: {
  partyId: number;
  sort: string;
  order: string;
  main?: string;
  nickname?: string;
}): Promise<PartyUserListByAdminResponse | null> => {
  try {
    // 쿼리 파라미터를 먼저 객체로 설정
    const params: any = {
      sort,
      order,
      limit: 17,
      page: 1,
    };

    // main과 nickname이 존재할 때만 추가
    if (main && main !== '전체') {
      params.main = main;
    }
    if (nickname) {
      params.nickname = nickname;
    }

    const response = await privateApi.get(`/parties/${partyId}/admin/users`, { params });
    return response.data;
  } catch (error) {
    console.error('fetchPartyAdminUsers error:', error);
    return null;
  }
};

// [POST] 파티원 다수 내보내기
export const fetchBatchDeletePartyUsers = async ({
  partyId,
  partyUserIds,
}: {
  partyId: number;
  partyUserIds: number[];
}) => {
  try {
    const response = await privateApi.post(`/parties/${partyId}/party-users/batch-delete`, {
      partyUserIds,
    });
    return response.data;
  } catch (error) {
    console.error('fetchBatchDeletePartyUsers error:', error);
    return error;
  }
};

// [POST] 파티장 위임
export const fetchDelegateParty = async ({ partyId, delegateUserId }: { partyId: number; delegateUserId: number }) => {
  try {
    const response = await privateApi.post(`/parties/${partyId}/delegation`, {
      delegateUserId,
    });
    return response.data;
  } catch (error) {
    console.error('fetchDelegateParty error:', error);
    return error;
  }
};

// [PATCH] 파티원 데이터 변경
export const fetchUpdatePartyUserPosition = async ({
  partyId,
  partyUserId,
  positionId,
}: {
  partyId: number;
  partyUserId: number;
  positionId: number;
}) => {
  try {
    const response = await privateApi.patch(`/parties/${partyId}/party-users/${partyUserId}`, {
      positionId,
    });
    return response.data;
  } catch (error) {
    console.error('fetchUpdatePartyUserPosition error:', error);
    return error;
  }
};

// [GET] 파티 포지션 모집별 지원자 목록 조회 API
export const fetchPartyRecruitmentApplications = async ({
  partyId,
  partyRecruitmentId,
  page = 1,
  limit = 5,
  sort = 'createdAt',
  order = 'ASC',
  status,
}: {
  partyId: number;
  partyRecruitmentId: number;
  page?: number;
  limit?: number;
  sort?: 'createdAt';
  order?: string;
  status?: 'active' | 'approved' | 'pending' | 'rejected';
}): Promise<PartyApplicationData> => {
  try {
    const response = await privateApi.get(`/parties/${partyId}/recruitments/${partyRecruitmentId}/applications`, {
      params: {
        page,
        limit,
        sort,
        order,
        ...(status && { status }), // status 값이 있을 때만 포함
      },
    });
    return response.data;
  } catch (error) {
    console.error('fetchPartyRecruitmentApplications error:', error);
    throw error;
  }
};

// [POST] 파티 지원자 승인
export const fetchApprovePartyApplication = async ({
  partyId,
  partyRecruitmentId,
  partyApplicationId,
}: {
  partyId: number;
  partyRecruitmentId: number;
  partyApplicationId: number;
}) => {
  try {
    const response = await privateApi.post(`/parties/${partyId}/applications/${partyApplicationId}/approval`);
    return response.data;
  } catch (error) {
    console.error('fetchApprovePartyApplication error:', error);
    return error;
  }
};

// [POST] 파티 지원자 거절
export const fetchRejectPartyApplication = async ({
  partyId,
  partyRecruitmentId,
  partyApplicationId,
}: {
  partyId: number;
  partyRecruitmentId: number;
  partyApplicationId: number;
}) => {
  try {
    const response = await privateApi.post(`/parties/${partyId}/applications/${partyApplicationId}/rejection`);
    return response.data;
  } catch (error) {
    console.error('fetchRejectPartyApplication error:', error);
    return error;
  }
};
