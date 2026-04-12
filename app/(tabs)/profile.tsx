import { router } from 'expo-router';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  function onLogout() {
    queryClient.clear();
    authService.logout();
    router.replace('/(auth)/login');
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <View className="flex-1 px-6 pt-2">
        <Text className="text-2xl font-bold text-slate-900">Profile</Text>
        <Text className="mt-1 text-slate-500">Account details from the auth store.</Text>

        <View className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-5">
          <Text className="text-xs font-medium uppercase tracking-wide text-slate-400">Email</Text>
          <Text className="mt-1 text-base text-slate-900">{user?.email ?? '—'}</Text>
          {user?.displayName ? (
            <>
              <Text className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">Name</Text>
              <Text className="mt-1 text-base text-slate-900">{user.displayName}</Text>
            </>
          ) : null}
        </View>

        <View className="mt-auto pb-4">
          <Button title="Log out" variant="secondary" onPress={onLogout} />
        </View>
      </View>
    </SafeAreaView>
  );
}
