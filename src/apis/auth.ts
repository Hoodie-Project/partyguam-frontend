import type { UsersMeResponse } from '@/types/user';

import type { FetchGetUsersMePartiesResponse } from './detailProfile';

import { fileUploadApi, privateApi, withOttApi } from '.';

// [POST] accessToken 재발급
const fetchPostAccessToken = async (): Promise<{ accessToken: string }> => {
  try {
    const response = await privateApi.post<{ accessToken: string }>('/auth/access-token');
    return response.data;
  } catch (error) {
    console.error('error : ', error);
    throw error; // 혹은 필요한 처리
  }
};

const fetchGetOauthInfo = async () => {
  try {
    const response = await privateApi.get('/users/me/oauth');
    return response.data;
  } catch (error) {
    console.error('error : ', error);
    // throw new Error('Error fetching data');
  }
};

/**
 * 회원가입 닉네임 중복 검사시
 * @param nickname string
 * @returns
 * 200: 중복 안됨, false 반환
 * 409error: 중복됨, true 반환
 */
const fetchNicknameDuplicated = async (nickname: string) => {
  try {
    const response = await withOttApi.get('/users/check-nickname', {
      params: { nickname },
    });

    if (response.status === 200) {
      return false;
    }
    if (response.data.statusCode === 409) {
      return true;
    } else {
      throw new Error('Error fetching data');
    }
  } catch (error) {
    return true;
  }
};

/**
 * 회원가입 폼 제출시
 * @param form data: { nickname: string; birth: string; gender: string }
 * @returns refreshToken - cookie
 */
const fetchJoinFormSubmit = async (data: { birth: string; nickname: string; gender: string }) => {
  try {
    const response = await withOttApi.post('/users', {
      nickname: data.nickname,
      birth: data.birth,
      gender: data.gender,
    });

    return response;
  } catch (error) {
    throw new Error('Network error');
  }
};

/**
 * 내 정보 조회
 */

const fetchGetUsers = async (): Promise<UsersMeResponse> => {
  try {
    const response = await privateApi.get('/users/me');
    return response.data;
  } catch (error) {
    throw new Error('fetchGetUsers Network error');
  }
};

export interface UserAuthorityResponse {
  id: number;
  authority: 'MASTER' | 'DEPUTY' | 'MEMBER';
  position: {
    id: number;
    main: string;
    sub: string;
  };
}

/**
 * 파티 유저 조회
 * @param nickname
 * @returns UsersMeResponse 와 타입 동일
 */
export const fetchGetUserByNickname = async (nickname: string): Promise<UsersMeResponse> => {
  try {
    const response = await privateApi.get<UsersMeResponse>('/users/profile', {
      params: { nickname },
    });
    return response.data;
  } catch (error) {
    throw new Error('fetchGetUserByNickname Network Error');
  }
};

/**
 * 파티 유저의 파티 리스트 조회
 * @param page, limit, sort, order, status
 * @returns FetchGetUsersMePartiesResponse와 타입 동일
 */
export const fetchGetUsersNicknameParties = async ({
  nickname = '',
  page = 1,
  size = 5,
  sort = 'createdAt',
  order = 'ASC',
  partyStatus,
}: {
  nickname: string;
  page: number;
  size: number;
  sort: string;
  order: string;
  partyStatus?: 'IN_PROGRESS' | 'CLOSED';
}): Promise<FetchGetUsersMePartiesResponse | null> => {
  try {
    // 쿼리 파라미터를 먼저 객체로 설정
    const params: any = {
      sort,
      order,
      size,
      page,
      nickname,
    };

    if (partyStatus) {
      params.partyStatus = partyStatus;
    }

    const response = await privateApi.get(`/parties/users`, { params });
    return response.data;
  } catch (err) {
    console.error('fetchGetUsersMeParties error:', err);
    return null;
  }
};

// 내 정보 수정
export const fetchPatchUsers = async (data: FormData) => {
  try {
    const response = await fileUploadApi.patch('/users/me', data);
    return response.data;
  } catch (error) {
    console.error('fetchPatchUsers error : ', error);
    return error;
  }
};
// 나의 파티 권한 조회

/**
 * 나의 파티 권한 조회
 * @param partyId
 * @returns   "authority": "master"
 */
