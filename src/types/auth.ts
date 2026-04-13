/** Align these DTOs with your Spring Boot (or other) API contracts. */
export type AuthUser = {
  id: string;
  email: string;
  displayName?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = LoginRequest & {
  displayName?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type AuthSession = AuthTokens & {
  user: AuthUser;
};

export type RefreshTokenRequest = {
  refreshToken: string;
};

export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken?: string;
};

/**
 * Error response from auth endpoints.
 * Contains validation errors for login/register forms.
 */
export type AuthError = {
  code: string;
  message: string;
  fieldErrors?: Array<{
    field: string;
    message: string;
  }>;
};
