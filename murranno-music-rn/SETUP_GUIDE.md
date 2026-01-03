# Complete Setup Guide - Murranno Music React Native

This guide walks you through setting up the development environment and running the Murranno Music React Native app on your local machine and devices.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Project Installation](#project-installation)
4. [Configuration](#configuration)
5. [Running the App](#running-the-app)
6. [Testing](#testing)
7. [Building](#building)
8. [Deployment](#deployment)

---

## Prerequisites

### Required Software

#### For All Platforms

1. **Node.js** (v18 or later)
   ```bash
   # Check version
   node --version
   
   # Install from https://nodejs.org
   ```

2. **npm or Yarn**
   ```bash
   # Check versions
   npm --version
   yarn --version
   ```

3. **Git**
   ```bash
   git --version
   ```

4. **Expo CLI and EAS CLI**
   ```bash
   npm install -g expo-cli eas-cli
   ```

#### For iOS Development (macOS Only)

1. **Xcode** (v14.0 or later)
   - Download from Mac App Store
   - Install Command Line Tools:
     ```bash
     xcode-select --install
     ```

2. **CocoaPods**
   ```bash
   sudo gem install cocoapods
   ```

3. **iOS Simulator**
   - Comes with Xcode
   - Open Xcode > Preferences > Components to download simulators

#### For Android Development

1. **Android Studio**
   - Download from [developer.android.com](https://developer.android.com/studio)
   - Install Android SDK, Platform Tools, and Build Tools

2. **Java JDK** (v11 or v17)
   - Via Android Studio or [adoptium.net](https://adoptium.net)

3. **Environment Variables**
   ```bash
   # Add to ~/.zshrc or ~/.bash_profile (macOS/Linux)
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   
   # Windows
   # Set ANDROID_HOME in System Environment Variables
   ```

4. **Android Emulator**
   - Open Android Studio > Tools > AVD Manager
   - Create a new virtual device (recommended: Pixel 5, Android 13+)

---

## Environment Setup

### 1. Verify Installations

```bash
# Node and npm
node --version  # Should be v18+
npm --version

# Expo CLI
expo --version

# EAS CLI  
eas --version

# Git
git --version
```

### 2. iOS Setup (macOS only)

```bash
# Verify Xcode installation
xcodebuild -version

# Verify CocoaPods
pod --version

# List available simulators
xcrun simctl list devices available
```

### 3. Android Setup

```bash
# Verify Android SDK
adb --version

# List running emulators
adb devices

# Start an emulator
emulator -avd <emulator-name>
```

---

## Project Installation

### Step 1: Clone the Repository

```bash
# Clone from GitHub
git clone https://github.com/your-org/murranno-music-rn.git
cd murranno-music-rn

# Or if you received the project as a zip
unzip murranno-music-rn.zip
cd murranno-music-rn
```

### Step 2: Install Dependencies

```bash
# Using npm
npm install

# Or using yarn (recommended)
yarn install
```

This will install:
- React Native and Expo dependencies
- Navigation libraries
- Supabase client
- UI and styling libraries
- Native modules
- Dev dependencies

### Step 3: Verify Installation

```bash
# Check for any issues
npx expo-doctor

# This will identify missing dependencies or configuration issues
```

---

## Configuration

### 1. Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://nqfltvbzqxdxsobhedci.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here

# App Configuration
EXPO_PUBLIC_APP_NAME=Murranno Music
EXPO_PUBLIC_APP_SCHEME=murranno
```

**Important**: Replace `your_actual_anon_key_here` with your Supabase anonymous key.

### 2. Supabase Setup

If you don't have Supabase credentials:

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use existing: `nqfltvbzqxdxsobhedci`
3. Go to Settings > API
4. Copy the `URL` and `anon/public` key
5. Update `.env` file

### 3. EAS Configuration (Optional)

For building and deploying with EAS:

```bash
# Login to your Expo account
eas login

# Configure the project
eas build:configure
```

This creates/updates `eas.json` with your project ID.

### 4. App Configuration

Edit `app.config.ts` if needed:

```typescript
// Update these values
name: 'Your App Name',
slug: 'your-app-slug',
owner: 'your-expo-username',
```

---

## Running the App

### Method 1: Expo Go (Quickest)

**Best for**: Rapid development without native modules

```bash
# Start the development server
npx expo start

# Or with specific options
npx expo start --clear  # Clear cache
npx expo start --tunnel # Use tunnel for remote access
```

Then:
1. Download **Expo Go** app on your phone:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code:
   - **iOS**: Use Camera app
   - **Android**: Use Expo Go app

### Method 2: Development Build (Recommended)

**Best for**: Testing native features (camera, biometrics, etc.)

#### First-time Setup

```bash
# Build development client for iOS
eas build --profile development --platform ios

# Build development client for Android
eas build --profile development --platform android

# Or build for both
eas build --profile development --platform all
```

After the build completes (10-20 minutes):
- **iOS**: Download the IPA and install via Xcode or TestFlight
- **Android**: Download the APK and install on device

#### Running with Dev Client

```bash
npx expo start --dev-client
```

### Method 3: Native Simulators

#### iOS Simulator (macOS only)

```bash
# Start with iOS simulator
npx expo start --ios

# Or specify a simulator
npx expo start --ios --simulator="iPhone 15 Pro"
```

#### Android Emulator

```bash
# Make sure emulator is running first
emulator -avd Pixel_5_API_33 &

# Then start Expo
npx expo start --android
```

### Method 4: Physical Device via USB

#### iOS (via Xcode)

1. Connect iPhone via USB
2. Trust the computer on iPhone
3. ```bash
   npx expo start --ios
   ```
4. Xcode will open and install to device

#### Android (via ADB)

1. Enable Developer Options on Android
2. Enable USB Debugging
3. Connect via USB
4. ```bash
   adb devices  # Verify device is detected
   npx expo start --android
   ```

---

## Testing

### Run Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- LoginScreen.test.tsx
```

### Test Structure

```
__tests__/
├── setup.ts              # Test configuration
├── components/
│   ├── Button.test.tsx
│   ├── Card.test.tsx
│   └── Input.test.tsx
├── hooks/
│   ├── useAuth.test.ts
│   └── useNativeFeatures.test.ts
└── navigation/
    └── NavigationFlow.test.tsx
```

---

## Building

### Preview Build (Internal Testing)

```bash
# Build preview APK/IPA
eas build --profile preview --platform all

# Builds are signed and can be distributed via:
# - Direct download link
# - TestFlight (iOS)
# - Firebase App Distribution
# - Internal testing tracks
```

### Production Build (App Stores)

```bash
# Build for production
eas build --profile production --platform all

# iOS will create an IPA for App Store
# Android will create an AAB for Play Store
```

### Local Builds

For testing locally without EAS:

```bash
# iOS (requires macOS)
npx expo run:ios

# Android
npx expo run:android
```

---

## Deployment

### Submit to App Stores

#### Apple App Store

```bash
# Submit to App Store Connect
eas submit --platform ios

# You'll need:
# - Apple Developer Account ($99/year)
# - App Store Connect app created
# - App icon (1024x1024)
# - Screenshots
# - Privacy policy URL
```

#### Google Play Store

```bash
# Submit to Google Play Console
eas submit --platform android

# You'll need:
# - Google Play Developer Account ($25 one-time)
# - Service account JSON key
# - App icon (512x512)
# - Feature graphic
# - Store listing details
```

### Over-The-Air (OTA) Updates

Deploy updates instantly without app store review:

```bash
# Publish update
eas update --branch production --message "Bug fixes"

# Updates are delivered to existing users within minutes
# Works for JavaScript/React changes only (not native code)
```

---

## Troubleshooting

### Common Issues

#### 1. Metro Bundler Cache Issues

```bash
npx expo start --clear
rm -rf .expo node_modules
npm install
```

#### 2. iOS Pod Installation Issues

```bash
cd ios
pod deintegrate
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

#### 3. Android Build Issues

```bash
cd android
./gradlew clean
cd ..
npx expo start --clear
```

#### 4. "Unable to resolve module" Errors

```bash
# Clear all caches
rm -rf node_modules
rm package-lock.json
npm install
npx expo start --clear
```

#### 5. NativeWind Styles Not Applying

- Verify `babel.config.js` has correct presets
- Ensure `global.css` is imported in `App.tsx`
- Clear Metro cache: `npx expo start --clear`

#### 6. Supabase Connection Issues

- Verify `.env` file exists and has correct values
- Check Supabase project is active
- Verify network connection
- Check Supabase status: [status.supabase.com](https://status.supabase.com)

### Getting Help

- **Expo Issues**: [expo.dev/help](https://expo.dev/help)
- **React Native**: [reactnative.dev/help](https://reactnative.dev/help)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Project Issues**: Open GitHub issue

---

## Next Steps

1. ✅ Complete environment setup
2. ✅ Run app in development mode
3. ✅ Test authentication flow
4. ✅ Test all user dashboards
5. ✅ Create preview build for testing
6. ✅ Submit to app stores

---

**Happy Coding! 🚀**
