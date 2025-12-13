# React Native Migration Checklist

## Pre-Migration Requirements

### Developer Environment
- [ ] Node.js v18+ installed
- [ ] Expo CLI installed globally (`npm install -g expo-cli`)
- [ ] Xcode installed (for iOS development, Mac only)
- [ ] Android Studio installed (for Android development)
- [ ] EAS CLI installed (`npm install -g eas-cli`)

### Accounts Required
- [ ] Expo account created (expo.dev)
- [ ] Apple Developer account (for iOS distribution)
- [ ] Google Play Console account (for Android distribution)

---

## Phase 1: Project Setup

### 1.1 Create Expo Project
```bash
npx create-expo-app murranno-mobile --template blank-typescript
cd murranno-mobile
```

### 1.2 Install Core Dependencies
```bash
# Navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# State & Data
npm install @tanstack/react-query @supabase/supabase-js
npm install zustand # optional for global state

# Forms
npm install react-hook-form @hookform/resolvers zod

# UI & Styling
npm install nativewind tailwindcss
npm install react-native-reanimated react-native-gesture-handler
npm install expo-blur expo-linear-gradient

# Utilities
npm install date-fns clsx

# Offline Support & Persistence
npm install react-native-mmkv @react-native-community/netinfo
npm install @tanstack/query-sync-storage-persister @tanstack/query-async-storage-persister
npm install @tanstack/react-query-persist-client
npm install @react-native-async-storage/async-storage
```

### 1.3 Install Native Modules
```bash
# Core Native Features
npm install expo-haptics expo-local-authentication
npm install expo-camera expo-image-picker
npm install expo-notifications expo-device
npm install expo-clipboard expo-sharing expo-web-browser
npm install expo-network expo-location
npm install expo-secure-store expo-file-system
npm install expo-av # for audio playback
npm install expo-application expo-constants
```

### 1.4 Configure NativeWind
```bash
npx tailwindcss init
```

Update `tailwind.config.js`:
```js
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

### 1.5 Copy Migration Assets
```bash
# Copy from web project
cp -r migration-assets/theme src/
cp -r migration-assets/components src/
cp -r migration-assets/screens src/
cp -r migration-assets/navigation src/
cp -r migration-assets/hooks src/
```

### 1.6 Setup Supabase Client
Create `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

## Phase 2: File Copying Checklist

### Types (copy directly)
- [ ] `src/types/wallet.ts`
- [ ] `src/types/release.ts` (if exists)
- [ ] `src/integrations/supabase/types.ts`

### Contexts (adapt for React Native)
- [ ] `src/contexts/AuthContext.tsx` → adapt storage
- [ ] `src/contexts/ToastContext.tsx` → use native toast

### Data Hooks (copy with minor edits)
- [ ] `src/hooks/useArtist.ts`
- [ ] `src/hooks/useReleases.ts`
- [ ] `src/hooks/useEarnings.ts`
- [ ] `src/hooks/useWallet.ts`
- [ ] `src/hooks/useCampaigns.ts`

---

## Phase 3: Screen Implementation Checklist

### Auth Screens
- [ ] SplashScreen
- [ ] WelcomeScreen
- [ ] LoginScreen
- [ ] SignupScreen
- [ ] ForgotPasswordScreen

### Artist Screens
- [ ] ArtistDashboardScreen
- [ ] ReleasesScreen
- [ ] ReleaseDetailScreen
- [ ] UploadScreen
- [ ] PromotionsScreen
- [ ] PromotionsDetailScreen
- [ ] EarningsScreen
- [ ] AnalyticsScreen
- [ ] WalletScreen
- [ ] ProfileScreen
- [ ] SettingsScreen
- [ ] NotificationsScreen

### Label Screens
- [ ] LabelDashboardScreen
- [ ] ArtistRosterScreen
- [ ] PayoutManagerScreen

### Agency Screens
- [ ] AgencyDashboardScreen
- [ ] ClientsScreen
- [ ] CampaignResultsScreen

---

## Phase 4: Navigation Setup

### 4.1 Root Navigator
- [ ] Configure AuthNavigator
- [ ] Configure MainTabNavigator
- [ ] Setup deep linking
- [ ] Add navigation theme

### 4.2 Tab Navigator
- [ ] Artist tabs (Home, Releases, Promotions, Earnings, Profile)
- [ ] Label tabs (Dashboard, Artists, Releases, Wallet, Settings)
- [ ] Agency tabs (Dashboard, Campaigns, Clients, Analytics, Settings)

### 4.3 Stack Navigators
- [ ] ArtistStackNavigator
- [ ] LabelStackNavigator
- [ ] AgencyStackNavigator

---

## Phase 5: Native Features Integration

### 5.1 Push Notifications
- [ ] Configure expo-notifications
- [ ] Request permissions
- [ ] Save token to database
- [ ] Handle incoming notifications

### 5.2 Biometric Authentication
- [ ] Check device support
- [ ] Implement secure login

### 5.3 Haptic Feedback
- [ ] Add to button presses
- [ ] Add to navigation
- [ ] Add to success/error states

### 5.4 Offline Support
- [ ] Setup MMKV storage (or AsyncStorage fallback)
- [ ] Configure React Query persistence
- [ ] Setup network status monitoring
- [ ] Add OfflineIndicator component
- [ ] Test offline data access
- [ ] Test mutation queuing
- [ ] Test sync on reconnect

---

## Phase 6: Testing

### 6.1 Unit Tests
```bash
npm install --save-dev jest @testing-library/react-native
```
- [ ] Test hooks
- [ ] Test utilities
- [ ] Test navigation

### 6.2 Device Testing
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on physical iOS device
- [ ] Test on physical Android device

---

## Phase 7: Build & Deployment

### 7.1 Configure EAS
```bash
eas login
eas build:configure
```

### 7.2 Update app.json
- [ ] Set correct bundle identifier
- [ ] Configure splash screen
- [ ] Configure app icons
- [ ] Set version numbers

### 7.3 Build Commands
```bash
# Development builds
eas build --profile development --platform ios
eas build --profile development --platform android

# Production builds
eas build --profile production --platform ios
eas build --profile production --platform android
```

### 7.4 Submit to Stores
```bash
eas submit --platform ios
eas submit --platform android
```

---

## Quick Reference Commands

```bash
# Start development
npx expo start

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android

# Build for testing
eas build --profile preview

# Update OTA
eas update --branch production

# Check project health
npx expo-doctor
```

---

## Environment Variables

Create `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## Troubleshooting

### Common Issues

1. **Metro bundler cache**: `npx expo start --clear`
2. **iOS pod issues**: `cd ios && pod install --repo-update`
3. **Android gradle issues**: `cd android && ./gradlew clean`
4. **Type errors**: Check `tsconfig.json` paths

### Useful Resources
- [Expo Documentation](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [NativeWind](https://nativewind.dev)
- [Supabase React Native](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [EAS Build](https://docs.expo.dev/build/introduction/)
