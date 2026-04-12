import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from '@/store/authStore';

/**
 * Attaches Bearer token and handles global auth failures.
 * Extend the 401 branch later with refresh-token rotation against your auth service.
 */
export function applyInterceptors(client: AxiosInstance) {
  client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status as number | undefined;
      if (status === 401) {
        useAuthStore.getState().clearSession();
      }
      return Promise.reject(error);
    },
  );
}
