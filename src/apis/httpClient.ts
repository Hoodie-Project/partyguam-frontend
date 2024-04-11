import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
  isAxiosError,
} from 'axios';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';

const getResult = (response: AxiosResponse) => response;

class HttpClient {
  private client: AxiosInstance;

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

  private onRequestFulfilled(config: InternalAxiosRequestConfig) {
    const token = getCookie('accessToken');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  }

  private onRequestRejected(error: AxiosError) {
    return Promise.reject(error);
  }

  private onResponseFulfilled(response: AxiosResponse) {
    return response;
  }

  private onResponseRejected(error: AxiosError) {
    if (!isAxiosError(error) || !error.response) return Promise.reject(error);
    const { status: errorStatus } = error.response;

    if (errorStatus === 401) {
      const token = getCookie('accessToken');

      if (!token) {
        setCookie('signupData', error.response.data);
        window.location.href = '/join';
      } else if (token) {
        deleteCookie('accessToken');
        window.location.href = '/';
      }
    }

    if (errorStatus === 500) {
      alert('error.response');
      window.location.href = '/';
    }

    return Promise.reject(error.response);
  }
}

export default HttpClient;
