import { privateApi } from '..';

export interface ApplyPartyResponse {
  id: number;
  message: string;
  status: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'DECLINED' | 'CLOSED';
  createdAt: string; // ISO 8601 형식의 날짜 문자열
}

// [POST] (유저) 파티 지원하기
// https://documenter.getpostman.com/view/16386957/2sB3WqszSQ#ca045c15-54c1-48b5-a307-e32d0dc54147
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

// [GET] 나의 지원 확인
export const fetchGetMyPartyApplication = async ({
  partyId,
  partyRecruitmentId,
}: {
  partyId: number;
  partyRecruitmentId: number;
}) => {
  try {
    const response = await privateApi.get(`/parties/${partyId}/recruitments/${partyRecruitmentId}/applications/me`);
    return response.data;
  } catch (error) {
    console.error('fetchGetMyPartyApplication error : ', error);
    throw error;
  }
};

// [DELETE] 지원자 파티 지원 삭제(취소)
// https://documenter.getpostman.com/view/16386957/2sB3WqszSQ#82f17ba9-793e-4159-a58d-393d8c39f6ad
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

// [POST] 지원자 파티 최종 수락
// https://documenter.getpostman.com/view/16386957/2sB3WqszSQ#90035e36-118c-43f9-a6b6-33507f5d2f26
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

// [POST] 지원자 파티 지원자 거절
// https://documenter.getpostman.com/view/16386957/2sB3WqszSQ#cb1038df-2083-417c-ae6e-b67e0a621591
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
