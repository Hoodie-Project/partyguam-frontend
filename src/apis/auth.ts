import type { UsersMeResponse } from '@/types/user';

import { fileUploadApi, privateApi } from '.';

// [POST] accessToken 재발급
const fetchPostAccessToken = async () => {
  try {
    const response = await privateApi.post('/auth/access-token');
    return response.data;
  } catch (error) {
    console.error('error : ', error);
    // throw new Error('Error fetching data');
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
    const response = await privateApi.get('/users/check-nickname', {
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
 * @param form data: { nickname: string; email: string; birth: string; gender: string }
 * @returns refreshToken - cookie
 */
const fetchJoinFormSubmit = async (data: { nickname: string; birth: string; gender: string }) => {
  try {
    const response = await privateApi.post('/users', {
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
  authority: 'master' | 'deputy' | 'member';
  position: {
    id: number;
    main: string;
    sub: string;
  };
}

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
    const response = await privateApi.delete('/users/signout');
    return response.data;
  } catch (error) {
    console.error('fetchUsersSignOut error : ', error);
    return error;
  }
};

// session에서 Oauth 본인 데이터 호출(email, image)
const fetchGetUsersMeOauthProfile = async () => {
  try {
    const response = await privateApi.get('/users/me/oauth/profile');
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
  provider: 'kakao' | 'google';
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

// 계정 연동
const fetchPostUsersMeOauthLink = async () => {
  try {
    const response = await privateApi.post('/users/me/oauth/link');
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
  status: 'pending' | 'processing' | 'approved' | 'rejected'; // 상태에 따라 Union 타입 정의
  createdAt: string;
  partyRecruitment: {
    id: number;
    status: string; // 'active' | 'completed'
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
  limit = 5,
  sort = 'createdAt',
  order = 'ASC',
  status,
}: {
  page?: number;
  limit?: number;
  sort?: 'createdAt';
  order?: string;
  status?: 'processing' | 'approved' | 'pending' | 'rejected' | 'all';
}): Promise<PartyApplicationResponse> => {
  try {
    const response = await privateApi.get(`/users/me/parties/applications`, {
      params: {
        page,
        limit,
        sort,
        order,
        ...(status && status != 'all' && { status }), // status 값이 있을 때만 포함
      },
    });
    return response.data;
  } catch (error) {
    console.error('fetchPartyRecruitmentApplications error:', error);
    throw error;
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
  fetchPostUsersMeOauthLink,
  fetchUserAuthority,
  fetchUsersLogOut,
  fetchUsersSignOut,
};
