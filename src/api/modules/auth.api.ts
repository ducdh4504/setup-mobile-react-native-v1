import type { AuthSession, LoginRequest, RegisterRequest } from '@/types/auth';

import { authApiClient } from '../http/clients';

/**
 * Maps to typical Spring Security endpoints; adjust paths to match your backend.
 */
export async function login(body: LoginRequest): Promise<AuthSession> {
  const { data } = await authApiClient.post<AuthSession>('/api/auth/login', body);
  return data;
}

export async function register(body: RegisterRequest): Promise<AuthSession> {
  const { data } = await authApiClient.post<AuthSession>('/api/auth/register', body);
  return data;
}
