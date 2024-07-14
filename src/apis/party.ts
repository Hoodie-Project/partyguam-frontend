// 파티 생성하기 페이지

import { fileUploadApi, privateApi } from '.';

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

export const fetchPostRecruitmentParty = async ({
  partyId,
  data,
}: {
  partyId: number;
  data: {
    recruitments: {
      positionId: number;
      recruiting_count: number;
    }[];
  };
}) => {
  try {
    const response = await privateApi.post(`/parties/${partyId}/recruitments`, data);
    return response.data;
  } catch (error) {
    console.error('fetchPostApplyParty error : ', error);
    return error;
  }
};

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
