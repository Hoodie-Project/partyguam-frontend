import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  isAxiosError,
} from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

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
    const accessToken = getCookie('accessToken');

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
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
      const retryOriginalRequest = new Promise<AxiosResponse>(resolve => {
        this.refreshSubscribers.push((token: string) => {
          config.headers['Authorization'] = `Bearer ${token}`;
          resolve(this.client(config));
        });
      });

      if (!this.isRefreshing) {
        this.isRefreshing = true;

        try {
          const response = await axios.post(`${BASE_URL}/auth/access-token`, { withCredentials: true });
          const newAccessToken = response.data.accessToken;

          setCookie('accessToken', newAccessToken);
          this.refreshSubscribers.forEach(callback => callback(newAccessToken));
          this.refreshSubscribers = [];
        } catch (refreshError) {
          if (isAxiosError(refreshError) && refreshError.response?.status === 401) {
            this.handleRefreshTokenError();
          }
        } finally {
          this.isRefreshing = false;
        }

        return retryOriginalRequest;
      }
    }
    if (errorStatus === 500) {
      alert('로그인을 다시 해주세요');
      deleteCookie('accessToken');
      window.location.href = '/';
    }

    return Promise.reject(error.response);
  };

  private handleRefreshTokenError() {
    deleteCookie('accessToken');
    window.location.href = '/';
  }
}

export default HttpClient;
