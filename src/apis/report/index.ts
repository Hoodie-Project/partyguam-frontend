import { privateApi } from '..';

// [POST] 신고하기
// https://documenter.getpostman.com/view/16386957/2sB3WqszSQ#830027c7-2534-4439-936c-19d4521e5e5d
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
    const response = await privateApi.post(`/reports`, {
      type,
      typeId,
      content,
    });
    return response.data;
  } catch (error) {
    console.error('fetchPostReports error : ', error);
  }
};
