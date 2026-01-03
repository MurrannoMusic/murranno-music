# Quick Command Reference - Murranno Music RN

Essential commands for development, building, and deployment.

---

## 🚀 Development Commands

### Start Development Server
```bash
# Standard start
npx expo start

# Clear cache
npx expo start --clear

# With tunnel (for remote devices)
npx expo start --tunnel

# Start with dev client
npx expo start --dev-client
```

### Platform-Specific Start
```bash
# iOS Simulator (Mac only)
npx expo start --ios

# Android Emulator
npx expo start --android

# Web (for testing)
npx expo start --web
```

---

## 📦 Installation Commands

### Initial Setup
```bash
# Install dependencies
npm install
# or
yarn install

# Install Expo CLI globally
npm install -g expo-cli

# Install EAS CLI globally
npm install -g eas-cli
```

### Add Dependencies
```bash
# Add npm package
npm install package-name

# Add Expo SDK package
npx expo install expo-package-name

# Example: Add new icon library
npm install @expo/vector-icons
```

---

## 🧪 Testing Commands

### Run Tests
```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# With coverage
npm test -- --coverage

# Run specific test file
npm test -- Button.test.tsx

# Update snapshots
npm test -- -u
```

### Linting
```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

---

## 🏗️ Build Commands

### EAS Build

#### Initial Configuration
```bash
# Login to Expo
eas login

# Configure EAS for your project
eas build:configure
```

#### Development Builds
```bash
# iOS development build
eas build --profile development --platform ios

# Android development build
eas build --profile development --platform android

# Both platforms
eas build --profile development --platform all
```

#### Preview Builds (Internal Testing)
```bash
# iOS preview
eas build --profile preview --platform ios

# Android preview
eas build --profile preview --platform android

# Both platforms
eas build --profile preview --platform all
```

#### Production Builds (App Stores)
```bash
# iOS production
eas build --profile production --platform ios

# Android production
eas build --profile production --platform android

# Both platforms
eas build --profile production --platform all
```

### Local Builds
```bash
# iOS (requires Mac + Xcode)
npx expo run:ios

# Android
npx expo run:android

# With specific device
npx expo run:ios --device "iPhone 15 Pro"
npx expo run:android --device emulator-5554
```

---

## 📤 Submission Commands

### Submit to App Stores
```bash
# Submit to Apple App Store
eas submit --platform ios

# Submit to Google Play Store
eas submit --platform android

# Submit to both
eas submit --platform all
```

### Check Submission Status
```bash
# View submission history
eas submit:list

# View specific submission
eas submit:show <submission-id>
```

---

## 🔄 Update Commands (OTA)

### Publish Updates
```bash
# Publish to production
eas update --branch production --message "Bug fixes"

# Publish to staging
eas update --branch staging --message "New features"

# Publish to preview
eas update --branch preview --message "Testing changes"
```

### Manage Updates
```bash
# List all updates
eas update:list

# View specific update
eas update:view <update-id>

# Delete update
eas update:delete <update-id>

# Roll back to previous update
eas update:rollback
```

---

## 🔍 Information Commands

### Project Info
```bash
# View project configuration
eas config

# Check for issues
npx expo-doctor

# View environment info
npx expo-env-info
```

### Build Info
```bash
# List all builds
eas build:list

# View specific build
eas build:view <build-id>

# Download build artifact
eas build:download <build-id>

# Cancel build
eas build:cancel <build-id>
```

### Device Info
```bash
# List iOS simulators
xcrun simctl list devices available

# List Android emulators
emulator -list-avds

# List connected devices
adb devices
```

---

## 🗑️ Cleanup Commands

### Clear Caches
```bash
# Clear Metro bundler cache
npx expo start --clear

# Clear npm cache
npm cache clean --force

# Clear Expo cache
rm -rf .expo

# Full cleanup
rm -rf node_modules
rm package-lock.json
npm install
```

### iOS Cleanup
```bash
# Clean iOS build (Mac only)
cd ios
rm -rf Pods Podfile.lock
pod cache clean --all
pod deintegrate
pod install
cd ..
```

### Android Cleanup
```bash
# Clean Android build
cd android
./gradlew clean
cd ..

