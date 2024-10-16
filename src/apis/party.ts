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
        main,
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
