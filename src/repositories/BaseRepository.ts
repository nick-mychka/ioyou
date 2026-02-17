import {
  isCancel,
  AxiosError,
  type AxiosRequestConfig,
  type AxiosInstance,
  type AxiosResponse,
} from 'axios';
import { isPlainObject } from 'es-toolkit';

export type RequestConfig = Pick<AxiosRequestConfig, 'headers' | 'params' | 'signal'>;

export abstract class BaseRepository {
  protected client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  protected async request<T>(endpoint: string, config: AxiosRequestConfig = {}): Promise<T> {
    const { method = 'GET', ...restConfig } = config;

    try {
      const response: AxiosResponse<T> = await this.client.request<T>({
        url: endpoint,
        method,
        ...restConfig,
      });

      return response.data;
    } catch (error) {
      // Handle axios cancellation
      if (isCancel(error)) {
        throw new HttpRequestError('Request was cancelled', { canceled: true });
      } else {
        throw this.normalizeError(error);
      }
    }
  }

  // GET
  protected get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...config });
  }

  // POST
  protected post<T>(endpoint: string, data: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', data, ...config });
  }

  // PUT
  protected put<T>(endpoint: string, data: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', data, ...config });
  }

  // PATCH
  protected patch<T>(endpoint: string, data: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', data, ...config });
  }

  // DELETE
  protected delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...config });
  }

  private normalizeError(error: unknown): HttpRequestError {
    if (error instanceof AxiosError) {
      const { message, response } = error;

      const isContentTypeJson = (() => {
        const contentType: unknown = response?.headers['content-type'];
        return typeof contentType === 'string' && contentType.includes('application/json');
      })();

      const responseData: unknown = response?.data;

      let errors: Record<string, unknown> = {};

      if (isContentTypeJson && isPlainObject(responseData)) {
        if ('errors' in responseData && isPlainObject(responseData.errors)) {
          errors = responseData.errors;
        } else {
          errors = responseData;
        }
      }

      return new HttpRequestError(message, {
        status: response?.status,
        errors,
      });
    }

    if (error instanceof Error) {
      return new HttpRequestError(error.message);
    }

    return new HttpRequestError('Server error');
  }
}

export class HttpRequestError extends Error {
  public status?: number;
  public errors?: Record<string, unknown>;
  public canceled?: boolean;

  constructor(
    message: string,
    {
      status,
      errors,
      canceled,
    }: {
      canceled?: boolean;
      status?: number | undefined;
      errors?: Record<string, unknown>;
    } = {}
  ) {
    super(message);
    this.name = 'HttpRequestError';
    this.status = status ?? 0;
    this.errors = errors ?? {};
    this.canceled = canceled ?? false;
  }
}
