# iOS Setup Guide for Murranno Music

This guide covers all the necessary iOS configurations for the Capacitor plugins used in this project.

## Prerequisites

- macOS with Xcode 15 or higher
- iOS 13.0 or higher target
- Valid Apple Developer account (for device testing and distribution)
- CocoaPods installed

## Initial Setup

1. **Export and Clone Project**
   ```bash
   # Export project to GitHub, then clone locally
   git clone <your-repo-url>
   cd murranno-music
   npm install
   ```

2. **Add iOS Platform**
   ```bash
   npx cap add ios
   ```

3. **Build Web Assets**
   ```bash
   npm run build
   ```

4. **Install CocoaPods Dependencies**
   ```bash
   cd ios/App
   pod install
   cd ../..
   ```

5. **Sync with Native Project**
   ```bash
   npx cap sync ios
   ```

## Info.plist Configuration

Location: `ios/App/App/Info.plist`

Add the following keys inside the `<dict>` tag:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <!-- App Name -->
    <key>CFBundleDisplayName</key>
    <string>Murranno Music</string>
    
    <!-- Camera Permission -->
    <key>NSCameraUsageDescription</key>
    <string>This app needs access to your camera to take photos for your profile and album art.</string>
    
    <!-- Photo Library Permission -->
    <key>NSPhotoLibraryUsageDescription</key>
    <string>This app needs access to your photo library to select images for your profile and album art.</string>
    <key>NSPhotoLibraryAddUsageDescription</key>
    <string>This app needs permission to save photos to your library.</string>
    
    <!-- Location Permission -->
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>This app needs your location to show nearby events and concerts.</string>
    <key>NSLocationAlwaysUsageDescription</key>
    <string>This app needs your location to provide location-based features.</string>
    
    <!-- Microphone Permission (if needed for audio recording) -->
    <key>NSMicrophoneUsageDescription</key>
    <string>This app needs access to your microphone to record audio.</string>
    
    <!-- Face ID / Touch ID Permission -->
    <key>NSFaceIDUsageDescription</key>
    <string>This app uses Face ID for secure and convenient authentication.</string>
    
    <!-- Background Modes for Audio -->
    <key>UIBackgroundModes</key>
    <array>
        <string>audio</string>
        <string>remote-notification</string>
    </array>
    
    <!-- Allow HTTP connections (for development only) -->
    <key>NSAppTransportSecurity</key>
    <dict>
        <key>NSAllowsArbitraryLoads</key>
        <true/>
    </dict>
    
    <!-- Custom URL Scheme for Deep Linking (OAuth) -->
    <key>CFBundleURLTypes</key>
    <array>
        <dict>
            <key>CFBundleTypeRole</key>
            <string>Editor</string>
            <key>CFBundleURLName</key>
            <string>app.lovable.c3daad8632214cd78f32217f9f05ec3c</string>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>murranno</string>
            </array>
        </dict>
    </array>
    
    <!-- Push Notifications Capability -->
    <key>UIUserInterfaceStyle</key>
    <string>Automatic</string>
</dict>
</plist>
```

## Xcode Project Configuration

### 1. Open in Xcode
```bash
npx cap open ios
```

### 2. Configure Signing & Capabilities

In Xcode:
1. Select the `App` target
2. Go to **Signing & Capabilities** tab
3. Select your development team
4. Ensure Bundle Identifier matches: `app.lovable.c3daad8632214cd78f32217f9f05ec3c`

### 3. Add Required Capabilities

Click **+ Capability** and add:

- **Push Notifications**
- **Background Modes** (check Audio, Remote notifications)
- **Associated Domains** (optional, for Universal Links):
  - Add: `applinks:c3daad86-3221-4cd7-8f32-217f9f05ec3c.lovableproject.com`

## Deep Linking Setup for OAuth

The app is configured to handle OAuth callbacks via the custom URL scheme `murranno://`.

### Backend Configuration Required

Add the following redirect URL to your backend auth settings (Lovable Cloud):
```
murranno://callback
```

To configure this:
1. Open Lovable Cloud Dashboard
2. Go to Users → Auth Settings
3. Add `murranno://callback` to allowed redirect URLs

### Testing Deep Links

To test deep linking on iOS Simulator:
```bash
xcrun simctl openurl booted murranno://callback?access_token=test&refresh_token=test
```

On a physical device, you can create a test webpage with a link:
```html
<a href="murranno://callback?access_token=test&refresh_token=test">Test OAuth</a>
```

## Firebase Setup for Push Notifications

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use existing one
   - Add an iOS app with Bundle ID: `app.lovable.c3daad8632214cd78f32217f9f05ec3c`

