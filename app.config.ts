import type { ExpoConfig } from 'expo/config';

/**
 * Central Expo config. Use `extra` for native builds; prefer EXPO_PUBLIC_* in `.env` for dev.
 * Microservices: point each URL at your gateway or individual services per environment.
 */
export default (): ExpoConfig => ({
  name: 'setup-mobile-react-native-v1',
  slug: 'setup-mobile-react-native-v1',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'setupmobilereactnativev1',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: ['expo-router'],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    apiGatewayUrl: process.env.EXPO_PUBLIC_API_GATEWAY_URL,
    authServiceUrl: process.env.EXPO_PUBLIC_AUTH_SERVICE_URL,
  },
});
