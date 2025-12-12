# React Native (Expo) Migration Guide

> **Important**: This migration must be done outside Lovable as React Native is not supported.

## Migration Progress

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Project Setup & Configuration | ✅ Complete |
| Phase 2 | Theme System & Design Tokens | ✅ Complete |
| Phase 3 | Core UI Components | ✅ Complete |
| Phase 4 | Navigation Setup | ✅ Complete |
| Phase 5 | Screen Templates | ✅ Complete |
| Phase 6 | Native Features Integration | ✅ Complete |
| Phase 7 | Testing & QA | ✅ Complete |
| Phase 8 | Deployment with EAS Build | 🔲 Pending |

---

## Phase 1: Project Setup ✅

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

# Animations & UI
npx expo install expo-blur expo-haptics expo-linear-gradient
npm install react-native-reanimated
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
npx expo install expo-splash-screen

# Charts
npm install react-native-chart-kit react-native-svg
```

---

## Phase 1.4: Project Structure

```
murranno-music-rn/
├── app.json
├── App.tsx
├── src/
│   ├── components/
│   │   ├── ui/                 # Base UI components (14 components)
│   │   ├── layout/             # Layout components
│   │   └── modern/             # Modern card components
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── hooks/
│   │   ├── useAppNavigation.ts
│   │   ├── useAuth.ts
│   │   └── useNativeFeatures.ts
│   ├── navigation/
│   │   ├── types.ts            # All navigation types
│   │   ├── AuthNavigator.tsx
│   │   ├── MainTabNavigator.tsx
│   │   ├── RootNavigator.tsx
│   │   ├── index.ts
│   │   └── stacks/
│   │       ├── DashboardNavigator.tsx
│   │       ├── ReleasesNavigator.tsx
│   │       ├── PromotionsNavigator.tsx
│   │       ├── EarningsNavigator.tsx
│   │       ├── ProfileNavigator.tsx
│   │       └── AdminNavigator.tsx
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── SignupScreen.tsx
│   │   ├── ArtistDashboardScreen.tsx
│   │   ├── ReleasesScreen.tsx
│   │   ├── PromotionsScreen.tsx
│   │   ├── EarningsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── SplashScreen.tsx
│   │   ├── WelcomeScreen.tsx
│   │   ├── NotFoundScreen.tsx
│   │   └── index.ts
│   ├── services/
│   │   └── supabase.ts
│   ├── theme/
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── shadows.ts
│   │   ├── gradients.ts
│   │   ├── animations.ts
│   │   ├── utilities.ts
│   │   └── index.ts
│   ├── types/
│   │   └── *.ts
│   └── utils/
│       └── *.ts
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
    detectSessionInUrl: false,
  },
});
```

---

## Phase 1.6: Configure app.json

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
            { "scheme": "murranno" },
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
      ["expo-notifications", { "icon": "./assets/notification-icon.png", "color": "#ffffff" }],
      ["expo-local-authentication", { "faceIDPermission": "Allow $(PRODUCT_NAME) to use Face ID." }]
    ]
  }
}
```

---

## Phase 2: Theme System ✅

All theme files are located in `migration-assets/theme/`:

| File | Description |
|------|-------------|
| `colors.ts` | Complete color palette matching web HSL values |
| `typography.ts` | Font families, sizes, weights, line heights |
| `spacing.ts` | Consistent spacing scale (0-20) |
| `shadows.ts` | Shadow presets (sm, md, lg, xl, glow) |
| `gradients.ts` | Gradient configurations for LinearGradient |
| `animations.ts` | Spring configs, timing presets, keyframes |
| `utilities.ts` | Helper functions (hexToRgba, createShadow, etc.) |
| `index.ts` | Unified export of all theme modules |

### Usage Example

```typescript
import { colors, typography, spacing, shadows, gradients } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient colors={gradients.primary.colors} style={styles.container}>
  <Text style={[typography.h1, { color: colors.foreground }]}>
    Hello World
  </Text>
</LinearGradient>
```

---

## Phase 3: Core UI Components ✅

14 components built in `migration-assets/components/ui/`:

