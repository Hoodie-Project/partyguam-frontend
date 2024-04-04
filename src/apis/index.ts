import HttpClient from './httpClient';

export const publicApi = new HttpClient({
  baseURL: `${process.env.NEXT_PUBLIC_API_HOST}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const privateApi = new HttpClient({
  baseURL: `${process.env.NEXT_PUBLIC_API_HOST}`,
  headers: {
    'Content-Type': 'application/json',
    withCredentials: true,
  },
});

export const fileUploadInstance = new HttpClient({
  baseURL: `${process.env.NEXT_PUBLIC_API_HOST}`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,
});

export * from './join';
