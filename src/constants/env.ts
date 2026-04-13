import Constants from 'expo-constants';

/**
 * Defines different environment profiles.
 * Each profile has its own API endpoints, logging level, and behavior.
 */
export type Environment = 'development' | 'staging' | 'production';

/**
 * Configuration that varies per environment.
 */
export type EnvironmentConfig = {
  apiGatewayUrl: string;
  authServiceUrl: string;

  // Logging
  enableConsoleLogging: boolean;
  enableNetworkLogging: boolean; // Log axios requests/responses
  logLevel: 'debug' | 'info' | 'warn' | 'error';

  // Network
  requestTimeoutMs: number; // Axios timeout
  maxRetries: number; // React Query max retries

  // Feature flags
  enableDevMenu: boolean;
  enableErrorBoundary: boolean;
};

/**
 * Environment profile definitions.
 * Customize per your backend setup.
 */
const profiles: Record<Environment, EnvironmentConfig> = {
  development: {
    // Local development (Android emulator)
    apiGatewayUrl: 'http://10.0.2.2:8080',
    authServiceUrl: 'http://10.0.2.2:8080',

    enableConsoleLogging: true,
    enableNetworkLogging: true,
    logLevel: 'debug',

    requestTimeoutMs: 30 * 1000, // 30s timeout in dev (allow slow server)
    maxRetries: 2,

    enableDevMenu: true,
    enableErrorBoundary: true,
  },

  staging: {
    // Staging environment for testing before production
    apiGatewayUrl: 'https://staging-api.example.com',
    authServiceUrl: 'https://staging-api.example.com',

    enableConsoleLogging: true,
    enableNetworkLogging: false, // Less verbose in staging
    logLevel: 'info',

    requestTimeoutMs: 20 * 1000, // 20s timeout
    maxRetries: 2,

    enableDevMenu: false,
    enableErrorBoundary: true,
  },

  production: {
    // Production environment
    apiGatewayUrl: 'https://api.example.com',
    authServiceUrl: 'https://api.example.com',

    enableConsoleLogging: false, // No console logs in production
    enableNetworkLogging: false,
    logLevel: 'error',

    requestTimeoutMs: 15 * 1000, // 15s timeout (stricter)
    maxRetries: 1, // Fewer retries in production (user might not wait)

    enableDevMenu: false,
    enableErrorBoundary: true,
  },
};

/**
 * Determine current environment.
 *
 * Priority (highest to lowest):
 * 1. EXPO_PUBLIC_ENV env var (set in .env or EAS build profile)
 * 2. app.config.ts extra.environment
 * 3. __DEV__ flag (development if running locally)
 * 4. Default to production (safest fallback)
 */
function getEnvironment(): Environment {
  const envVar = process.env.EXPO_PUBLIC_ENV?.toLowerCase();

  if (envVar === 'staging' || envVar === 'stage') {
    return 'staging';
  }
  if (envVar === 'development' || envVar === 'dev') {
    return 'development';
  }
  if (envVar === 'production' || envVar === 'prod') {
    return 'production';
  }

  // Check app.config.ts for environment hint
  const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;
  const configEnv = extra.environment as string | undefined;

  if (configEnv && configEnv in profiles) {
    return configEnv as Environment;
  }

  // In development, default to dev profile
  if (__DEV__) {
    return 'development';
  }

  // Production is safest default
  return 'production';
}

/**
 * Current environment (resolved at app startup).
 * Import this to check which environment we're running in.
 */
export const CURRENT_ENV = getEnvironment();

/**
 * Configuration for current environment.
 * All environment-specific settings come from here.
 */
export const config = profiles[CURRENT_ENV];

/**
 * Backward compatibility: export as `env` for existing code.
 * This matches the old API.
 */
export const env = {
  apiGatewayUrl: config.apiGatewayUrl,
  authServiceUrl: config.authServiceUrl,
} as const;
