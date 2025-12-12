# React Native (Expo) Migration Guide

> **Important**: This migration must be done outside Lovable as React Native is not supported.

## Phase 1: Project Setup

### 1.1 Create New Expo Project

```bash
# Create new Expo project with TypeScript
npx create-expo-app murranno-music-rn --template expo-template-blank-typescript

cd murranno-music-rn

# Install Expo Dev Client for native module support
npx expo install expo-dev-client
```

### 1.2 Install Core Dependencies

```bash
# Navigation
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context

# State Management & Data Fetching
npm install @tanstack/react-query

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# Supabase
npm install @supabase/supabase-js @react-native-async-storage/async-storage

# UI Styling (NativeWind - Tailwind for React Native)
npm install nativewind
npm install --save-dev tailwindcss@3.3.2

# Date handling
npm install date-fns

# Toast notifications
npm install react-native-toast-message
```

### 1.3 Install Native Modules

```bash
# Core native features
npx expo install expo-notifications expo-device expo-constants
npx expo install expo-image-picker expo-camera
npx expo install expo-haptics expo-local-authentication
npx expo install expo-location expo-file-system expo-sharing
npx expo install expo-clipboard expo-web-browser expo-linking
npx expo install expo-av expo-document-picker
npx expo install expo-secure-store expo-auth-session expo-crypto
npx expo install @react-native-community/netinfo

# Charts
npm install react-native-chart-kit react-native-svg
```

---

## Phase 1.4: Project Structure

Create the following folder structure:

```
murranno-music-rn/
├── app.json
├── App.tsx
├── src/
│   ├── components/
│   │   ├── ui/                 # Base UI components
│   │   ├── cards/              # Card components
│   │   ├── forms/              # Form components
│   │   ├── layout/             # Layout components
│   │   └── audio/              # Audio player
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── hooks/
│   │   ├── data/               # Data fetching hooks
│   │   └── native/             # Native feature hooks
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthStack.tsx
│   │   ├── MainTabs.tsx
│   │   └── AdminStack.tsx
│   ├── screens/
│   │   ├── auth/
│   │   ├── main/
│   │   └── admin/
│   ├── services/
│   │   └── supabase.ts
│   ├── types/
│   │   └── *.ts                # Copy from current project
│   └── utils/
│       └── *.ts                # Copy from current project
├── assets/
└── tailwind.config.js
```

---

## Phase 1.5: Configure Supabase Client

Create `src/services/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '../types/supabase';

const SUPABASE_URL = 'https://nqfltvbzqxdxsobhedci.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xZmx0dmJ6cXhkeHNvYmhlZGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NzQ2MDUsImV4cCI6MjA3NTU1MDYwNX0.aEQ0gFX0hmC5yhpzCisd5l0GqJKHbFtqfVB0xpzCqcY';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for React Native
  },
});
```

---

## Phase 1.6: Configure app.json

Update `app.json` with deep linking and native configuration:

```json
{
  "expo": {
    "name": "Murranno Music",
    "slug": "murranno-music",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "scheme": "murranno",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.murranno.music",
      "infoPlist": {
        "NSCameraUsageDescription": "Allow camera access for profile photos",
        "NSPhotoLibraryUsageDescription": "Allow photo library access for cover art",
        "NSMicrophoneUsageDescription": "Allow microphone access for audio recording",
        "NSFaceIDUsageDescription": "Use Face ID for secure authentication"
      },
      "associatedDomains": [
        "applinks:nqfltvbzqxdxsobhedci.supabase.co"
      ]
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000000"
      },
      "package": "com.murranno.music",
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.RECORD_AUDIO",
        "android.permission.USE_BIOMETRIC",
        "android.permission.USE_FINGERPRINT"
      ],
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "murranno"
            },
            {
              "scheme": "https",
              "host": "nqfltvbzqxdxsobhedci.supabase.co",
              "pathPrefix": "/auth/v1/callback"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    },
    "plugins": [
      "expo-secure-store",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#ffffff"
        }
      ],
      [
        "expo-local-authentication",
        {
          "faceIDPermission": "Allow $(PRODUCT_NAME) to use Face ID."
        }
      ]
    ]
  }
}
```

---

## Phase 1.7: Configure NativeWind (Tailwind)

Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(0, 0%, 3.9%)',
        foreground: 'hsl(0, 0%, 98%)',
        primary: {
          DEFAULT: 'hsl(262.1, 83.3%, 57.8%)',
          foreground: 'hsl(210, 20%, 98%)',
        },
        secondary: {
          DEFAULT: 'hsl(0, 0%, 14.9%)',
          foreground: 'hsl(0, 0%, 98%)',
        },
        muted: {
          DEFAULT: 'hsl(0, 0%, 14.9%)',
          foreground: 'hsl(0, 0%, 63.9%)',
        },
        accent: {
          DEFAULT: 'hsl(0, 0%, 14.9%)',
          foreground: 'hsl(0, 0%, 98%)',
        },
        destructive: {
          DEFAULT: 'hsl(0, 62.8%, 30.6%)',
          foreground: 'hsl(0, 0%, 98%)',
        },
        border: 'hsl(0, 0%, 14.9%)',
        input: 'hsl(0, 0%, 14.9%)',
        ring: 'hsl(263.4, 70%, 50.4%)',
        card: {
          DEFAULT: 'hsl(0, 0%, 3.9%)',
          foreground: 'hsl(0, 0%, 98%)',
        },
      },
    },
  },
  plugins: [],
}
```

---

## Files to Copy Directly

These files can be copied with minimal changes:

### Types (copy entire folder)
- `src/types/analytics.ts`
- `src/types/campaign.ts`
- `src/types/news.ts`
- `src/types/payout.ts`
- `src/types/promotion.ts`
- `src/types/release.ts`
- `src/types/stats.ts`
- `src/types/user.ts`
- `src/types/wallet.ts`

### Utils (copy with minor edits)
- `src/utils/formatters.ts` ✅ No changes needed
- `src/utils/fileValidation.ts` ✅ No changes needed

### Contexts (update imports)
- `src/contexts/CartContext.tsx` - Update supabase import
- `src/contexts/AuthContext.tsx` - Update supabase import, replace toast

### Data Hooks (update imports)
These hooks primarily use Supabase and can be adapted:
- `useArtists.ts`, `useAnalytics.ts`, `useCampaigns.ts`
- `useReleases.ts`, `useWallet.ts`, `usePayouts.ts`
- `useNotifications.ts`, `useStats.ts`, `useTopTracks.ts`

---

## Edge Functions

All 80+ edge functions work unchanged - they're backend code that doesn't depend on the frontend framework.

---

## Next Steps

After completing Phase 1 setup:

1. **Phase 2**: Migrate core utilities and create data hooks
2. **Phase 3**: Build navigation architecture
3. **Phase 4**: Create UI component library
4. **Phase 5**: Implement all screens
5. **Phase 6**: Integrate native features
6. **Phase 7**: Testing & QA
7. **Phase 8**: Deployment with EAS Build

---

## Useful Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [NativeWind](https://www.nativewind.dev/)
- [Supabase React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [EAS Build](https://docs.expo.dev/build/introduction/)
