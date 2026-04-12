import type { AuthUser } from '@/types/auth';

import { apiClient } from '../http/clients';

export async function fetchUserProfile(): Promise<AuthUser> {
  const { data } = await apiClient.get<AuthUser>('/api/users/me');
  return data;
}