# Clear Android build cache
rm -rf android/.gradle
rm -rf android/app/build
```

---

## 🔧 Troubleshooting Commands

### When Metro Bundler Fails
```bash
npx expo start --clear
killall -9 node
npx expo start
```

### When Dependencies Break
```bash
rm -rf node_modules
rm package-lock.json
npm install
npx expo start --clear
```

### When iOS Build Fails
```bash
cd ios
pod deintegrate
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
npx expo start --clear
```

### When Android Build Fails
```bash
cd android
./gradlew clean
cd ..
npx expo start --clear
```

### Check Logs
```bash
# iOS simulator logs
xcrun simctl spawn booted log stream --level=debug

# Android logcat
adb logcat

# Expo logs
npx expo logs
```

---

## 🌐 Environment Commands

### Manage Environment Variables
```bash
# Copy example env
cp .env.example .env

# Edit environment
nano .env

# View current env
cat .env
```

### Manage Secrets (EAS)
```bash
# Create secret
eas secret:create

# List secrets
eas secret:list

# Delete secret
eas secret:delete <name>
```

---

## 📱 Device Commands

### iOS
```bash
# List available simulators
xcrun simctl list devices

# Boot simulator
xcrun simctl boot "iPhone 15 Pro"

# Take screenshot
xcrun simctl io booted screenshot screenshot.png
```

### Android
```bash
# List emulators
emulator -list-avds

# Start emulator
emulator -avd Pixel_5_API_33 &

# Install APK
adb install app-release.apk

# Uninstall app
adb uninstall com.murranno.music

# Take screenshot
adb shell screencap /sdcard/screenshot.png
adb pull /sdcard/screenshot.png
```

---

## 🔐 Credential Commands

### iOS Credentials
```bash
# List credentials
eas credentials

# Configure credentials
eas credentials:configure

# Remove credentials
eas credentials:remove
```

### Android Keystore
```bash
# Generate keystore
keytool -genkey -v -keystore murranno.keystore -alias murranno -keyalg RSA -keysize 2048 -validity 10000

# List keystore
keytool -list -v -keystore murranno.keystore
```

---

## 📊 Analytics Commands

### View Project Stats
```bash
# View build analytics
eas analytics

# View project details
eas project:info
```

---

## 🔄 Git Workflow

### Standard Development Flow
```bash
# Pull latest
git pull origin main

# Create branch
git checkout -b feature/new-feature

# Stage changes
git add .

# Commit
git commit -m "feat: add new feature"

# Push
git push origin feature/new-feature

# Create PR (on GitHub)
```

### Quick Fixes
```bash
# Hot fix
git checkout -b hotfix/fix-bug
# Make changes
git add .
git commit -m "fix: critical bug"
git push origin hotfix/fix-bug
```

---

## 🎯 Most Common Workflows

### First Time Setup
```bash
npm install
cp .env.example .env
# Edit .env
npx expo start
```

### Daily Development
```bash
git pull origin main
npm install
npx expo start --clear
```

### Before Committing
```bash
npm test
npm run lint
git add .
git commit -m "feat: description"
git push
```

### Creating a Build
```bash
# Update version in app.config.ts
eas build --profile production --platform all
# Wait ~15-20 min
eas submit --platform all
```

### Deploying Quick Fix
```bash
# Make code changes
eas update --branch production --message "Fixed bug"
# Users get update in minutes
```

---

## 💡 Pro Tips

### Speed Up Development
```bash
# Use tunnel for remote testing
npx expo start --tunnel

# Use specific device
npx expo start --ios --device="iPhone 15 Pro"

# Run tests in background
npm test -- --watch &
```

### Monitor Multiple Logs
```bash
# Terminal 1
npx expo start

# Terminal 2
npm test -- --watch

# Terminal 3
adb logcat | grep -i "error"
```

### Quick Test Cycle
```bash
# Save this as a script
npm test && npm run lint && npx expo start --clear
```

---

## 📚 Help Commands

```bash
# Expo help
npx expo --help

# EAS help
eas --help

# Specific command help
eas build --help
eas submit --help
eas update --help
```

---

## 🔗 Quick Links

- Expo Docs: https://docs.expo.dev
- EAS Docs: https://docs.expo.dev/eas/
- React Navigation: https://reactnavigation.org
- Supabase: https://supabase.com/docs

---

**Bookmark this page for quick reference! 📖**
