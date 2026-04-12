import { Stack } from 'expo-router';

export default function AuthLayout() {
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
