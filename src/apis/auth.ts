import type { UsersMeResponse } from '@/types/user';

import { fileUploadApi, privateApi } from '.';

// [POST] accessToken 재발급
const fetchPostAccessToken = async () => {
  try {
    const response = await privateApi.post('/auth/access-token');
    return response.data;
  } catch (error) {
    console.error('error : ', error);
    throw new Error('Error fetching data');
  }
};

const fetchGetOauthInfo = async () => {
  try {
    const response = await privateApi.get('/users/me/oauth');
    return response.data;
  } catch (error) {
    console.error('error : ', error);
    throw new Error('Error fetching data');
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
const fetchJoinFormSubmit = async (data: { nickname: string; email: string; birth: string; gender: string }) => {
  try {
    const response = await privateApi.post('/users', {
      nickname: data.nickname,
      email: data.email,
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
  userId: number;
  authority: 'master' | 'deputy' | 'member';
}

// 내 정보 수정
export const fetchPatchUsers = async (data: FormData) => {
  try {
    const response = await fileUploadApi.post('/users/me', data);
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
      console.error('파티에 속한 유저를 찾을 수 없습니다.');
    } else {
      console.error('fetchUserAuthority error:', error);
    }
    return null;
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
const fetchGetUsersMeOauth = async () => {
  try {
    const response = await privateApi.get('/users/me/oauth');
    return response.data;
  } catch (error) {
    console.error('fetchUsersMeOauthProfile error : ', error);
    return error;
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
  fetchUserAuthority,
  fetchUsersLogOut,
  fetchUsersSignOut,
};
