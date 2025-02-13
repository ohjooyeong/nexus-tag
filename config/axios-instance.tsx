import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
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
  const { method, url, headers = {} } = config;

  logOnDev(`[API] ${method?.toUpperCase()} ${url} | Request`);

  return Promise.resolve({ ...config, headers } as InternalAxiosRequestConfig);
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

    // error.response가 있는지 확인
    const status = error.response?.status ?? 0;
    const statusText = error.response?.statusText ?? 'Unknown Error';

    logOnDev(
      `[API] ${method?.toUpperCase()} ${url} | Error ${status} ${statusText} | ${message}`,
    );
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
