# Murranno Music - React Native Migration Instructions

## 🎯 Migration Overview

This document provides step-by-step instructions for taking the migrated React Native project and deploying it to production.

---

## 📋 Pre-Migration Checklist

Before starting the migration process, ensure you have:

- [ ] Access to the web app source code
- [ ] Supabase project credentials
- [ ] Apple Developer Account (for iOS) - $99/year
- [ ] Google Play Developer Account (for Android) - $25 one-time
- [ ] Development machine setup (Mac for iOS, Windows/Mac/Linux for Android)
- [ ] Node.js 18+ installed
- [ ] Expo CLI and EAS CLI installed globally

---

## 🚀 Step-by-Step Migration Process

### Phase 1: Project Setup (Day 1)

#### 1.1 Copy the Project

```bash
# Option 1: Clone from repository
git clone <repo-url> murranno-music-rn
cd murranno-music-rn

# Option 2: Copy from provided folder
cp -r /path/to/murranno-music-rn ./
cd murranno-music-rn
```

#### 1.2 Install Dependencies

```bash
# Install all dependencies
npm install
# or
yarn install

# This installs:
# - React Native 0.79.2
# - Expo SDK 54
# - Navigation libraries
# - Supabase client
# - NativeWind (Tailwind for RN)
# - All native modules
```

#### 1.3 Configure Environment

```bash
# Create .env file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Update the following in `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://nqfltvbzqxdxsobhedci.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_actual_key_here
```

#### 1.4 Verify Setup

```bash
# Run expo doctor to check for issues
npx expo-doctor

# Start development server
npx expo start

# If successful, you should see QR code
```

---

### Phase 2: Development Testing (Days 2-3)

#### 2.1 Test on Expo Go

```bash
# Start dev server
npx expo start

# Scan QR code with Expo Go app
# - Test authentication flow
# - Test navigation
# - Test basic features
```

#### 2.2 Create Development Build

Since this app uses native modules (camera, biometrics), you need a dev client:

```bash
# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build dev client for iOS
eas build --profile development --platform ios

# Build dev client for Android
eas build --profile development --platform android
```

Wait 10-20 minutes for builds to complete, then:

- **iOS**: Download IPA and install via Xcode or Apple Configurator
- **Android**: Download APK and install on device

#### 2.3 Test Native Features

```bash
# Run with dev client
npx expo start --dev-client

# Test checklist:
# - [ ] Login with biometrics
# - [ ] Camera for profile photos
# - [ ] Image picker for uploads
# - [ ] Push notifications
# - [ ] Haptic feedback
# - [ ] Deep linking
# - [ ] Offline support
```

---

### Phase 3: Data Migration (Day 4)

#### 3.1 Verify Supabase Connection

The app is already configured to use the existing Supabase database:

```typescript
// src/services/supabase.ts is configured with:
SUPABASE_URL: https://nqfltvbzqxdxsobhedci.supabase.co
```

#### 3.2 Test Database Operations

- [ ] User authentication (login/signup)
- [ ] Fetch releases
- [ ] Upload new release
- [ ] Update profile
- [ ] Track campaigns
- [ ] Earnings calculations

#### 3.3 Edge Functions

All existing Supabase edge functions work with the React Native app without changes:

- `get-artist-stats`
- `process-payout`
- `send-notification`
- etc.

---

### Phase 4: Assets and Branding (Day 5)

#### 4.1 App Icons

Create app icons for both platforms:

```bash
# Place your app icon at:
assets/icon.png (1024x1024 px, PNG)

