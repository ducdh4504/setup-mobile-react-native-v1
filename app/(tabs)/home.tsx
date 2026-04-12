import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUserProfile } from '@/hooks/queries/useUserProfile';

export default function HomeScreen() {
  const profile = useUserProfile();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <View className="flex-1 px-6 pt-2">
        <Text className="text-2xl font-bold text-slate-900">Dashboard</Text>
        <Text className="mt-1 text-slate-500">
          Example React Query call to <Text className="font-mono text-slate-700">GET /api/users/me</Text>
        </Text>

        <View className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-5">
          {profile.isLoading ? (
            <ActivityIndicator color="#0f172a" />
          ) : profile.isError ? (
            <Text className="text-sm leading-6 text-red-600">
              Unable to load profile. Confirm your API is running and CORS / JWT validation is configured for
              mobile clients.
            </Text>
          ) : (
            <>
              <Text className="text-xs font-medium uppercase tracking-wide text-slate-400">Signed in as</Text>
              <Text className="mt-1 text-lg font-semibold text-slate-900">{profile.data?.email}</Text>
              {profile.data?.displayName ? (
                <Text className="mt-1 text-slate-600">{profile.data.displayName}</Text>
              ) : null}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
