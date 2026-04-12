import { useQuery } from '@tanstack/react-query';

import { fetchUserProfile } from '@/api/modules/user.api';
import { queryKeys } from '@/constants/query-keys';
import { useAuthStore } from '@/store/authStore';

export function useUserProfile() {
  const token = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: fetchUserProfile,
    enabled: !!token,
  });
}
