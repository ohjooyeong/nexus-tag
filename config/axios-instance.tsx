import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { getAuthToken } from '@/lib/auth';

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
});

const logOnDev = (message: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(message);
  }
};

export const onError = (status: number, message: string) => {
  const error = { status, message };
  throw error;
};

const onRequest = (
  config: AxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> => {
  const { method, url } = config;
  const token = getAuthToken();

  if (token) {
    // 헤더 설정을 올바르게 수정
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  logOnDev(`[API] ${method?.toUpperCase()} ${url} | Request`);

  // 전체 config를 반환
  return Promise.resolve(config as InternalAxiosRequestConfig);
};

const onErrorRequest = (error: AxiosError<AxiosRequestConfig>) => {
  switch (true) {
    case Boolean(error.config):
      console.log('에러: 요청 실패', error);
      break;
    case Boolean(error.request):
      console.log('에러: 응답 없음', error);
      break;
    default:
      console.log('에러:', error);
      break;
  }
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  const { method, url } = response.config;
  const { status } = response;

  logOnDev(`[API] ${method?.toUpperCase()} ${url} | Request ${status}`);

  return response;
};

const onErrorResponse = (error: AxiosError | Error) => {
  if (axios.isAxiosError(error)) {
    const { message } = error;
    const { method, url } = error.config as AxiosRequestConfig;
    const status = error.response?.status ?? 0;
    const statusText = error.response?.statusText ?? 'Unknown Error';

    logOnDev(
      `[API] ${method?.toUpperCase()} ${url} | Error ${status} ${statusText} | ${message}`,
    );

    if (status === 401) {
      const authCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth_token='));

      if (!authCookie) {
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname + window.location.search;
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
        }
      }
    }
  } else if (error instanceof Error && error.name === 'TimeoutError') {
    logOnDev(`[API] | TimeoutError ${error.toString()}`);
    onError(0, '요청 시간이 초과되었습니다.');
  } else {
    logOnDev(`[API] | Error ${error.toString()}`);
    onError(0, `에러가 발생했습니다. ${error.toString()}`);
  }

  return Promise.reject(error);
};

const setupInterceptors = (axiosInstance: AxiosInstance): AxiosInstance => {
  axiosInstance.interceptors.request.use(onRequest, onErrorRequest);
  axiosInstance.interceptors.response.use(onResponse, onErrorResponse);

  return axiosInstance;
};

setupInterceptors(axiosInstance);

export default axiosInstance;
