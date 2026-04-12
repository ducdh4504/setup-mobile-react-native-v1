import * as authApi from '@/api/modules/auth.api';
import { useAuthStore } from '@/store/authStore';
import type { LoginRequest, RegisterRequest } from '@/types/auth';

/**
 * Application layer: orchestrates API calls and updates global auth state.
 */
export const authService = {
  async login(credentials: LoginRequest) {
    const session = await authApi.login(credentials);
    useAuthStore.getState().setSession(
      {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      },
      session.user,
    );
    return session;
  },

  async register(payload: RegisterRequest) {
    const session = await authApi.register(payload);
    useAuthStore.getState().setSession(
      {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      },
      session.user,
    );
    return session;
  },

  logout() {
    useAuthStore.getState().clearSession();
  },
};
