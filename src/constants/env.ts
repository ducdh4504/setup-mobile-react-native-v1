import Constants from 'expo-constants';

type Extra = {
  apiGatewayUrl?: string;
  authServiceUrl?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

/**
 * Runtime configuration. Expo injects `EXPO_PUBLIC_*` at bundle time from `.env`.
 * `app.config.ts` `extra` is useful for EAS Build profiles targeting different backends.
 */
export const env = {
  /** Primary BFF / API gateway (aggregates microservices). */
  apiGatewayUrl:
    process.env.EXPO_PUBLIC_API_GATEWAY_URL ??
    extra.apiGatewayUrl ??
    'http://10.0.2.2:8080',

  /** Dedicated auth service (login/register). Can match gateway URL if routed there. */
  authServiceUrl:
    process.env.EXPO_PUBLIC_AUTH_SERVICE_URL ??
    extra.authServiceUrl ??
    process.env.EXPO_PUBLIC_API_GATEWAY_URL ??
    extra.apiGatewayUrl ??
    'http://10.0.2.2:8080',
} as const;
