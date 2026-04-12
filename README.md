# setup-mobile-react-native-v1

Expo SDK 54 starter with Expo Router, Zustand, TanStack Query, Axios (interceptors + multi-base URLs), and NativeWind.

## Prerequisites

- Node.js 20+ recommended
- [Expo Go](https://expo.dev/go) or Android Studio / Xcode for emulators

## Install

```bash
npm install
```

Copy environment template and adjust hosts (Android emulator uses `10.0.2.2` to reach your PC’s localhost):

```bash
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

## Run

```bash
npm start
```

Then press `a` (Android), `i` (iOS), or `w` (web). Clear the Metro cache if styles look wrong:

```bash
npx expo start -c
```

## Backend alignment

Default REST paths (change in `src/api/modules/` to match Spring Boot):

- `POST /api/auth/login`, `POST /api/auth/register` → JSON body `{ email, password }` (register optional `displayName`); response `{ accessToken, refreshToken?, user: { id, email, displayName? } }`
- `GET /api/users/me` → current user (JWT from `Authorization: Bearer`)

## Scripts

| Command            | Description        |
| ------------------ | ------------------ |
| `npm start`        | Expo dev server    |
| `npm run android`  | Open Android       |
| `npm run ios`      | Open iOS           |
| `npm run web`      | Open web           |
| `npm run typecheck`| `tsc --noEmit`     |

## Project layout

- `app/` — Expo Router screens: `(auth)`, `(tabs)`, root redirect `index.tsx`
- `src/api/http` — Axios clients + interceptors (token + 401)
- `src/api/modules` — Thin HTTP modules per domain (swap URLs for microservices)
- `src/services` — App use-cases (auth orchestration)
- `src/store` — Zustand (persisted auth)
- `src/hooks` — React Query + mutations
- `src/components/ui` — Reusable UI
