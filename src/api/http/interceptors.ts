import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { ApiError, ApiErrorCode, normalizeError } from '@/api/errors';
import * as authApi from '@/api/modules/auth.api';
import { useAuthStore } from '@/store/authStore';

/**
 * Flag to prevent multiple simultaneous refresh attempts.
 * If the first refresh fails, subsequent requests won't retry.
 */
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

/**
 * Request interceptor: Attaches Bearer token to all requests.
 */
function requestInterceptor(config: InternalAxiosRequestConfig) {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

/**
 * Response interceptor: Handles 401 errors with token refresh retry.
 *
 * Flow:
 * 1. If 401: check if we have a refresh token
 * 2. If yes: attempt refresh (once, with flag to prevent duplicates)
 * 3. On success: update tokens, retry original request
 * 4. On failure: logout and reject
 * 5. For all errors: normalize to ApiError before rejecting
 */
async function responseInterceptor(error: AxiosError) {
  const status = error.response?.status;

  // Only attempt refresh if we got a 401
  if (status === 401) {
    const refreshToken = useAuthStore.getState().refreshToken;

    // No refresh token → logout immediately
    if (!refreshToken) {
      useAuthStore.getState().clearSession();
      return Promise.reject(normalizeError(error));
    }

    // Prevent multiple refresh calls if several requests fail at once
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = (async () => {
        try {
          const newTokens = await authApi.refreshToken({ refreshToken });
          useAuthStore.getState().setTokens({
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
          });
        } catch (refreshError) {
          // Refresh failed → logout and bubble error
          useAuthStore.getState().clearSession();
          const normalized = normalizeError(refreshError);
          // Mark as refresh failure so UI can handle accordingly
          // if (normalized instanceof ApiError) {
          //   normalized.code = ApiErrorCode.REFRESH_FAILED;
          // }
          if (normalized instanceof ApiError) {
            throw new ApiError({
              code: ApiErrorCode.REFRESH_FAILED,
              message: normalized.message,
              statusCode: normalized.statusCode,
              fieldErrors: normalized.fieldErrors,
              timestamp: normalized.timestamp,
            });
          }
          throw normalized;
        } finally {
          isRefreshing = false;
          refreshPromise = null;
        }
      })();
    }

    try {
      // Wait for refresh to complete, then retry original request
      await refreshPromise;
      const config = error.config as InternalAxiosRequestConfig;
      const newToken = useAuthStore.getState().accessToken;
      if (newToken && config) {
        config.headers.Authorization = `Bearer ${newToken}`;
        // Retry the original request with new token
        return import('axios').then((axiosModule) => axiosModule.default(config));
      }
    } catch (refreshError) {
      // Refresh or retry failed, reject with normalized error
      return Promise.reject(normalizeError(refreshError));
    }
  }

  // For non-401 errors, normalize and reject
  return Promise.reject(normalizeError(error));
}

/**
 * Apply request and response interceptors to axios instance.
 */
export function applyInterceptors(client: AxiosInstance) {
  client.interceptors.request.use(requestInterceptor);
  client.interceptors.response.use(
    (response) => response,
    responseInterceptor,
  );
}
