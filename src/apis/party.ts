import type { PartyApplicationData, PartyUserListByAdminResponse, PartyUserResponse } from '@/types/party';

import { fileUploadApi, privateApi, publicApi } from '.';

// 파티 생성하기 페이지

export const fetchGetPartyTypes = async () => {
  try {
    const response = await publicApi.get('/parties/types');
    return response.data;
  } catch (error) {
    console.error('fetchGetPartyTypes error : ', error);
    return error;
  }
};

/**
 * [GET] 포지션 항목 조회 api, main string없으면 전체 리스트 반환
 * (main: 기획자, 디자이너, 개발자, 마케터/광고)
 */
export const fetchGetPositions = async (main?: string) => {
  try {
    const response = await publicApi.get('/positions', {
      params: {
        ...(main && { main }),
      },
    });
    return response.data;
  } catch (error) {
    console.error('fetchGetPositions error : ', error);
    return error;
  }
};

export interface CreatePartyResponse {
  partyTypeId: number;
  title: string;
  content: string;
  image: any;
  status: string;
  createdAt: string;
  updatedAt: string;
  id: number;
}

export const fetchPostCreateParty = async (data: FormData): Promise<CreatePartyResponse | null> => {
  try {
    const response = await fileUploadApi.post<CreatePartyResponse>('/parties', data);
    return response.data;
  } catch (error) {
    console.error('fetchPostCreateParty error:', error);
    // 에러를 호출하는 쪽에서 처리하게 하려면 아래와 같이 `throw` 처리 가능
    throw error;
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
// API 응답 타입 정의
export interface ApplyPartyResponse {
  id: number;
  message: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected'; // 상태값 제한
  createdAt: string; // ISO 8601 형식의 날짜 문자열
}

export const fetchPostApplyParty = async ({
  partyId,
  partyRecruitmentId,
  body,
}: {
  partyId: number;
  partyRecruitmentId: number;
  body: { message: string };
}): Promise<ApplyPartyResponse> => {
  try {
    const response = await privateApi.post<ApplyPartyResponse>(
      `/parties/${partyId}/recruitments/${partyRecruitmentId}/applications`,
      body,
    );
    return response.data;
  } catch (error) {
    console.error('fetchPostApplyParty error : ', error);
    throw error;
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
  page,
  limit,
  sort,
  order,
  main,
  nickname,
}: {
  partyId: number;
  page: number;
  limit: number;
  sort: string;
  order: string;
  main?: string;
  nickname?: string;
}): Promise<PartyUserResponse | null> => {
  try {
    // 쿼리 파라미터를 먼저 객체로 설정
    const params: any = {
      sort,
      order,
      limit,
      page,
    };

    // main과 nickname이 존재할 때만 추가
    if (main && main !== '전체') {
      params.main = main;
    }
    if (nickname) {
      params.nickname = nickname;
    }

    const response = await privateApi.get(`/parties/${partyId}/users`, { params });
    return response.data;
  } catch (error) {
    console.error('fetchGetPartyUsers error:', error);
    return null;
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
    const response = await privateApi.get(`/parties/recruitments/${partyRecruitmentId}`);
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

// 파티 모집 단일 조회 /dev/api/parties/recruitments/{partyRecruitmentId}
export const fetchPartyRecruitmentDetails = async (partyRecruitmentId: number) => {
  try {
    const response = await publicApi.get(`/parties/recruitments/${partyRecruitmentId}`);
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

// [POST] 파티원 다수 내보내기 /dev/api/parties/{partyId}/users/batch-delete
export const fetchBatchDeletePartyUsers = async ({
  partyId,
  partyUserIds,
}: {
  partyId: number;
  partyUserIds: number[];
}) => {
  try {
    const response = await privateApi.post(`/parties/${partyId}/users/batch-delete`, {
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
    const response = await privateApi.patch(`/parties/${partyId}/admin/users/${partyUserId}`, {
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
  status?: 'processing' | 'approved' | 'pending' | 'rejected';
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

// [POST] (지원자) 파티 지원자 승인 /dev/api/parties/{partyId}/applications/{partyApplicationId}/approval
export const fetchApprovePartyApplication = async ({
  partyId,
  partyApplicationId,
}: {
  partyId: number;
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

// [POST] (파티장) 파티 지원자 승인 /dev/api/parties/{partyId}/applications/{partyApplicationId}/approval
export const fetchAdminApprovePartyApplication = async ({
  partyId,
  partyApplicationId,
}: {
  partyId: number;
  partyApplicationId: number;
}) => {
  try {
    const response = await privateApi.post(`/parties/${partyId}/admin/applications/${partyApplicationId}/approval`);
    return response.data;
  } catch (error) {
    console.error('fetchApprovePartyApplication error:', error);
    return error;
  }
};

// [POST] (지원자) 파티 지원자 거절 /dev/api/parties/{partyId}/applications/{partyApplicationId}/rejection
export const fetchRejectPartyApplication = async ({
  partyId,
  partyApplicationId,
}: {
  partyId: number;
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

// [POST] (파티장) 파티 지원자 거절 /dev/api/parties/{partyId}/applications/{partyApplicationId}/rejection
export const fetchAdminRejectPartyApplication = async ({
  partyId,
  partyApplicationId,
}: {
  partyId: number;
  partyApplicationId: number;
}) => {
  try {
    const response = await privateApi.post(`/parties/${partyId}/admin/applications/${partyApplicationId}/rejection`);
    return response.data;
  } catch (error) {
    console.error('fetchRejectPartyApplication error:', error);
    return error;
  }
};

// [DELETE] (지원자) 파티 지원 삭제(취소)
export const fetchDeletePartyApplication = async ({
  partyId,
  partyApplicationId,
}: {
  partyId: number;
  partyApplicationId: number;
}): Promise<void> => {
  try {
    const response = await privateApi.delete(`/parties/${partyId}/applications/${partyApplicationId}`);
    console.log('파티 지원 삭제 성공:', response.status);
  } catch (error) {
    console.error('fetchDeletePartyApplication error:', error);
    throw error;
  }
};
