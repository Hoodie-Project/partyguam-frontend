import type { PartyApplicationData } from '@/types/party';

import { privateApi } from '..';

// [GET] 지원자 목록 확인
// https://documenter.getpostman.com/view/16386957/2sB3WqszSQ#b8b413db-17ae-4785-9259-da7dda318609
export const fetchGetPartyRecruitmentApplications = async ({
  partyId,
  partyRecruitmentId,
  page = 1,
  size = 5,
  sort = 'createdAt',
  order = 'ASC',
  applicationStatus,
}: {
  partyId: number;
  partyRecruitmentId: number;
  page?: number;
  size?: number;
  sort?: 'createdAt';
  order?: string;
  applicationStatus?: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'DECLINED' | 'CLOSED';
}): Promise<PartyApplicationData> => {
  try {
    const response = await privateApi.get(`/parties/${partyId}/admin/recruitments/${partyRecruitmentId}/applications`, {
      params: {
        page,
        size,
        sort,
        order,
        ...(applicationStatus && { applicationStatus }), // status 값이 있을 때만 포함
      },
    });
    return response.data;
  } catch (error) {
    console.error('fetchPartyRecruitmentApplications error:', error);
    throw error;
  }
};

// [POST] (파티장) 지원 수락
// https://documenter.getpostman.com/view/16386957/2sB3WqszSQ#308b1192-ff42-4dfe-8224-2d21e727eb16
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

// [POST] (파티장) 파티 지원 거절
// https://documenter.getpostman.com/view/16386957/2sB3WqszSQ#e27f9cc8-acad-4277-bbac-e4381f2e314f
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
