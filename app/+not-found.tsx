import { Link, Stack } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-center text-xl font-semibold text-slate-900">This screen does not exist.</Text>
        <Link href="/" asChild>
          <Pressable className="mt-6">
            <Text className="text-base font-semibold text-slate-900 underline">Go to start</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}