# Adaptive icon for Android:
assets/adaptive-icon.png (1024x1024 px, PNG with transparent bg)
```

#### 4.2 Splash Screen

```bash
# Place splash screen at:
assets/splash.png (2048x2732 px for iPad)
```

#### 4.3 Copy Web Assets

```bash
# Copy images from web app
cp -r ../murranno-web/src/assets/* ./assets/

# Update image imports in screens if needed
```

---

### Phase 5: Testing (Days 6-7)

#### 5.1 Run Automated Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Target: 80% code coverage
```

#### 5.2 Manual Testing Checklist

**Authentication**
- [ ] Login with email/password
- [ ] Login with biometrics
- [ ] Signup flow
- [ ] Email verification
- [ ] Password reset
- [ ] Logout

**Artist Dashboard**
- [ ] View dashboard stats
- [ ] View releases list
- [ ] View release details
- [ ] Upload new release
- [ ] Create campaign
- [ ] Track campaign performance
- [ ] View earnings
- [ ] Request payout
- [ ] Update profile

**Label Dashboard**
- [ ] View roster
- [ ] View artist details
- [ ] Manage releases
- [ ] View analytics
- [ ] Process payouts

**Agency Dashboard**
- [ ] View clients
- [ ] Manage campaigns
- [ ] View results
- [ ] Track analytics

#### 5.3 Performance Testing

- [ ] App launches in < 3 seconds
- [ ] Smooth 60fps scrolling
- [ ] No memory leaks
- [ ] Offline functionality works
- [ ] Push notifications arrive promptly

---

### Phase 6: Preview Build (Day 8)

#### 6.1 Create Preview Build

```bash
# Build preview for internal testing
eas build --profile preview --platform all

# Distribute to testers via:
# - Direct download link
# - TestFlight (iOS)
# - Firebase App Distribution
```

#### 6.2 Beta Testing

Invite 10-20 beta testers to test:
- All user flows
- Different devices (iPhone, Android, tablets)
- Different OS versions
- Edge cases and errors

Collect feedback via:
- In-app feedback form
- Google Forms
- TestFlight feedback

---

### Phase 7: Production Build (Day 9)

#### 7.1 Pre-production Checklist

- [ ] All tests passing
- [ ] No console errors
- [ ] Beta testing completed
- [ ] Critical bugs fixed
- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] App Store listings prepared
- [ ] Screenshots taken (all devices)
- [ ] App description written
- [ ] Keywords optimized

#### 7.2 Build for Production

```bash
# Update version in app.config.ts
version: '1.0.0'
ios.buildNumber: '1'
android.versionCode: 1

# Build production releases
eas build --profile production --platform all
```

---

### Phase 8: App Store Submission (Days 10-11)

#### 8.1 Apple App Store

```bash
# Submit to App Store Connect
eas submit --platform ios
```

**Requirements:**
- App Store Connect app created
- App icon (1024x1024)
- Screenshots:
  - 6.7" (iPhone 15 Pro Max)
  - 6.5" (iPhone 11 Pro Max)
  - 5.5" (iPhone 8 Plus)
  - 12.9" iPad Pro
- App description (max 4000 chars)
- Keywords (max 100 chars)
- Privacy policy URL
- Support URL
- Age rating
- App category

**Review Process:**
- Typical review time: 24-48 hours
- Be prepared to respond to review feedback

#### 8.2 Google Play Store

```bash
# Submit to Play Console
eas submit --platform android
```

**Requirements:**
- Play Console app created
- App icon (512x512)
- Feature graphic (1024x500)
- Screenshots:
  - Phone (16:9 ratio)
  - 7" tablet
  - 10" tablet
- Short description (max 80 chars)
- Full description (max 4000 chars)
- Content rating completed
- Privacy policy URL
- App category

**Review Process:**
- Typical review time: 1-7 days
- Faster than iOS usually

---

### Phase 9: Post-Launch (Week 2+)

#### 9.1 Monitor Analytics

Set up monitoring:
- Firebase Analytics
- Sentry for error tracking
- App Store Connect analytics
- Google Play Console analytics

Track:
- Daily active users (DAU)
- Retention rate
- Crash-free rate (target: 99.9%)
- User ratings

#### 9.2 Over-the-Air Updates

Deploy instant updates for bug fixes:

```bash
# Publish OTA update
eas update --branch production --message "Bug fixes and improvements"

# Updates reach users within minutes
# No app store review needed
```

#### 9.3 Maintenance

Regular tasks:
- Weekly: Check crash reports, fix critical bugs
- Bi-weekly: Deploy OTA updates
- Monthly: Review analytics, plan features
- Quarterly: Major version updates

---

## 🛠️ Development Workflow

### Daily Development

```bash
# 1. Pull latest changes
git pull origin main

# 2. Install any new dependencies
npm install

# 3. Start dev server
npx expo start --clear

# 4. Make changes
# 5. Test on device/simulator
# 6. Commit and push
git add .
git commit -m "feat: add new feature"
git push origin main
```

### Creating a New Screen

```bash
# 1. Create screen file
touch src/screens/NewScreen.tsx

# 2. Add to navigation
# Edit src/navigation/types.ts
# Edit appropriate stack navigator

# 3. Test navigation
npx expo start --dev-client
```

### Adding a New Dependency

```bash
# For npm packages
npm install package-name

# For Expo packages
npx expo install expo-package-name

# Rebuild dev client if it's a native module
eas build --profile development --platform all
```

---

## 📊 Success Metrics

### Week 1 Targets
- [ ] 100 downloads
- [ ] 4.5+ star rating
- [ ] < 1% crash rate
- [ ] 50% day-1 retention

### Month 1 Targets
- [ ] 1,000 downloads
- [ ] 4.5+ star rating
- [ ] < 0.5% crash rate
- [ ] 30% day-30 retention

### Month 3 Targets
- [ ] 5,000 downloads
- [ ] 4.6+ star rating
- [ ] < 0.1% crash rate
- [ ] Feature parity with web app

---

## 🐛 Common Issues and Solutions

### Issue: Metro bundler fails to start
```bash
# Solution
npx expo start --clear
rm -rf node_modules
npm install
```

### Issue: Native modules not working
```bash
# Solution: Rebuild dev client
eas build --profile development --platform all
```

### Issue: Supabase connection fails
```bash
# Check .env file
cat .env

# Verify network connection
curl https://nqfltvbzqxdxsobhedci.supabase.co
```

### Issue: Build fails on EAS
```bash
# Check build logs
eas build:list

# Common fixes:
# - Update eas.json
# - Check app.config.ts
# - Verify dependencies in package.json
```

---

## 📞 Support Resources

- **Expo Documentation**: https://docs.expo.dev
- **React Navigation**: https://reactnavigation.org
- **Supabase**: https://supabase.com/docs
- **NativeWind**: https://www.nativewind.dev
- **Project Issues**: GitHub Issues

---

## ✅ Final Checklist

Before considering migration complete:

- [ ] All screens implemented
- [ ] All features working
- [ ] Tests passing (80%+ coverage)
- [ ] Performance optimized
- [ ] Accessibility checked
- [ ] Analytics configured
- [ ] Error tracking setup
- [ ] Push notifications tested
- [ ] Deep linking tested
- [ ] Offline mode works
- [ ] App Store listings complete
- [ ] Both apps submitted
- [ ] Documentation updated
- [ ] Team trained
- [ ] Users notified

---

**Estimated Total Timeline: 2-3 weeks**

- Week 1: Setup, development, testing
- Week 2: Builds, submission, review
- Week 3: Launch, monitoring, fixes

---

**Good luck with your migration! 🚀**
