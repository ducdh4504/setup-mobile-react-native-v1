import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/store/authStore';

/**
 * Auth layout guard.
 * Redirects logged-in users away from login/register screens.
 */
export default function AuthLayout() {
  const accessToken = useAuthStore((s) => s.accessToken);

  // If already logged in, redirect to home
  if (accessToken) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#fafafa' },
        headerTitleStyle: { fontWeight: '600', color: '#0f172a' },
        headerTintColor: '#0f172a',
        contentStyle: { backgroundColor: '#fafafa' },
      }}
    />
  );
}
