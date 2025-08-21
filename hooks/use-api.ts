import { useState, useCallback } from 'react';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface ApiMethods<T> {
  get: (url: string, params?: Record<string, string>) => Promise<T>;
  post: (url: string, data: any) => Promise<T>;
  put: (url: string, data: any) => Promise<T>;
  delete: (url: string) => Promise<T>;
}

export function useApi<T = any>(): [ApiResponse<T>, ApiMethods<T>] {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const makeRequest = useCallback(async (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    data?: any,
    params?: Record<string, string>
  ): Promise<T> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let fullUrl = `/api${url}`;
      
      if (params && method === 'GET') {
        const searchParams = new URLSearchParams(params);
        fullUrl += `?${searchParams.toString()}`;
      }

      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(fullUrl, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error en la petición');
      }

      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const api: ApiMethods<T> = {
    get: (url: string, params?: Record<string, string>) => makeRequest('GET', url, undefined, params),
    post: (url: string, data: any) => makeRequest('POST', url, data),
    put: (url: string, data: any) => makeRequest('PUT', url, data),
    delete: (url: string) => makeRequest('DELETE', url),
  };

  return [state, api];
}

// Hooks específicos para cada entidad
export function useTeachers() {
  return useApi();
}

export function useSubjects() {
  return useApi();
}

export function useClassrooms() {
  return useApi();
}

export function useCourses() {
  return useApi();
}

export function useSchedules() {
  return useApi();
}

export function useLevels() {
  return useApi();
}
