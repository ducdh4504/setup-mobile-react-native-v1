/** Centralized React Query keys — keeps cache invalidation consistent at scale. */
export const queryKeys = {
  user: {
    profile: ['user', 'profile'] as const,
  },
} as const;
