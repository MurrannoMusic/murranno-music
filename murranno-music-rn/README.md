# Murranno Music - React Native (Expo)

<div align="center">
  <h3>Music Distribution Platform - Mobile App</h3>
  <p>Complete React Native migration from web app with 100% visual fidelity</p>
</div>

## 📱 Overview

Murranno Music is a comprehensive music distribution platform enabling artists, labels, and agencies to manage their music releases, promotions, earnings, and analytics. This React Native (Expo) version provides a native mobile experience with full feature parity to the web application.

### Key Features

- ✅ **Multi-User Types**: Artist, Label, Agency, and Admin dashboards
- ✅ **Music Management**: Upload, distribute, and track releases
- ✅ **Campaign Tracking**: Manage promotional campaigns with real-time analytics
- ✅ **Earnings Dashboard**: Track royalties, payouts, and financial metrics
- ✅ **Analytics**: Comprehensive charts and insights
- ✅ **Native Features**: Camera, biometrics, haptics, push notifications
- ✅ **Offline Support**: AsyncStorage persistence and offline-first architecture
- ✅ **Beautiful UI**: NativeWind (Tailwind CSS) with dark mode

---

## 🏗️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native 0.79.2 with Expo SDK 54 |
| **Navigation** | React Navigation 7 |
| **Styling** | NativeWind 4 (Tailwind CSS for RN) |
| **State Management** | React Query 5 + Context API |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Forms** | React Hook Form + Zod |
| **Charts** | React Native Chart Kit |
| **Animations** | Reanimated 3 + Gesture Handler |
| **Icons** | Lucide React Native |
| **Testing** | Jest + React Native Testing Library |

---

## 📂 Project Structure

```
murranno-music-rn/
├── src/
│   ├── components/
│   │   ├── ui/              # 14 reusable UI components
│   │   ├── layout/          # Layout components
│   │   ├── modern/          # Modern card components
│   │   ├── form/            # Form components
│   │   └── shared/          # Shared components
│   ├── contexts/
│   │   ├── AuthContext.tsx  # Authentication state
│   │   ├── CartContext.tsx  # Shopping cart for promotions
│   │   ├── ThemeContext.tsx # Theme management
│   │   └── QueryProvider.tsx
│   ├── hooks/
│   │   ├── useAuth.ts       # Auth hooks
│   │   ├── useNativeFeatures.ts  # Native device features
│   │   ├── useAppNavigation.ts   # Type-safe navigation
│   │   ├── useReleases.ts   # Releases data
│   │   ├── useCampaigns.ts  # Campaign data
│   │   ├── useEarnings.ts   # Earnings data
│   │   └── useWallet.ts     # Wallet data
│   ├── navigation/
│   │   ├── RootNavigator.tsx      # Root navigation
│   │   ├── AuthNavigator.tsx      # Auth flow
│   │   ├── MainTabNavigator.tsx   # Main app tabs
│   │   ├── ArtistStackNavigator.tsx
│   │   ├── LabelStackNavigator.tsx
│   │   ├── AgencyStackNavigator.tsx
│   │   └── types.ts         # Navigation types
│   ├── screens/
│   │   ├── Auth/            # Login, Signup, etc.
│   │   ├── Dashboard/       # All dashboard screens
│   │   ├── Releases/        # Release management
│   │   ├── Promotions/      # Campaign management
│   │   ├── Earnings/        # Financial screens
│   │   └── Profile/         # User profile
│   ├── services/
│   │   └── supabase.ts      # Supabase client
│   ├── theme/
│   │   ├── colors.ts        # Color palette
│   │   ├── typography.ts    # Font styles
│   │   ├── spacing.ts       # Spacing scale
│   │   ├── shadows.ts       # Shadow presets
│   │   └── gradients.ts     # Gradient definitions
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── assets/                  # Images, fonts, icons
├── __tests__/               # Jest tests
├── App.tsx                  # App entry point
├── app.config.ts            # Expo configuration
├── eas.json                 # EAS Build configuration
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- npm or yarn
- Expo CLI: `npm install -g expo-cli eas-cli`
- For iOS: macOS with Xcode 14+
- For Android: Android Studio

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd murranno-music-rn

# 2. Install dependencies
npm install
# or
yarn install

# 3. Create environment file
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Start development server
npx expo start
```

### Running on Device/Simulator

#### Option 1: Expo Go (Quick Preview)

```bash
npx expo start

# Then:
# - iOS: Scan QR with Camera app
# - Android: Scan QR with Expo Go app
```

#### Option 2: Development Build (Recommended)

```bash
# Build for iOS
eas build --profile development --platform ios

# Build for Android  
eas build --profile development --platform android

# Install and run
npx expo start --dev-client
```

