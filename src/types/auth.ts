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
