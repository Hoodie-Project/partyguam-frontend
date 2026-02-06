import { privateApi } from '..';

export interface HomeBanner {
  total: number;
  banner: {
    status: string;
    createdAt: string;
    updatedAt: string;
    id: number;
    title: string;
    image: string;
    link: string;
  }[];
}

// [GET] 배너 목록 조회
// https://documenter.getpostman.com/view/16386957/2sB3WqszSQ#13e53bbf-ff26-40dd-9798-ede8572a2df2
export const fetchGetBanner = async (): Promise<HomeBanner | null> => {
  try {
    const response = await privateApi.get('/banners?platform=web');
    return response.data;
  } catch (error) {
    console.error('fetchGetBanner error:', error);
    return null;
  }
};