#### Option 3: Native Simulators

```bash
# iOS Simulator (Mac only)
npx expo start --ios

# Android Emulator
npx expo start --android
```

---

## 🔐 Environment Variables

Create a `.env` file in the root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://nqfltvbzqxdxsobhedci.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
EXPO_PUBLIC_APP_NAME=Murranno Music
EXPO_PUBLIC_APP_SCHEME=murranno
```

---

## 📱 Screens

The app includes **27+ screens** organized by user type:

### Authentication Flow
- Splash Screen
- Welcome Screen
- Login
- Signup
- Forgot Password
- Reset Password
- Email Verification
- User Type Selection

### Artist Dashboard
- Artist Dashboard (overview)
- Releases List & Detail
- Upload New Release
- Promotions & Campaigns
- Campaign Tracking
- Earnings & Wallet
- Analytics
- Profile & Settings

### Label Dashboard  
- Label Dashboard
- Artist Roster Management
- Artist Detail View
- Releases Management
- Label Analytics
- Payout Manager

### Agency Dashboard
- Agency Dashboard
- Client Management
- Campaign Manager
- Campaign Results
- Agency Analytics

### Admin Dashboard
- Admin Overview
- User Management
- Content Management
- Campaign Management
- Financial Management

---

## 🎨 UI Components

All components built with NativeWind (Tailwind CSS for React Native):

- **Button**: 6 variants (primary, secondary, outline, ghost, destructive, success)
- **Card**: Glass morphism effects, blur backgrounds
- **Input**: With icons, error states, and labels
- **Badge**: 6 color variants
- **Avatar**: Image with fallback
- **Progress**: Animated progress bar
- **Switch**: Animated toggle with haptics
- **Checkbox**: Animated with haptics
- **Tabs**: Default and pills variants
- **Toast**: Success/error/info notifications
- **Sheet**: Bottom sheet modal
- **Dialog**: Alert dialogs
- **Separator**: Horizontal/vertical dividers
- **Skeleton**: Loading states

---

## 🔧 Development

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

### Linting

```bash
npm run lint
```

### Clear Cache

```bash
npx expo start --clear
```

---

## 📦 Building for Production

### EAS Build Configuration

The project includes EAS Build configuration with 3 profiles:

1. **Development**: For testing with dev client
2. **Preview**: For internal testing (APK/IPA)
3. **Production**: For app stores (AAB/IPA)

### Build Commands

```bash
# Login to EAS
eas login

# Configure project
eas build:configure

# Build for iOS App Store
eas build --platform ios --profile production

# Build for Google Play Store
eas build --platform android --profile production

# Build for both platforms
eas build --platform all --profile production
```

### Submit to App Stores

```bash
# Submit to Apple App Store
eas submit --platform ios

# Submit to Google Play Store
eas submit --platform android
```

---

## 🔄 OTA Updates

Deploy instant JavaScript updates without app store approval:

```bash
# Publish update
eas update --branch production --message "Bug fixes and improvements"

# View updates
eas update:list
```

---

## 🌐 Deep Linking

The app supports deep linking with the following schemes:

- `murranno://` - Custom URL scheme
- `https://nqfltvbzqxdxsobhedci.supabase.co` - Universal links

### Example Deep Links

```
murranno://login
murranno://releases/123
murranno://artist/456
murranno://campaign/789
murranno://auth/callback?token=...
```

---

## 📊 Features Comparison: Web vs Native

| Feature | Web App | React Native |
|---------|---------|-------------|
| Authentication | ✅ | ✅ |
| Releases Management | ✅ | ✅ |
| Campaign Tracking | ✅ | ✅ |
| Earnings Dashboard | ✅ | ✅ |
| Analytics Charts | ✅ | ✅ |
| File Upload | ✅ | ✅ (Native picker) |
| Push Notifications | ❌ | ✅ |
| Biometric Auth | ❌ | ✅ |
| Haptic Feedback | ❌ | ✅ |
| Offline Support | Partial | ✅ |
| Camera Access | Browser only | ✅ Native |
| Share to Apps | ❌ | ✅ |

---

## 🐛 Troubleshooting

### Metro Bundler Issues

```bash
npx expo start --clear
rm -rf node_modules && npm install
```

### iOS Build Issues

```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Android Build Issues

```bash
cd android
./gradlew clean
cd ..
```

### NativeWind Not Working

Ensure `babel.config.js` has the correct preset order.

---

## 📄 License

Proprietary - All rights reserved

---

## 👥 Team

Murranno Music Development Team

---

## 📞 Support

For issues or questions:
- Email: support@murranno.com
- Documentation: [docs.murranno.com](https://docs.murranno.com)

---

**Built with ❤️ using React Native and Expo**
