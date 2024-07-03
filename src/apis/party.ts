// 파티 생성하기 페이지

import { privateApi } from '.';

export const fetchGetPartyTypes = async () => {
  try {
    const response = await privateApi.get('/parties/types');
    return response.data;
  } catch (error) {
    console.error('fetchGetPartyTypes error : ', error);
    return error;
  }
};
