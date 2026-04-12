import axios from 'axios';

import { env } from '@/constants/env';

import { applyInterceptors } from './interceptors';

function createClient(baseURL: string) {
  const client = axios.create({
    baseURL,
    timeout: 15_000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  applyInterceptors(client);
  return client;
}

/** General REST traffic through gateway / BFF. */
export const apiClient = createClient(env.apiGatewayUrl);

/** Auth-specific host — swap to a separate microservice URL in production if needed. */
export const authApiClient = createClient(env.authServiceUrl);
