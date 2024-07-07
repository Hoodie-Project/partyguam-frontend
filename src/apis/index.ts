import HttpClient from './httpClient';

const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
const BASE_URL = isDev ? process.env.NEXT_PUBLIC_API_DEV_HOST : process.env.NEXT_PUBLIC_API_HOST;

export const publicApi = new HttpClient({
  baseURL: `${BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// https://github.com/axios/axios/releases/tag/v1.6.2
export const privateApi = new HttpClient({
  baseURL: `${BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  withXSRFToken: true,
});

export const fileUploadApi = new HttpClient({
  baseURL: `${BASE_URL}`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,
  withXSRFToken: true,
});
