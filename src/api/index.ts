import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';
import qs from 'qs';

const createApiInstance = (baseURL = ''): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseURL,
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
  });

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (error instanceof AxiosError) {
        return Promise.reject(error);
      }

      const errorInstance = error instanceof Error ? error : new Error('An unknown error occurred');
      return Promise.reject(errorInstance);
    }
  );

  return instance;
};

// Pre-configured instances for different namespaces
export const apiClient = createApiInstance(import.meta.env.VITE_API_BASE_URL);

export const setBearerToken = (token: string) => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const deleteBearerToken = () => {
  delete apiClient.defaults.headers.common['Authorization'];
};
