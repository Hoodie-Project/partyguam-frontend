import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  isAxiosError,
} from 'axios';
import { getCookie } from 'cookies-next';

const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
const BASE_URL = isDev ? process.env.NEXT_PUBLIC_API_DEV_HOST : process.env.NEXT_PUBLIC_API_HOST;

const getResult = (response: AxiosResponse) => response;
axios.defaults.withCredentials = true;

class HttpClient {
  private client: AxiosInstance;
  private isRefreshing: boolean = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  public constructor(config?: AxiosRequestConfig) {
    this.client = axios.create(config);

    this.setInterceptor();
  }

  public get<T>(...args: Parameters<typeof this.client.get>) {
    return this.client.get<T>(...args).then(getResult);
  }

  public post<T>(...args: Parameters<typeof this.client.post>) {
    return this.client.post<T>(...args).then(getResult);
  }

  public put<T>(...args: Parameters<typeof this.client.put>) {
    return this.client.put<T>(...args).then(getResult);
  }

  public patch<T>(...args: Parameters<typeof this.client.patch>) {
    return this.client.patch<T>(...args).then(getResult);
  }

  public delete<T>(...args: Parameters<typeof this.client.delete>) {
    return this.client.delete<T>(...args).then(getResult);
  }

  private setInterceptor() {
    this.client.interceptors.request.use(this.onRequestFulfilled, this.onRequestRejected);
    this.client.interceptors.response.use(this.onResponseFulfilled, this.onResponseRejected);
  }

  private onRequestFulfilled = (config: InternalAxiosRequestConfig) => {
    const accessToken = window.localStorage.getItem('accessToken');

    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
      console.log('Authorization 헤더 추가됨');
    } else {
      console.warn('accessToken 없음, Authorization 헤더 미포함');
    }

    return config;
  };

  private onRequestRejected = (error: AxiosError) => {
    return Promise.reject(error);
  };

  private onResponseFulfilled = (response: AxiosResponse) => {
    return response;
  };

  private onResponseRejected = async (error: AxiosError) => {
    if (!isAxiosError(error) || !error.response) return Promise.reject(error);
    const { status: errorStatus, config } = error.response;

    if (errorStatus === 401) {
      const refreshToken = getCookie('refreshToken'); // refreshToken 확인

      if (!refreshToken) {
        return;
      }

      const retryOriginalRequest = new Promise<AxiosResponse>((resolve, reject) => {
        this.refreshSubscribers.push((token: string | null) => {
          if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            resolve(this.client(config)); // 새 토큰으로 원래 요청 재시도
          } else {
            reject(new Error('Failed to refresh token'));
          }
        });
      });

      if (!this.isRefreshing) {
        this.isRefreshing = true;

        try {
          const response = await axios.post(
            `${BASE_URL}/auth/access-token`,
            {},
            { withCredentials: true }, // 쿠키 포함 요청
          );

          const newAccessToken = response?.data?.accessToken;

          if (!newAccessToken) {
            throw new Error('No accessToken in refresh response');
          }

          // 새 토큰 저장
          window.localStorage.setItem('accessToken', newAccessToken);

          // 대기 중인 요청 처리
          this.refreshSubscribers.forEach(callback => callback(newAccessToken));
          this.refreshSubscribers = [];
        } catch (refreshError) {
          console.error('Refresh token request failed:', refreshError);

          // refreshToken 요청 실패 시 로그아웃
          this.refreshSubscribers.forEach(callback => callback('TOKEN_REFRESH_FAILED'));
          this.refreshSubscribers = [];
          this.handleRefreshTokenError();
        } finally {
          this.isRefreshing = false; // 플래그 초기화
        }
      }

      return retryOriginalRequest; // 대기 중인 요청 처리
    }

    // if (errorStatus === 500) {
    //   alert('로그인을 다시 해주세요');
    //   deleteCookie('accessToken');
    //   window.location.href = '/';
    // }

    return Promise.reject(error.response);
  };

  private handleRefreshTokenError() {
    window.localStorage.removeItem('accessToken');
    window.location.href = '/';
  }
}

export default HttpClient;
