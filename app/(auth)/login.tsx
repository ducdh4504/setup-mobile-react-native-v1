import { Link, Stack } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useLogin } from '@/hooks/useAuth';
import { isValidEmail } from '@/utils/validators';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const login = useLogin();

  function validate() {
    const next: typeof errors = {};
    if (!email.trim()) {
      next.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      next.email = 'Enter a valid email';
    }
    if (!password) {
      next.password = 'Password is required';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit() {
    if (!validate()) return;
    login.mutate({ email: email.trim(), password });
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Sign in' }} />
      <SafeAreaView className="flex-1 bg-neutral-50" edges={['bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 }}
              showsVerticalScrollIndicator={false}
            >
            <Text className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</Text>
            <Text className="mt-2 text-base text-slate-500">Sign in to continue to your workspace.</Text>

            <View className="mt-10">
              <Input
                label="Email"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
                placeholder="you@company.com"
              />
              <Input
                label="Password"
                secureTextEntry
                autoComplete="password"
                value={password}
                onChangeText={setPassword}
                error={errors.password}
                placeholder="••••••••"
              />
            </View>

            {login.isError ? (
              <Text className="mb-4 text-center text-sm text-red-600">
                Could not sign in. Check your credentials or API base URL in `.env`.
              </Text>
            ) : null}

            <Button title="Sign in" loading={login.isPending} onPress={onSubmit} />

            <View className="mt-8 flex-row flex-wrap justify-center gap-1">
              <Text className="text-slate-500">New here?</Text>
              <Link href="/(auth)/register" asChild>
                <Pressable>
                  <Text className="font-semibold text-slate-900">Create an account</Text>
                </Pressable>
              </Link>
            </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}