| Component | Features |
|-----------|----------|
| `Button` | 6 variants, 3 sizes, loading state, haptics |
| `Card` | Glass morphism, blur, variants |
| `Input` | Icons, error states, labels |
| `Badge` | 6 variants matching web |
| `Avatar` | Image/fallback, sizes |
| `Progress` | Animated progress bar |
| `Switch` | Animated toggle with haptics |
| `Checkbox` | Animated with haptics |
| `Separator` | Horizontal/vertical |
| `Skeleton` | Loading states with presets |
| `Tabs` | Default and pills variants |
| `Toast` | Success/error/info variants |
| `Sheet` | Bottom sheet modal |
| `Dialog` | Dialog and AlertDialog |

### Usage Example

```typescript
import { Button, Card, Input, Badge } from '../components/ui';

<Card variant="glass">
  <Input label="Email" placeholder="Enter email" />
  <Button variant="primary" onPress={handleSubmit}>
    Submit
  </Button>
  <Badge variant="success">Active</Badge>
</Card>
```

---

## Phase 4: Navigation Setup ✅

Complete navigation architecture in `migration-assets/navigation/`:

### Navigation Structure

```
RootNavigator
├── AuthNavigator (when not authenticated)
│   ├── Splash
│   ├── Welcome
│   ├── Login
│   ├── Signup
│   ├── ForgotPassword
│   └── ResetPassword
│
├── MainTabNavigator (when authenticated)
│   ├── DashboardStack
│   │   ├── ArtistDashboard / LabelDashboard / AgencyDashboard
│   │   ├── Notifications
│   │   └── NewsDetail
│   ├── ReleasesStack
│   │   ├── Releases
│   │   ├── ReleaseDetail
│   │   └── Upload
│   ├── PromotionsStack
│   │   ├── Promotions
│   │   ├── CampaignTracking
│   │   └── CampaignPaymentSuccess
│   ├── EarningsStack
│   │   ├── Earnings
│   │   └── TransactionDetail
│   └── ProfileStack
│       ├── Profile
│       ├── ArtistProfile
│       ├── Settings
│       └── SubscriptionPlans
│
└── AdminNavigator (when admin)
    ├── AdminDashboard
    ├── AdminUsers
    ├── AdminContent
    ├── AdminCampaigns
    └── AdminSettings
```