2. **Download GoogleService-Info.plist**
   - Download the `GoogleService-Info.plist` file from Firebase Console
   - In Xcode, drag and drop it into the `App` folder
   - Make sure "Copy items if needed" is checked

3. **Configure APNs (Apple Push Notification Service)**
   - In Firebase Console, go to Project Settings → Cloud Messaging → iOS
   - Upload your APNs Authentication Key or APNs Certificate
   - Get the key from Apple Developer Portal → Certificates, IDs & Profiles → Keys

4. **Add Firebase to Podfile** (already configured in Capacitor)

The CocoaPods will automatically install Firebase dependencies when you run `pod install`.

## Build Settings

### Minimum Deployment Target
Ensure minimum iOS version is set to **13.0** in:
- Xcode: App Target → General → Deployment Info → iOS
- Podfile: `platform :ios, '13.0'`

### Swift Version
Ensure Swift version is **5.0** or higher in Build Settings.

## Testing on Physical Device

1. **Connect Device**: Connect your iPhone/iPad via USB
2. **Trust Computer**: On device, trust the computer
3. **Select Device**: In Xcode, select your device from the device dropdown
4. **Build and Run**: Press ⌘R or click the Play button

### Common Issues

**"Developer Mode Required" (iOS 16+)**
- On device: Settings → Privacy & Security → Developer Mode → Enable
- Restart device

**"Untrusted Developer"**
- On device: Settings → General → VPN & Device Management
- Trust your developer certificate

## Hot Reload Development

For hot reload during development:

1. Make sure `capacitor.config.ts` has the server URL configured:
   ```typescript
   server: {
     url: "https://c3daad86-3221-4cd7-8f32-217f9f05ec3c.lovableproject.com?forceHideBadge=true",
     cleartext: true
   }
   ```

2. Run the app on device/simulator
3. Make changes in Lovable - they'll reflect instantly

**Note**: Make sure your iOS device is on the same network as your development machine.

## Troubleshooting

### Build Errors

**"Pod install failed"**
```bash
cd ios/App
pod deintegrate
pod cache clean --all
pod install
cd ../..
```

**"No such module 'Capacitor'"**
- Clean build folder: Xcode → Product → Clean Build Folder (⇧⌘K)
- Run `npx cap sync ios`

**"Code signing error"**
- Make sure you have a valid Apple Developer account
- Check that Bundle Identifier is correctly set
- Verify signing certificate is valid

### Permission Issues

**Camera/Photo Library not working**
- Check Info.plist has usage descriptions
- Grant permissions in iOS Settings → Privacy

**Location not working**
- Enable Location Services on device
- Grant permissions in app
- Check Info.plist usage descriptions

**Push notifications not received**
- Verify `GoogleService-Info.plist` is added to project
- Check APNs certificate/key is configured in Firebase
- Test on physical device (push notifications don't work on simulator)

### Deep Link Issues

**OAuth callback not opening app**
- Verify URL scheme is correctly configured in Info.plist
- Check that `murranno://callback` is added to backend redirect URLs
- Test with `xcrun simctl openurl booted murranno://test`

**App opens but OAuth doesn't complete**
- Check console logs for errors
- Verify access_token and refresh_token are in URL parameters
- Ensure deep link handler is registered in App component

## Production Build

For App Store distribution:

1. **Archive the App**
   - In Xcode: Product → Archive
   - Wait for build to complete

2. **Distribute to App Store**
   - In Organizer: Select archive → Distribute App
   - Choose "App Store Connect"
   - Follow the prompts

3. **App Store Configuration**
   - Create app in [App Store Connect](https://appstoreconnect.apple.com)
   - Fill in app metadata, screenshots, description
   - Submit for review

### Required Screenshots Sizes
- 6.7" (iPhone 15 Pro Max): 1290 x 2796
- 6.5" (iPhone 11 Pro Max): 1242 x 2688
- 5.5" (iPhone 8 Plus): 1242 x 2208

## Privacy Manifest

iOS 17+ requires privacy manifests for certain APIs. Create `PrivacyInfo.xcprivacy` in the App folder:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>NSPrivacyAccessedAPITypes</key>
    <array>
        <dict>
            <key>NSPrivacyAccessedAPIType</key>
            <string>NSPrivacyAccessedAPICategoryUserDefaults</string>
            <key>NSPrivacyAccessedAPITypeReasons</key>
            <array>
                <string>CA92.1</string>
            </array>
        </dict>
    </array>
</dict>
</plist>
```

## Next Steps

- Test all native features on a physical device
- Set up TestFlight for beta testing
- Configure App Store Connect
- Submit for App Store review

## Resources

- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Firebase Cloud Messaging for iOS](https://firebase.google.com/docs/cloud-messaging/ios/client)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
