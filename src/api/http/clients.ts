import axios from 'axios';

import { config, env } from '@/constants/env';

import { applyInterceptors } from './interceptors';

/**
 * Create an axios instance with environment-specific settings.
 *
 * @param baseURL - API endpoint URL
 * @returns Configured axios instance with interceptors
 */
function createClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    timeout: config.requestTimeoutMs,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  applyInterceptors(client);
  return client;
}

/**
 * General REST traffic through gateway/BFF.
 * Used for most API calls (posts, users, etc).
 */
export const apiClient = createClient(env.apiGatewayUrl);

/**
 * Auth-specific client (login, register, refresh).
 * Can point to a separate microservice in production if needed.
 */
export const authApiClient = createClient(env.authServiceUrl);
