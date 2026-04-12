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
import { useRegister } from '@/hooks/useAuth';
import { isValidEmail } from '@/utils/validators';

export default function RegisterScreen() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    displayName?: string;
    email?: string;
    password?: string;
  }>({});

  const register = useRegister();

  function validate() {
    const next: typeof errors = {};
    if (!displayName.trim()) {
      next.displayName = 'Name is required';
    }
    if (!email.trim()) {
      next.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      next.email = 'Enter a valid email';
    }
    if (!password || password.length < 8) {
      next.password = 'Use at least 8 characters';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit() {
    if (!validate()) return;
    register.mutate({
      displayName: displayName.trim(),
      email: email.trim(),
      password,
    });
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Create account' }} />
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
              <Text className="text-3xl font-bold tracking-tight text-slate-900">Get started</Text>
              <Text className="mt-2 text-base text-slate-500">Create your account in a few seconds.</Text>

              <View className="mt-10">
                <Input
                  label="Full name"
                  autoComplete="name"
                  value={displayName}
                  onChangeText={setDisplayName}
                  error={errors.displayName}
                  placeholder="Alex Doe"
                />
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
                  autoComplete="new-password"
                  value={password}
                  onChangeText={setPassword}
                  error={errors.password}
                  placeholder="••••••••"
                />
              </View>

              {register.isError ? (
                <Text className="mb-4 text-center text-sm text-red-600">
                  Registration failed. Ensure your backend exposes POST /api/auth/register.
                </Text>
              ) : null}

              <Button title="Create account" loading={register.isPending} onPress={onSubmit} />

              <View className="mt-8 flex-row flex-wrap justify-center gap-1">
                <Text className="text-slate-500">Already have an account?</Text>
                <Link href="/(auth)/login" asChild>
                  <Pressable>
                    <Text className="font-semibold text-slate-900">Sign in</Text>
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