### Features
- Type-safe navigation with full TypeScript support
- Deep linking (murranno://, https://supabase.co)
- Custom navigation hook with haptic feedback
- Glass blur effect on tab bar
- Platform-specific styling

### Usage Example

```typescript
import { useAppNavigation } from '../hooks/useAppNavigation';

const Component = () => {
  const { goToReleaseDetail, goBack, navigateToTab } = useAppNavigation();
  
  return (
    <Button onPress={() => goToReleaseDetail('release-123')}>
      View Release
    </Button>
  );
};
```

---

## Phase 5: Screen Templates ✅

7 main screens built in `migration-assets/screens/`:

| Screen | Features |
|--------|----------|
| `LoginScreen` | Glass card, social login, biometric auth |
| `SignupScreen` | Multi-step form, email verification |
| `ArtistDashboardScreen` | Stats carousel, recent activity, quick actions |
| `ReleasesScreen` | Filter tabs, status badges, FAB |
| `PromotionsScreen` | Service grid, cart, bundles |
| `EarningsScreen` | Wallet tabs, withdraw sheet, history |
| `ProfileScreen` | Avatar upload, streaming links, settings |

### Screen Features
- Matches web app design exactly
- Uses theme system consistently
- Haptic feedback on interactions
- Pull-to-refresh support
- Proper keyboard handling

---

## Phase 6: Native Features Integration ✅

### Implemented Hooks

All native hooks are in `migration-assets/hooks/useNativeFeatures.ts`:

| Hook | Features | Expo Module |
|------|----------|-------------|
| `useHaptics` | Impact, notification, selection feedback | expo-haptics |
| `useBiometricAuth` | Face ID, fingerprint, iris auth | expo-local-authentication |
| `useCamera` | Take photo, pick from gallery | expo-image-picker |
| `usePushNotifications` | Push token, local notifications, badge | expo-notifications |
| `useClipboard` | Copy, paste, check content | expo-clipboard |
| `useShare` | Share to other apps | expo-sharing |
| `useBrowser` | Open URLs, OAuth flows | expo-web-browser |
| `useNetwork` | Connection status, type, reachability | @react-native-community/netinfo |
| `useGeolocation` | Current position, watch position | expo-location |
| `useDevice` | Brand, model, OS, device type | expo-device |
| `useSecureStorage` | Encrypted key-value storage | expo-secure-store |
| `useFileSystem` | Read, write, cache, download, documents | expo-file-system, expo-document-picker |
| `useAudio` | Play, pause, seek, volume control | expo-av |
| `useAppState` | App lifecycle (active/background) | react-native |

### Usage Example

```typescript
import { useNativeFeatures } from '../hooks/useNativeFeatures';

const MyScreen = () => {
  const { haptics, camera, biometrics, audio } = useNativeFeatures();
  
  const handleSecureAction = async () => {
    await haptics.impact('medium');
    const { success } = await biometrics.authenticate('Confirm your identity');
    
    if (success) {
      const photo = await camera.takePhoto();
      await audio.loadAudio(photo?.uri || '');
    }
  };
  
  return <Button onPress={handleSecureAction}>Secure Action</Button>;
};
```

### Combined Hook

Use `useNativeFeatures()` to access all hooks at once:

```typescript
const { 
  haptics, biometrics, camera, pushNotifications,
  clipboard, share, browser, network,
  geolocation, device, secureStorage, fileSystem,
  audio, appState 
} = useNativeFeatures();
```

---

## Files to Copy Directly

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
- `useArtists.ts`, `useAnalytics.ts`, `useCampaigns.ts`
- `useReleases.ts`, `useWallet.ts`, `usePayouts.ts`
- `useNotifications.ts`, `useStats.ts`, `useTopTracks.ts`

---

## Edge Functions

All 80+ edge functions work unchanged - they're backend code that doesn't depend on the frontend framework.

---

## Migration Assets Location

All pre-built migration assets are in `migration-assets/`:

```
migration-assets/
├── theme/              # Complete theme system
├── components/
│   ├── ui/             # 14 UI components
│   ├── layout/         # Layout components
│   └── modern/         # Modern cards
├── navigation/         # Full navigation setup
│   └── stacks/         # Stack navigators
├── screens/            # 10 screen templates
├── hooks/              # Custom hooks
└── README.md           # Detailed component docs
```

---

## Phase 7: Testing & QA ✅ Complete

Comprehensive testing suite with unit tests, component tests, and integration tests.

### Test Files Created
| File | Description |
|------|-------------|
| `__tests__/setup.ts` | Jest setup with all native module mocks |
| `__tests__/hooks/useAuth.test.ts` | Authentication hook tests (9 tests) |
| `__tests__/hooks/useNativeFeatures.test.ts` | Native features tests (18 tests) |
| `__tests__/components/Button.test.tsx` | Button component tests (15 tests) |
| `__tests__/components/Card.test.tsx` | Card component tests (10 tests) |
| `__tests__/components/Input.test.tsx` | Input component tests (14 tests) |
| `__tests__/navigation/NavigationFlow.test.tsx` | Navigation flow tests (15 tests) |
| `jest.config.js` | Jest configuration |

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- __tests__/hooks/useAuth.test.ts

# Watch mode
npm test -- --watch
```

---

## Quick Start

1. Create Expo project and install dependencies (Phase 1)
2. Copy `migration-assets/theme/` to `src/theme/`
3. Copy `migration-assets/components/` to `src/components/`
4. Copy `migration-assets/navigation/` to `src/navigation/`
5. Copy `migration-assets/screens/` to `src/screens/`
6. Copy `migration-assets/hooks/` to `src/hooks/`
7. Copy `migration-assets/__tests__/` to `__tests__/`
8. Copy types from `src/types/` (web project)
9. Update imports to use new paths
10. Wire up App.tsx with RootNavigator
11. Run `npm test` to verify setup

---

## Useful Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [NativeWind](https://www.nativewind.dev/)
- [Supabase React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Jest React Native Testing](https://jestjs.io/docs/tutorial-react-native)
