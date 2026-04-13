import { Redirect } from 'expo-router';

import { useAuthStore } from '@/store/authStore';

/**
 * Main router entry point.
 *
 * This component is only rendered AFTER hydration completes (see app/_layout.tsx).
 * By the time we reach here, Zustand has loaded auth state from AsyncStorage.
 *
 * Flow:
 * 1. User is logged in? → Redirect to /(tabs)/home
 * 2. User is NOT logged in? → Redirect to /(auth)/login
 *
 * The layout guards in (auth)/_layout.tsx and (tabs)/_layout.tsx
 * will prevent direct navigation to protected screens.
 */
export default function Index() {
  const accessToken = useAuthStore((s) => s.accessToken);

  if (accessToken) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
