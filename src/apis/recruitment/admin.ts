import { privateApi } from '..';

// [PATCH] 파티 모집 공고 완료 처리
// https://documenter.getpostman.com/view/16386957/2sB3WqszSQ#abcfcb1d-33a5-426e-a018-89092df44d00
export const fetchCompletePartyRecruitment = async ({
  partyId,
  partyRecruitmentId,
}: {
  partyId: number;
  partyRecruitmentId: number;
}) => {
  try {
    const response = await privateApi.patch(`/parties/${partyId}/admin/recruitments/${partyRecruitmentId}/completed`);
    return response.data;
  } catch (error) {
    console.error('fetchCompletePartyRecruitment error:', error);
    throw error;
  }
};

// [POST] 파티 모집 다수 데이터 (완료)상태 변경
export const fetchCompletePartyRecruitmentBatchUpdate = async ({
  partyId,
  partyRecruitmentIds,
}: {
  partyId: number;
  partyRecruitmentIds: number[];
}) => {
  try {
    const response = await privateApi.post(`/parties/${partyId}/admin/recruitments/batch-status`, {
      partyRecruitmentIds,
    });

    if (response.status === 204) {
      return { success: true };
    }
  } catch (error) {
    console.error('fetchCompletePartyRecruitmentBatchUpdate error:', error);
    return { success: false, error };
  }
};

// [PATCH] 파티 모집 수정
// https://documenter.getpostman.com/view/16386957/2sB3WqszSQ#0850461b-5380-45dc-909d-614bb03d0422
export const fetchUpdatePartyRecruitment = async ({
  partyId,
  partyRecruitmentId,
  positionId,
  content,
  maxParticipants,
}: {
  partyId: number;
  partyRecruitmentId: number;
  positionId: number;
  content: string;
  maxParticipants: number;
}) => {
  try {
    const response = await privateApi.patch(`/parties/${partyId}/admin/recruitments/${partyRecruitmentId}`, {
      positionId,
      content,
      maxParticipants,
    });
    return response.data;
  } catch (error) {
    console.error('fetchUpdatePartyRecruitment error:', error);
  }
};

// [POST] 파티 모집 삭제
// https://documenter.getpostman.com/view/16386957/2sB3WqszSQ#459e74cb-ab93-42b0-a02b-1d3bf22d90d3
export const fetchPostDeletePartyRecruitments = async ({
  partyId,
  recruitmentIds,
}: {
  partyId: number;
  recruitmentIds: number[];
}) => {
  try {
    const response = await privateApi.post(`/parties/${partyId}/admin/recruitments/batch-delete`, {
      partyRecruitmentIds: recruitmentIds,
    });
    return response.data;
  } catch (error) {
    console.error('fetchPostDeletePartyRecruitments error:', error);
  }
};

// 하나의 특정 파티 모집 삭제
export const fetchDeletePartyRecruitmentOnly = async ({
  partyId,
  partyRecruitmentId,
}: {
  partyId: number;
  partyRecruitmentId: number;
}) => {
  try {
    const response = await privateApi.delete(`/parties/${partyId}/admin/recruitments/${partyRecruitmentId}`);
    return response.data;
  } catch (error) {
    console.error('fetchDeletePartyRecruitmentOnly error:', error);
    throw error;
  }
};
