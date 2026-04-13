import { QueryClient } from '@tanstack/react-query';

import { ApiErrorCode, isApiError } from '@/api/errors';

/**
 * Global React Query configuration.
 * Centralized defaults for all queries in the app.
 *
 * Key decisions:
 * - Retry only on network/server errors, not client errors (4xx)
 * - Stale time: 60s (data is fresh for 1 minute before refetch)
 * - GC time: 10 minutes (keep data in cache for offline scenarios)
 * - No automatic retries for auth errors (handled by interceptor)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * Retry strategy:
       * - No retry on 4xx errors (client fault, retrying won't help)
       * - 2 retries on 5xx/network errors (server might recover)
       * - No retry on 401 (handled by token refresh interceptor)
       *
       * Custom logic: check if error is an ApiError with specific code
       */
      retry: (failureCount, error) => {
        // Don't retry more than 2 times
        if (failureCount > 2) {
          return false;
        }

        // Don't retry specific errors
        if (isApiError(error)) {
          // Auth errors are handled by interceptor (token refresh, logout)
          if (
            error.code === ApiErrorCode.UNAUTHORIZED ||
            error.code === ApiErrorCode.SESSION_EXPIRED ||
            error.code === ApiErrorCode.REFRESH_FAILED
          ) {
            return false;
          }

          // Client errors (4xx) shouldn't be retried
          if (error.statusCode >= 400 && error.statusCode < 500) {
            return false;
          }

          // Server errors (5xx) and network errors can be retried
          return true;
        }

        // For non-ApiError (network errors, timeouts), retry
        return true;
      },

      /**
       * Stale time: 60 seconds
       * Data is considered fresh for 1 minute.
       * After this, if component mounts and requests data, it will refetch in background.
       *
       * Adjust per query needs:
       * - User profile: higher (5 min, doesn't change often)
       * - Notifications: lower (30s, more time-sensitive)
       * - List: default (60s)
       */
      staleTime: 60 * 1000,

      /**
       * GC time (garbage collection): 10 minutes
       * After data becomes inactive (no component using it), keep in cache for 10 min.
       * Allows offline browsing if user navigates away and back quickly.
       */
      gcTime: 10 * 60 * 1000,

      /**
       * Network mode: "always"
       * Query will attempt to fetch even if device appears offline.
       * Axios interceptor will catch network errors.
       */
      networkMode: 'always',

      /**
       * Do NOT refetch on window focus in native app.
       * (window focus events don't apply to mobile)
       */
      refetchOnWindowFocus: false,

      /**
       * Do NOT refetch on mount if data is already in cache.
       * Only refetch if data is stale.
       */
      refetchOnMount: true,

      /**
       * Do NOT refetch on resubscribe (component re-mounts).
       */
      refetchOnReconnect: true,
    },

    mutations: {
      /**
       * Mutations (POST, PUT, DELETE) don't retry by default.
       * Side effects + retries = risky (could double-charge user, etc).
       * App should manually handle retry UI if needed.
       */
      retry: 0,
    },
  },
});

/**
 * Optional: Log queries/mutations in development.
 * Helpful for debugging caching behavior.
 */
if (__DEV__) {
  queryClient.getQueryCache().subscribe((event) => {
    // Uncomment to debug:
    // if (event.type === 'updated') {
    //   console.log('[Query Updated]', event.query.queryKey, event.query.state);
    // }
  });
}
