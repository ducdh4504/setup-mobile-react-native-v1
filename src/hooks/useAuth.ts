import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';

import { authService } from '@/services/auth.service';
import type { LoginRequest, RegisterRequest } from '@/types/auth';

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: () => {
      router.replace('/(tabs)/home');
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterRequest) => authService.register(payload),
    onSuccess: () => {
      router.replace('/(tabs)/home');
    },
  });
}