const fetchUserAuthority = async (partyId: number): Promise<UserAuthorityResponse | null> => {
  try {
    const response = await privateApi.get(`/parties/${partyId}/users/me/authority`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error('파티에 속한 유저를 찾을 수 없습니다.');
    } else {
      throw new Error('fetchUserAuthority error:', error);
    }
  }
};

// 로그아웃
const fetchUsersLogOut = async () => {
  try {
    const response = await privateApi.delete('/users/logout');
    return response.data;
  } catch (error) {
    console.error('fetchUsersLogOut error : ', error);
    return error;
  }
};

// 회원 탈퇴
const fetchUsersSignOut = async () => {
  try {
    const accessToken = window.localStorage.getItem('accessToken');

    const response = await privateApi.delete('/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log('fetchUsersSignOut error : ', error);

    throw error;
  }
};

// session에서 Oauth 본인 데이터 호출(email, image)
const fetchGetUsersMeOauthProfile = async () => {
  try {
    const response = await withOttApi.get('/ott/signup/context');
    return response.data;
  } catch (error) {
    console.error('fetchUsersMeOauthProfile error : ', error);
    return error;
  }
};

// 나의 소셜 계정 조회 /dev/api/users/me/oauth
export interface GetUsersMeOauthResponse {
  email: string;
  image: string | null;
  provider: 'KAKAO' | 'GOOGLE';
}
const fetchGetUsersMeOauth = async (): Promise<GetUsersMeOauthResponse[] | null> => {
  try {
    const response = await privateApi.get('/users/me/oauth');
    return response.data;
  } catch (error) {
    console.error('fetchUsersMeOauthProfile error : ', error);
    return null;
  }
};

// 계정 연동 (웹): /auth/oauth/:provider/link
const fetchPostUsersMeOauthLink = async (provider: 'kakao' | 'google') => {
  try {
    const response = await privateApi.get(`/auth/oauth/${provider}/link`);
    return response.data;
  } catch (err) {
    console.error('fetchPostUsersMeOauthLink error : ', err);
    return err;
  }
};

export interface PartyApplicationResponse {
  total: number;
  partyApplications: PartyApplication[];
}

export interface PartyApplication {
  id: number;
  message: string;
  status: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'DECLINED' | 'CLOSED';
  createdAt: string;
  partyRecruitment: {
    id: number;
    completed: boolean;
    position: {
      main: string;
      sub: string;
    };
    party: {
      id: number;
      title: string;
      image: string;
      partyType: {
        type: string; // "포트폴리오"와 같은 값
      };
    };
  };
}

// [GET] 파티 포지션 모집별 지원자 목록 조회 API
export const fetchGetUsersMePartiesApplications = async ({
  page = 1,
  size = 5,
  sort = 'createdAt',
  order = 'ASC',
  partyApplicationStatus,
}: {
  page?: number;
  size?: number;
  sort?: 'createdAt';
  order?: string;
  partyApplicationStatus?: 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'DECLINED' | 'CLOSED' | 'ALL';
}): Promise<PartyApplicationResponse> => {
  try {
    const response = await privateApi.get(`/users/me/parties/applications`, {
      params: {
        page,
        size,
        sort,
        order,
        ...(partyApplicationStatus && partyApplicationStatus !== 'ALL' && { partyApplicationStatus }),
      },
    });
    return response.data;
  } catch (error) {
    console.error('fetchPartyRecruitmentApplications error:', error);
    throw error;
  }
};

const fetchPostUsersRecover = async () => {
  try {
    const response = await privateApi.post('/users/recover/web');
    return response.data;
  } catch (error) {
    console.error('error : ', error);
  }
};

const fetchPostUsersAppOpen = async (): Promise<{ status: number; data: any }> => {
  try {
    const response = await privateApi.post('/users/app-open');
    return { status: response.status, data: response.data };
  } catch (error: any) {
    return {
      status: error?.status ?? 500,
      data: error?.data ?? null,
    };
  }
};

export {
  fetchGetOauthInfo,
  fetchGetUsers,
  fetchGetUsersMeOauth,
  fetchGetUsersMeOauthProfile,
  fetchJoinFormSubmit,
  fetchNicknameDuplicated,
  fetchPostAccessToken,
  fetchPostUsersAppOpen,
  fetchPostUsersMeOauthLink,
  fetchPostUsersRecover,
  fetchUserAuthority,
  fetchUsersLogOut,
  fetchUsersSignOut,
};
